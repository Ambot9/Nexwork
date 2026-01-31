import * as fs from 'fs';
import * as path from 'path';
import { Config, Feature, ProjectStatus } from '../types';

const CONFIG_FILE = '.multi-repo-config.json';

export class ConfigManager {
  private configPath: string;

  constructor(private workspaceRoot: string) {
    this.configPath = path.join(workspaceRoot, CONFIG_FILE);
  }

  /**
   * Auto-detect workspace root by looking for .multi-repo-config.json or common folders
   */
  static findWorkspaceRoot(startPath: string): string {
    let currentPath = path.resolve(startPath);
    const maxDepth = 10; // Prevent infinite loop
    let depth = 0;

    while (depth < maxDepth) {
      // Check if .multi-repo-config.json exists
      const configPath = path.join(currentPath, CONFIG_FILE);
      if (fs.existsSync(configPath)) {
        return currentPath;
      }

      // Check if this looks like a workspace root (has FE/BE or similar folders)
      const hasWorkspaceFolders = ['FE', 'BE', 'frontend', 'backend', 'services', 'packages', 'apps']
        .some(folder => fs.existsSync(path.join(currentPath, folder)));
      
      if (hasWorkspaceFolders) {
        return currentPath;
      }

      // Move up one directory
      const parentPath = path.dirname(currentPath);
      if (parentPath === currentPath) {
        // Reached filesystem root
        break;
      }
      currentPath = parentPath;
      depth++;
    }

    // Fallback to original path
    return startPath;
  }

  /**
   * Initialize configuration file
   */
  async initialize(): Promise<void> {
    if (fs.existsSync(this.configPath)) {
      console.log('Configuration already exists.');
      return;
    }

    const defaultConfig: Config = {
      workspaceRoot: this.workspaceRoot,
      features: [],
      projectLocations: await this.discoverProjects()
    };

    this.saveConfig(defaultConfig);
    console.log(`✅ Initialized configuration at: ${this.configPath}`);
  }

  /**
   * Auto-discover projects - supports custom search paths or defaults to FE/BE
   */
  private async discoverProjects(): Promise<{ [key: string]: string }> {
    const projects: { [key: string]: string } = {};
    
    // Try to load user config if it exists
    const userConfigPath = path.join(this.workspaceRoot, '.multi-repo.user.json');
    let searchPaths = ['FE', 'BE', 'services', 'packages', 'apps'];
    let exclude = ['node_modules', 'dist', 'build', '.git'];
    
    if (fs.existsSync(userConfigPath)) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
      searchPaths = userConfig.searchPaths || searchPaths;
      exclude = userConfig.exclude || exclude;
    }

    // Search in all specified paths
    for (const searchPath of searchPaths) {
      const folderPath = path.join(this.workspaceRoot, searchPath);
      
      if (!fs.existsSync(folderPath)) {
        continue;
      }

      const items = fs.readdirSync(folderPath);
      
      for (const item of items) {
        // Skip excluded folders
        if (exclude.includes(item)) {
          continue;
        }

        const itemPath = path.join(folderPath, item);
        const stats = fs.statSync(itemPath);
        
        // Check if it's a directory and contains a .git folder
        if (stats.isDirectory()) {
          const gitPath = path.join(itemPath, '.git');
          if (fs.existsSync(gitPath)) {
            const relativePath = path.join(searchPath, item);
            projects[item] = relativePath;
          }
        }
      }
    }

    // If no projects found with default paths, search current directory
    if (Object.keys(projects).length === 0) {
      const items = fs.readdirSync(this.workspaceRoot);
      for (const item of items) {
        if (exclude.includes(item)) {
          continue;
        }

        const itemPath = path.join(this.workspaceRoot, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          const gitPath = path.join(itemPath, '.git');
          if (fs.existsSync(gitPath)) {
            projects[item] = item;
          }
        }
      }
    }

