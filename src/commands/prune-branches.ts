import { ConfigManager } from '../core/config-manager';
import chalk from 'chalk';
import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import * as path from 'path';

export async function pruneBranchesCommand(workspaceRoot: string): Promise<void> {
  console.log(chalk.blue('🧹 Prune Feature Branches'));
  
  try {
    const configManager = new ConfigManager(workspaceRoot);
    const config = configManager.loadConfig();
    
    const allProjects = Object.keys(config.projectLocations);
    
    if (allProjects.length === 0) {
      console.log(chalk.yellow('No projects found.'));
      return;
    }

    console.log(chalk.gray(`\nScanning ${allProjects.length} projects for feature branches...\n`));

    const branchesToDelete: { project: string, branch: string, path: string }[] = [];

    // Scan all projects for feature branches
    for (const projectName of allProjects) {
      try {
        const projectPath = path.join(workspaceRoot, config.projectLocations[projectName]);
        const git = simpleGit(projectPath);
        
        const branches = await git.branchLocal();
        const featureBranches = branches.all.filter(b => 
          b.toLowerCase().startsWith('feature/') || b.startsWith('Feature/')
        );

        if (featureBranches.length > 0) {
          console.log(chalk.cyan(`📦 ${projectName}: ${featureBranches.length} feature branches`));
          for (const branch of featureBranches) {
            branchesToDelete.push({ project: projectName, branch, path: projectPath });
          }
        }
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Could not scan ${projectName}: ${error}`));
      }
    }

    if (branchesToDelete.length === 0) {
      console.log(chalk.green('\n✅ No feature branches found to prune!'));
      return;
    }

    console.log(chalk.yellow(`\n\nFound ${branchesToDelete.length} feature branches across ${allProjects.length} projects:`));
    
    // Group by project
    const byProject = branchesToDelete.reduce((acc, item) => {
      if (!acc[item.project]) acc[item.project] = [];
      acc[item.project].push(item.branch);
      return acc;
    }, {} as Record<string, string[]>);

    for (const [project, branches] of Object.entries(byProject)) {
      console.log(chalk.gray(`  ${project}: ${branches.join(', ')}`));
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.red(`\n⚠️  Delete all ${branchesToDelete.length} feature branches? This cannot be undone!`),
        default: false
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }

    console.log(chalk.blue('\n🗑️  Deleting branches...\n'));

    let successCount = 0;
    let errorCount = 0;

    for (const item of branchesToDelete) {
      try {
        const git = simpleGit(item.path);
        await git.deleteLocalBranch(item.branch, true); // force delete
        console.log(chalk.gray(`  ✓ ${item.project}: ${item.branch}`));
        successCount++;
      } catch (error) {
        console.log(chalk.red(`  ✗ ${item.project}: ${item.branch} - ${error}`));
        errorCount++;
      }
    }

    console.log(chalk.blue('\n\n📊 Summary'));
    console.log(chalk.green(`✅ Deleted: ${successCount}`));
    if (errorCount > 0) {
      console.log(chalk.red(`❌ Errors: ${errorCount}`));
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}
