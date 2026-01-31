import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { Config, Feature, ProjectStatus, UserConfig } from '../types';

const CONFIG_FILE = '.multi-repo-config.json';
const USER_CONFIG_FILE = '.multi-repo.config.json';

export class ConfigManager {
  private configPath: string;
  private userConfigPath: string;

  constructor(private workspaceRoot: string) {
    this.configPath = path.join(workspaceRoot, CONFIG_FILE);
    this.userConfigPath = path.join(workspaceRoot, USER_CONFIG_FILE);
  }

  /**
   * Initialize configuration file
   */
  async initialize(): Promise<void> {
    if (fs.existsSync(this.configPath)) {
      console.log('Configuration already exists.');
      const config = this.loadConfig();
      
      // Re-discover projects in case new ones were added
      const projects = await this.discoverProjects();
      config.projectLocations = projects;
      this.saveConfig(config);
      
      return;
    }

    // Load user config if exists
    const userConfig = this.loadUserConfig();

    const defaultConfig: Config = {
      workspaceRoot: this.workspaceRoot,
      features: [],
      projectLocations: await this.discoverProjects(),
      userConfig
    };

    this.saveConfig(defaultConfig);
    console.log(`✅ Initialized configuration at: ${this.configPath}`);
  }

  /**
   * Load user configuration (custom search paths)
   */
  private loadUserConfig(): UserConfig {
    if (fs.existsSync(this.userConfigPath)) {
      const content = fs.readFileSync(this.userConfigPath, 'utf-8');
      return JSON.parse(content);
    }

    // Default search paths
    return {
      searchPaths: ['FE/*', 'BE/*', 'services/*', 'packages/*', 'apps/*'],
      exclude: ['node_modules', 'dist', 'build', '.git', 'coverage']
    };
  }

  /**
   * Create user config file
   */
  createUserConfig(searchPaths: string[]): void {
    const userConfig: UserConfig = {
      searchPaths,
      exclude: ['node_modules', 'dist', 'build', '.git', 'coverage'],
      workspaceRoot: this.workspaceRoot
    };

    fs.writeFileSync(this.userConfigPath, JSON.stringify(userConfig, null, 2));
    console.log(`✅ Created user config at: ${this.userConfigPath}`);
  }

  /**
   * Auto-discover projects using glob patterns
   */
  private async discoverProjects(): Promise<{ [key: string]: string }> {
    const projects: { [key: string]: string } = {};
    const userConfig = this.loadUserConfig();
    const searchPaths = userConfig.searchPaths || ['**/*'];
    const excludePatterns = userConfig.exclude || [];

    for (const pattern of searchPaths) {
      try {
        const matches = await glob(pattern, {
          cwd: this.workspaceRoot,
          absolute: false,
          ignore: excludePatterns.map(e => `**/${e}/**`)
        });

        for (const match of matches) {
          const fullPath = path.join(this.workspaceRoot, match);
          const stats = fs.statSync(fullPath);

          if (stats.isDirectory()) {
            const gitPath = path.join(fullPath, '.git');
            if (fs.existsSync(gitPath)) {
              // Use the directory name as project name
              const projectName = path.basename(match);
              projects[projectName] = match;
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not search pattern "${pattern}": ${error}`);
      }
    }

    return projects;
  }

  /**
   * Load configuration
   */
  loadConfig(): Config {
    if (!fs.existsSync(this.configPath)) {
      throw new Error('Configuration not found. Run "multi-repo init" first.');
    }

    const content = fs.readFileSync(this.configPath, 'utf-8');
    return JSON.parse(content);
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

    project.status = status;
    project.lastUpdated = new Date().toISOString();

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
