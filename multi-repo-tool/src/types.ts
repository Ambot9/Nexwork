export interface Feature {
  id: string;
  name: string;
  projects: ProjectStatus[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStatus {
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  branch: string;
  worktreePath: string;
  lastUpdated?: string;
}

export interface UserConfig {
  searchPaths?: string[];  // Glob patterns like "FE/*", "services/*"
  exclude?: string[];      // Folders to exclude
  workspaceRoot?: string;  // Workspace root path
}

export interface Config {
  workspaceRoot: string;
  features: Feature[];
  projectLocations: {
    [key: string]: string; // project name -> relative path from workspace
  };
  userConfig: UserConfig;
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
