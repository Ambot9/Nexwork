import { ConfigManager } from '../core/config-manager';
import chalk from 'chalk';
import * as fs from 'fs';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

export async function statsCommand(workspaceRoot: string, featureId?: string): Promise<void> {
  console.log(chalk.blue('📊 Feature Statistics'));
  
  try {
    const configManager = new ConfigManager(workspaceRoot);
    const allFeatures = configManager.getAllFeatures();
    
    if (allFeatures.length === 0) {
      console.error(chalk.red('❌ No features found.'));
      process.exit(1);
    }

    // If no feature ID provided, prompt user
    let selectedFeatureId = featureId;
    if (!selectedFeatureId) {
      const { feature } = await inquirer.prompt([
        {
          type: 'list',
          name: 'feature',
          message: 'Select feature to view stats:',
          choices: allFeatures.map(f => ({
            name: `${f.id}: ${f.name}`,
            value: f.id
          }))
        }
      ]);
      selectedFeatureId = feature;
    }

    // Ensure we have a feature ID
    if (!selectedFeatureId) {
      console.error(chalk.red('❌ No feature selected.'));
      process.exit(1);
    }

    const feature = configManager.getFeature(selectedFeatureId);
    if (!feature) {
      console.error(chalk.red(`❌ Feature ${selectedFeatureId} not found.`));
      process.exit(1);
    }

    console.log(chalk.cyan(`\n📋 Feature: ${feature.name} (${feature.id})`));
    console.log(chalk.gray('─'.repeat(60)));

    // Time tracking
    console.log(chalk.yellow('\n⏱️  Time Tracking'));
    console.log(`Created:    ${new Date(feature.createdAt).toLocaleString()}`);
    if (feature.startedAt) {
      console.log(`Started:    ${new Date(feature.startedAt).toLocaleString()}`);
    } else {
      console.log(`Started:    ${chalk.gray('Not started yet')}`);
    }
    if (feature.completedAt) {
      console.log(`Completed:  ${new Date(feature.completedAt).toLocaleString()}`);
      
      // Calculate duration
      const start = new Date(feature.startedAt || feature.createdAt).getTime();
      const end = new Date(feature.completedAt).getTime();
      const duration = end - start;
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      console.log(`Duration:   ${hours}h ${minutes}m`);
    } else {
      console.log(`Completed:  ${chalk.gray('In progress')}`);
      
      // Calculate time elapsed
      const start = new Date(feature.startedAt || feature.createdAt).getTime();
      const now = Date.now();
      const elapsed = now - start;
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      console.log(`Elapsed:    ${hours}h ${minutes}m`);
    }

    // Project status
    console.log(chalk.yellow('\n📦 Project Status'));
    const pending = feature.projects.filter(p => p.status === 'pending').length;
    const inProgress = feature.projects.filter(p => p.status === 'in_progress').length;
    const completed = feature.projects.filter(p => p.status === 'completed').length;
    const total = feature.projects.length;
    
    console.log(`Total:       ${total}`);
    console.log(`${chalk.green('✅ Completed')}: ${completed}`);
    console.log(`${chalk.cyan('🔄 In Progress')}: ${inProgress}`);
    console.log(`${chalk.gray('⏳ Pending')}: ${pending}`);
    console.log(`Progress:    ${Math.round((completed / total) * 100)}%`);

    // Git statistics
    console.log(chalk.yellow('\n📈 Git Statistics'));
    
    let totalCommits = 0;
    let totalFilesChanged = 0;
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    
    const projectsWithWorktrees = feature.projects.filter(p => 
      p.worktreePath && fs.existsSync(p.worktreePath)
    );

    for (const project of projectsWithWorktrees) {
      try {
        // Count commits on feature branch
        const commits = execSync(
          `git rev-list --count ${project.branch}`,
          { cwd: project.worktreePath, encoding: 'utf-8' }
        ).trim();
        
        // Get diff stats comparing to staging/main
        const baseBranch = 'staging'; // or detect from config
        try {
          const diffStats = execSync(
            `git diff ${baseBranch}...${project.branch} --shortstat`,
            { cwd: project.worktreePath, encoding: 'utf-8' }
          ).trim();
          
          // Parse: "X files changed, Y insertions(+), Z deletions(-)"
          const filesMatch = diffStats.match(/(\d+) files? changed/);
          const addMatch = diffStats.match(/(\d+) insertions?\(\+\)/);
          const delMatch = diffStats.match(/(\d+) deletions?\(-\)/);
          
          if (filesMatch) totalFilesChanged += parseInt(filesMatch[1]);
          if (addMatch) totalLinesAdded += parseInt(addMatch[1]);
          if (delMatch) totalLinesDeleted += parseInt(delMatch[1]);
        } catch (error) {
          // Branch might not have diverged yet
        }
        
        totalCommits += parseInt(commits);
      } catch (error) {
        // Ignore errors (worktree might not exist)
      }
    }

    console.log(`Commits:       ${totalCommits}`);
    console.log(`Files changed: ${totalFilesChanged}`);
    console.log(`Lines added:   ${chalk.green('+' + totalLinesAdded)}`);
    console.log(`Lines deleted: ${chalk.red('-' + totalLinesDeleted)}`);
    console.log(`Net change:    ${totalLinesAdded - totalLinesDeleted}`);

    // Project details
    console.log(chalk.yellow('\n📁 Project Details'));
    for (const project of feature.projects) {
      const icon = project.status === 'completed' ? '✅' : 
                   project.status === 'in_progress' ? '🔄' : '⏳';
      console.log(`${icon} ${project.name.padEnd(20)} ${project.status}`);
      if (project.worktreePath) {
        console.log(`   ${chalk.gray(project.worktreePath)}`);
      }
      if (project.lastUpdated) {
        console.log(`   ${chalk.gray('Updated: ' + new Date(project.lastUpdated).toLocaleString())}`);
      }
    }

    console.log(chalk.gray('\n' + '─'.repeat(60)));

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}
