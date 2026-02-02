import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';
import { ProjectStatus } from '../types';

export class WorktreeManager {
  private git: SimpleGit;
  private defaultBranch: string | null = null;

  constructor(private repoPath: string) {
    this.git = simpleGit(repoPath);
  }

  /**
   * Get the default branch (main, master, staging, develop, etc.)
   */
  private async getDefaultBranch(): Promise<string> {
    if (this.defaultBranch) {
      return this.defaultBranch;
    }

    try {
      // Try to get default branch from remote
      const remotes = await this.git.getRemotes(true);
      if (remotes.length > 0) {
        const result = await this.git.raw(['symbolic-ref', 'refs/remotes/origin/HEAD']);
        const match = result.match(/refs\/remotes\/origin\/(.+)/);
        if (match) {
          this.defaultBranch = match[1].trim();
          return this.defaultBranch;
        }
      }
    } catch (error) {
      // Fallback: try common branch names
    }

    // Fallback: check for common default branches
    const branches = await this.git.branch();
    const commonDefaults = ['main', 'master', 'staging', 'develop', 'dev'];
    
    for (const defaultName of commonDefaults) {
      if (branches.all.includes(defaultName)) {
        this.defaultBranch = defaultName;
        return this.defaultBranch;
      }
    }

    // Last resort: use current branch
    this.defaultBranch = branches.current;
    return this.defaultBranch;
  }

  /**
   * Get current branch
   */
  async getCurrentBranch(): Promise<string> {
    const status = await this.git.status();
    return status.current || 'unknown';
  }

  /**
   * Check if current branch is up-to-date with remote
   */
  async checkIfUpToDate(branchName: string): Promise<{ upToDate: boolean; behind: number; ahead: number }> {
    try {
      // Fetch latest from remote
      await this.git.fetch();
      
      // Get tracking branch
      const status = await this.git.status();
      
      return {
        upToDate: status.behind === 0,
        behind: status.behind,
        ahead: status.ahead
      };
    } catch (error) {
      // If no remote or other error, assume up-to-date
      return { upToDate: true, behind: 0, ahead: 0 };
    }
  }

  /**
   * Create a worktree for a feature branch
   */
  async createWorktree(
    featureId: string,
    projectName: string,
    featureTrackingDir?: string
  ): Promise<{ path: string; sourceBranch: string; warning?: string }> {
    const branchName = `feature/${featureId}`;
    
    // If featureTrackingDir is provided, create worktree inside it
    // Otherwise, use the old behavior (next to project)
    const worktreePath = featureTrackingDir 
      ? path.join(featureTrackingDir, projectName)
      : path.join(path.dirname(this.repoPath), `${projectName}-${featureId}`);

    try {
      // Check if worktree already exists
      if (fs.existsSync(worktreePath)) {
        const currentBranch = await this.getCurrentBranch();
        console.log(`Worktree already exists at: ${worktreePath}`);
        return { path: worktreePath, sourceBranch: currentBranch };
      }

      // Get current branch (where user is standing)
      const currentBranch = await this.getCurrentBranch();
      
      // Check if current branch is up-to-date
      const updateStatus = await this.checkIfUpToDate(currentBranch);
      let warning: string | undefined;
      
      if (!updateStatus.upToDate && updateStatus.behind > 0) {
        warning = `⚠️  Branch '${currentBranch}' is ${updateStatus.behind} commit(s) behind remote. Consider running 'git pull' first.`;
      }

      // Create new branch from current branch if it doesn't exist
      const branches = await this.git.branch();
      if (!branches.all.includes(branchName)) {
        // Create branch from current branch (not default!)
        await this.git.checkoutBranch(branchName, currentBranch);
        await this.git.checkout(currentBranch); // Go back to original branch
      }

      // Create worktree
      await this.git.raw(['worktree', 'add', worktreePath, branchName]);
      
      console.log(`✅ Created worktree from '${currentBranch}': ${worktreePath}`);
      return { path: worktreePath, sourceBranch: currentBranch, warning };
    } catch (error) {
      throw new Error(`Failed to create worktree: ${error}`);
    }
  }

  /**
   * Remove a worktree
   */
  async removeWorktree(worktreePath: string): Promise<void> {
    try {
      await this.git.raw(['worktree', 'remove', worktreePath]);
      console.log(`✅ Removed worktree: ${worktreePath}`);
    } catch (error) {
      throw new Error(`Failed to remove worktree: ${error}`);
    }
  }

  /**
   * Delete a branch
   */
  async deleteBranch(branchName: string): Promise<void> {
    try {
      await this.git.deleteLocalBranch(branchName, true); // force delete
    } catch (error) {
      throw new Error(`Failed to delete branch: ${error}`);
    }
  }

  /**
   * List all worktrees for this repository
   */
  async listWorktrees(): Promise<string[]> {
    try {
      const result = await this.git.raw(['worktree', 'list', '--porcelain']);
      const worktrees: string[] = [];
      const lines = result.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('worktree ')) {
          worktrees.push(line.replace('worktree ', ''));
        }
      }
      
      return worktrees;
    } catch (error) {
      throw new Error(`Failed to list worktrees: ${error}`);
    }
  }

  /**
   * Check if a branch exists
   */
  async branchExists(branchName: string): Promise<boolean> {
    const branches = await this.git.branch();
    return branches.all.includes(branchName);
  }

  /**
   * Check if repository is clean (no uncommitted changes)
   */
  async isClean(): Promise<boolean> {
    const status = await this.git.status();
    return status.isClean();
  }

  /**
   * Get status of the worktree
   */
  async getWorktreeStatus(worktreePath: string): Promise<ProjectStatus['status']> {
    if (!fs.existsSync(worktreePath)) {
      return 'pending';
    }

    const git = simpleGit(worktreePath);
    const status = await git.status();
    
    // Check if there are any commits on this branch
    try {
      const log = await git.log({ maxCount: 1 });
      if (log.total > 0) {
        return 'in_progress';
      }
    } catch (error) {
      // No commits yet
    }

    return 'pending';
  }

  /**
   * Merge feature branch back to default branch
   */
  async mergeFeatureBranch(featureBranch: string): Promise<void> {
    try {
      const defaultBranch = await this.getDefaultBranch();
      await this.git.checkout(defaultBranch);
      await this.git.merge([featureBranch]);
      console.log(`✅ Merged ${featureBranch} into ${defaultBranch}`);
    } catch (error) {
      throw new Error(`Failed to merge branch: ${error}`);
    }
  }

  /**
   * Delete feature branch
   */
  async deleteFeatureBranch(featureBranch: string): Promise<void> {
    try {
      await this.git.deleteLocalBranch(featureBranch);
      console.log(`✅ Deleted branch: ${featureBranch}`);
    } catch (error) {
      throw new Error(`Failed to delete branch: ${error}`);
    }
  }
}