    return projects;
  }

  /**
   * Load configuration
   */
  loadConfig(): Config {
    // Try to find config file by walking up the directory tree
    let searchPath = this.workspaceRoot;
    let configPath = path.join(searchPath, CONFIG_FILE);
    const maxDepth = 10;
    let depth = 0;

    while (!fs.existsSync(configPath) && depth < maxDepth) {
      const parentPath = path.dirname(searchPath);
      if (parentPath === searchPath) {
        break; // Reached filesystem root
      }
      searchPath = parentPath;
      configPath = path.join(searchPath, CONFIG_FILE);
      depth++;
    }

    if (!fs.existsSync(configPath)) {
      throw new Error('Configuration not found. Run "multi-repo init" first.');
    }

    const content = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content);
    
    // Update workspace root if we found config in parent directory
    if (searchPath !== this.workspaceRoot) {
      this.workspaceRoot = searchPath;
      this.configPath = configPath;
    }
    
    return config;
  }

  /**
   * Save configuration
   */
  saveConfig(config: Config): void {
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Add a new feature
   */
  addFeature(feature: Feature): void {
    const config = this.loadConfig();
    config.features.push(feature);
    this.saveConfig(config);
  }

  /**
   * Update a feature
   */
  updateFeature(featureId: string, updates: Partial<Feature>): void {
    const config = this.loadConfig();
    const featureIndex = config.features.findIndex(f => f.id === featureId);
    
    if (featureIndex === -1) {
      throw new Error(`Feature ${featureId} not found`);
    }

    config.features[featureIndex] = {
      ...config.features[featureIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveConfig(config);
  }

  /**
   * Update project status within a feature
   */
  updateProjectStatus(
    featureId: string,
    projectName: string,
    status: ProjectStatus['status']
  ): void {
    const config = this.loadConfig();
    const feature = config.features.find(f => f.id === featureId);
    
    if (!feature) {
      throw new Error(`Feature ${featureId} not found`);
    }

    const project = feature.projects.find(p => p.name === projectName);
    
    if (!project) {
      throw new Error(`Project ${projectName} not found in feature ${featureId}`);
    }

    const oldStatus = project.status;
    project.status = status;
    project.lastUpdated = new Date().toISOString();
    
    // Track when feature started (first project moved to in_progress)
    if (status === 'in_progress' && !feature.startedAt) {
      feature.startedAt = new Date().toISOString();
    }
    
    // Track when feature completed (all projects completed)
    if (status === 'completed') {
      const allCompleted = feature.projects.every(p => p.status === 'completed');
      if (allCompleted && !feature.completedAt) {
        feature.completedAt = new Date().toISOString();
      }
    }
    
    // Remove completedAt if moving back from completed
    if (oldStatus === 'completed' && status !== 'completed') {
      delete feature.completedAt;
    }
    
    feature.updatedAt = new Date().toISOString();
    
    this.saveConfig(config);
  }

  /**
   * Get a feature by ID
   */
  getFeature(featureId: string): Feature | undefined {
    const config = this.loadConfig();
    return config.features.find(f => f.id === featureId);
  }

  /**
   * Get all features
   */
  getAllFeatures(): Feature[] {
    const config = this.loadConfig();
    return config.features;
  }

  /**
   * Delete a feature
   */
  deleteFeature(featureId: string): void {
    const config = this.loadConfig();
    config.features = config.features.filter(f => f.id !== featureId);
    this.saveConfig(config);
  }

  /**
   * Get project path
   */
  getProjectPath(projectName: string): string {
    const config = this.loadConfig();
    const relativePath = config.projectLocations[projectName];
    
    if (!relativePath) {
      throw new Error(`Project ${projectName} not found in configuration`);
    }

    return path.join(this.workspaceRoot, relativePath);
  }

  /**
   * Get all available projects
   */
  getAvailableProjects(): string[] {
    const config = this.loadConfig();
    return Object.keys(config.projectLocations);
  }
}
