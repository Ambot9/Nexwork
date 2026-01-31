import inquirer from 'inquirer';
import { ConfigManager } from '../core/config-manager';
import { WorktreeManager } from '../core/worktree-manager';
import chalk from 'chalk';

export async function completeCommand(workspaceRoot: string, featureId?: string): Promise<void> {
  try {
    const configManager = new ConfigManager(workspaceRoot);
    const features = configManager.getAllFeatures();

    if (features.length === 0) {
      console.log(chalk.yellow('No features found.'));
      return;
    }

    // If no feature ID provided, let user select
    if (!featureId) {
      const { selectedFeature } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedFeature',
          message: 'Select feature to complete:',
          choices: features.map(f => ({
            name: `${f.id}: ${f.name}`,
            value: f.id
          }))
        }
      ]);
      featureId = selectedFeature;
    }

    if (!featureId) {
      console.error(chalk.red(`❌ No feature ID provided`));
      process.exit(1);
    }

    const feature = configManager.getFeature(featureId);
    
    if (!feature) {
      console.error(chalk.red(`❌ Feature ${featureId} not found`));
      process.exit(1);
    }

    console.log(chalk.blue(`\n🏁 Completing feature: ${feature.id} - ${feature.name}\n`));

    // Check completion status
    const incompleteProjects = feature.projects.filter(p => p.status !== 'completed');
    
    if (incompleteProjects.length > 0) {
      console.log(chalk.yellow('⚠️  Warning: Not all projects are completed:'));
      incompleteProjects.forEach(p => {
        console.log(chalk.gray(`  - ${p.name} (${p.status})`));
      });
      
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to proceed anyway?',
          default: false
        }
      ]);

      if (!proceed) {
        console.log(chalk.gray('Operation cancelled.'));
        return;
      }
    }

    // Ask what to do
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Remove worktrees only (keep branches)', value: 'remove_worktrees' },
          { name: 'Merge branches to main and remove worktrees', value: 'merge_and_remove' },
          { name: 'Full cleanup (merge, delete branches, remove worktrees)', value: 'full_cleanup' },
          { name: 'Cancel', value: 'cancel' }
        ]
      }
    ]);

    if (action === 'cancel') {
      console.log(chalk.gray('Operation cancelled.'));
      return;
    }

    console.log(chalk.blue('\n🔧 Processing...'));

    for (const project of feature.projects) {
      try {
        const projectPath = configManager.getProjectPath(project.name);
        const worktreeManager = new WorktreeManager(projectPath);

        if (action === 'remove_worktrees') {
          // Just remove worktree
          if (project.worktreePath) {
            await worktreeManager.removeWorktree(project.worktreePath);
          }
        } else if (action === 'merge_and_remove') {
          // Merge and remove worktree
          await worktreeManager.mergeFeatureBranch(project.branch);
          if (project.worktreePath) {
            await worktreeManager.removeWorktree(project.worktreePath);
          }
        } else if (action === 'full_cleanup') {
          // Merge, delete branch, remove worktree
          await worktreeManager.mergeFeatureBranch(project.branch);
          if (project.worktreePath) {
            await worktreeManager.removeWorktree(project.worktreePath);
          }
          await worktreeManager.deleteFeatureBranch(project.branch);
        }

        console.log(chalk.green(`✅ Processed ${project.name}`));
      } catch (error) {
        console.error(chalk.red(`❌ Error processing ${project.name}: ${error}`));
      }
    }

    // Remove feature from config
    const { removeFromConfig } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'removeFromConfig',
        message: 'Remove feature from configuration?',
        default: true
      }
    ]);

    if (removeFromConfig) {
      configManager.deleteFeature(featureId);
      console.log(chalk.green(`\n✅ Feature ${featureId} completed and removed from configuration!`));
    } else {
      console.log(chalk.green(`\n✅ Feature ${featureId} processed!`));
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}
