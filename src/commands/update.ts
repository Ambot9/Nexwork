import inquirer from 'inquirer';
import { ConfigManager } from '../core/config-manager';
import { ProjectStatus } from '../types';
import chalk from 'chalk';

export async function updateCommand(workspaceRoot: string): Promise<void> {
  try {
    const configManager = new ConfigManager(workspaceRoot);
    const features = configManager.getAllFeatures();

    if (features.length === 0) {
      console.log(chalk.yellow('No features found.'));
      return;
    }

    // Select feature
    const { featureId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'featureId',
        message: 'Select feature:',
        choices: features.map(f => ({
          name: `${f.id}: ${f.name}`,
          value: f.id
        }))
      }
    ]);

    const feature = configManager.getFeature(featureId);
    
    if (!feature) {
      console.error(chalk.red(`❌ Feature ${featureId} not found`));
      process.exit(1);
    }

    // Select project to update
    const { projectName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectName',
        message: 'Select project to update:',
        choices: feature.projects.map(p => ({
          name: `${p.name} (${p.status})`,
          value: p.name
        }))
      }
    ]);

    // Select new status
    const { newStatus } = await inquirer.prompt([
      {
        type: 'list',
        name: 'newStatus',
        message: 'Select new status:',
        choices: [
          { name: 'Pending', value: 'pending' },
          { name: 'In Progress', value: 'in_progress' },
          { name: 'Completed', value: 'completed' }
        ]
      }
    ]);

    configManager.updateProjectStatus(featureId, projectName, newStatus as ProjectStatus['status']);

    console.log(chalk.green(`\n✅ Updated ${projectName} status to ${newStatus}`));

    // Show updated progress
    const updatedFeature = configManager.getFeature(featureId);
    if (updatedFeature) {
      const completedCount = updatedFeature.projects.filter(p => p.status === 'completed').length;
      const totalCount = updatedFeature.projects.length;
      const progress = Math.round((completedCount / totalCount) * 100);

      console.log(chalk.white(`Progress: [${completedCount}/${totalCount}] ${progress}%`));
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}
