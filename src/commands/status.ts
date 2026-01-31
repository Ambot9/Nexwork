import { ConfigManager } from '../core/config-manager';
import { ConflictDetector } from '../core/conflict-detector';
import chalk from 'chalk';

export async function statusCommand(workspaceRoot: string): Promise<void> {
  try {
    const configManager = new ConfigManager(workspaceRoot);
    const features = configManager.getAllFeatures();

    if (features.length === 0) {
      console.log(chalk.yellow('No features found. Run "multi-repo feature create" to get started.'));
      return;
    }

    console.log(chalk.blue('📊 Feature Status Report\n'));

    // Display each feature
    for (const feature of features) {
      const completedCount = feature.projects.filter(p => p.status === 'completed').length;
      const totalCount = feature.projects.length;
      const progress = Math.round((completedCount / totalCount) * 100);

      console.log(chalk.bold.white(`${feature.id}: ${feature.name}`));
      console.log(chalk.gray(`Created: ${new Date(feature.createdAt).toLocaleString()}`));
      console.log(chalk.white(`Progress: [${completedCount}/${totalCount}] ${progress}%\n`));

      // Display project statuses
      for (const project of feature.projects) {
        const statusIcon = getStatusIcon(project.status);
        const statusColor = getStatusColor(project.status);
        
        console.log(`  ${statusIcon} ${chalk[statusColor](project.name.padEnd(15))} ${chalk.gray(project.status)}`);
        
        if (project.worktreePath) {
          console.log(`     ${chalk.gray('└─ ' + project.worktreePath)}`);
        }
      }

      console.log(''); // Empty line between features
    }

    // Check for conflicts
    const conflictDetector = new ConflictDetector();
    const conflicts = conflictDetector.detectConflicts(features);

    if (conflicts.length > 0) {
      console.log(chalk.yellow('⚠️  Conflicts Detected:\n'));
      
      for (const conflict of conflicts) {
        const feature1 = features.find(f => f.id === conflict.feature1);
        const feature2 = features.find(f => f.id === conflict.feature2);
        
        console.log(chalk.yellow(`  ${conflict.feature1} ↔ ${conflict.feature2}`));
        console.log(chalk.gray(`  Conflicting projects: ${conflict.conflictingProjects.join(', ')}\n`));
      }

      // Display execution plan
      console.log(chalk.blue('📋 Suggested Execution Plan:\n'));
      const plan = conflictDetector.createExecutionPlan(features);
      
      plan.sequential.forEach((batch, index) => {
        console.log(chalk.white(`  Batch ${index + 1} (can work in parallel):`));
        batch.forEach(featureId => {
          const feature = features.find(f => f.id === featureId);
          console.log(chalk.gray(`    - ${featureId}: ${feature?.name}`));
        });
        console.log('');
      });
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'completed':
      return '✅';
    case 'in_progress':
      return '🔄';
    case 'pending':
      return '⏳';
    default:
      return '❓';
  }
}

function getStatusColor(status: string): 'green' | 'yellow' | 'gray' {
  switch (status) {
    case 'completed':
      return 'green';
    case 'in_progress':
      return 'yellow';
    case 'pending':
      return 'gray';
    default:
      return 'gray';
  }
}
