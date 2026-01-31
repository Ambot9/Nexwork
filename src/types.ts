export interface Feature {
  id: string;
  name: string;
  projects: ProjectStatus[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;      // When first project moved to in_progress
  completedAt?: string;    // When all projects completed
  stats?: {
    totalCommits?: number;
    filesChanged?: number;
    linesAdded?: number;
    linesDeleted?: number;
  };
}

export interface ProjectStatus {
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  branch: string;
  worktreePath: string;
  lastUpdated?: string;
}

export interface UserConfig {
  searchPaths?: string[];  // Custom paths to search for repos, e.g. ["FE/*", "BE/*", "services/*"]
  exclude?: string[];      // Folders to exclude
}

export interface Config {
  workspaceRoot: string;
  features: Feature[];
  projectLocations: {
    [key: string]: string; // project name -> relative path from workspace
  };
  userConfig?: UserConfig;
}

export interface ConflictInfo {
  feature1: string;
  feature2: string;
  conflictingProjects: string[];
}

export interface ExecutionPlan {
  sequential: string[][]; // Array of batches that can run in parallel
  conflicts: ConflictInfo[];
}
