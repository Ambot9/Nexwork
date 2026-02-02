import { ConfigManager } from '../core/config-manager';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { WorktreeManager } from '../core/worktree-manager';

export async function cleanupCommand(workspaceRoot: string, all: boolean = false): Promise<void> {
  console.log(chalk.blue('🧹 Cleanup Features'));
  
  try {
    const configManager = new ConfigManager(workspaceRoot);
    const config = configManager.loadConfig();
    const allFeatures = configManager.getAllFeatures();
    
    if (allFeatures.length === 0) {
      console.log(chalk.yellow('No features found to clean up.'));
      return;
    }

    let featuresToDelete = [];

    if (all) {
      // Delete all features
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: chalk.red(`⚠️  Delete ALL ${allFeatures.length} features? This cannot be undone!`),
          default: false
        }
      ]);

      if (!confirm) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }

      featuresToDelete = allFeatures;
    } else {
      // Select features to delete
      const { selectedFeatures } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedFeatures',
          message: 'Select features to delete (space to select, enter to confirm):',
          choices: allFeatures.map(f => {
            const completed = f.projects.filter(p => p.status === 'completed').length;
            const total = f.projects.length;
            const progress = `[${completed}/${total}]`;
            
            return {
              name: `${f.id}: ${f.name} ${progress} - ${f.projects.length} projects`,
              value: f.id
            };
          })
        }
      ]);

      if (selectedFeatures.length === 0) {
        console.log(chalk.yellow('No features selected.'));
        return;
      }

      featuresToDelete = allFeatures.filter(f => selectedFeatures.includes(f.id));

      // Final confirmation
      const { finalConfirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'finalConfirm',
          message: chalk.yellow(`Delete ${featuresToDelete.length} feature(s)?`),
          default: false
        }
      ]);

      if (!finalConfirm) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }
    }

    // Delete features
    console.log(chalk.blue(`\n🗑️  Deleting ${featuresToDelete.length} feature(s)...\n`));

    const worktreeManager = new WorktreeManager(workspaceRoot);
    let successCount = 0;
    let errorCount = 0;

    for (const feature of featuresToDelete) {
      try {
        console.log(chalk.cyan(`\n📦 ${feature.id}: ${feature.name}`));

        // Remove worktrees and branches
        for (const project of feature.projects) {
          try {
            const projectPath = config.projectLocations[project.name];
            if (projectPath) {
              const fullProjectPath = workspaceRoot + '/' + projectPath;
              const projectWorktreeManager = new WorktreeManager(fullProjectPath);
              
              // Remove worktree if it exists
              if (project.worktreePath) {
                try {
                  await projectWorktreeManager.removeWorktree(project.worktreePath);
                  console.log(chalk.gray(`  ✓ Removed worktree: ${project.name}`));
                } catch (error) {
                  console.log(chalk.yellow(`  ⚠️  Could not remove worktree for ${project.name}`));
                }
              }
              
              // Delete the feature branch
              try {
                await projectWorktreeManager.deleteBranch(project.branch);
                console.log(chalk.gray(`  ✓ Deleted branch: ${project.branch}`));
              } catch (error) {
                // Branch might not exist or already deleted, that's ok
              }
            }
          } catch (error) {
            console.log(chalk.yellow(`  ⚠️  Error cleaning ${project.name}: ${error}`));
          }
        }

        // Delete feature from config
        configManager.deleteFeature(feature.id);
        console.log(chalk.green(`  ✅ Deleted ${feature.id}`));
        successCount++;

      } catch (error) {
        console.log(chalk.red(`  ❌ Error deleting ${feature.id}: ${error}`));
        errorCount++;
      }
    }

    // Summary
    console.log(chalk.blue('\n\n📊 Summary'));
    console.log(chalk.green(`✅ Deleted: ${successCount}`));
    if (errorCount > 0) {
      console.log(chalk.red(`❌ Errors: ${errorCount}`));
    }

    console.log(chalk.gray('\n💡 Tip: Feature folders in features/ directory are not automatically deleted.'));
    console.log(chalk.gray('   You can manually remove them if needed.'));

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}
