#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { createCommand } from './commands/create';
import { statusCommand } from './commands/status';
import { completeCommand } from './commands/complete';
import { updateCommand } from './commands/update';
import { refreshContextCommand } from './commands/refresh-context';
import { runCommand } from './commands/run';
import { statsCommand } from './commands/stats';
import { cleanupCommand } from './commands/cleanup';
import { pruneBranchesCommand } from './commands/prune-branches';
import * as path from 'path';

const program = new Command();

program
  .name('multi-repo')
  .description('Multi-repository orchestrator for managing features across microservices')
  .version('1.0.3');

import { ConfigManager } from './core/config-manager';

// Helper to get workspace root with auto-detection
function getWorkspaceRoot(providedPath?: string): string {
  const startPath = providedPath ? path.resolve(providedPath) : process.cwd();
  return ConfigManager.findWorkspaceRoot(startPath);
}

program
  .command('init')
  .description('Initialize multi-repo configuration in current workspace')
  .option('-w, --workspace <path>', 'Workspace root directory', process.cwd())
  .action(async (options) => {
    const workspaceRoot = path.resolve(options.workspace);
    await initCommand(workspaceRoot);
  });

program
  .command('feature')
  .description('Manage features across multiple repositories')
  .action(() => {
    program.help();
  });

program
  .command('feature:create')
  .alias('feature create')
  .description('Create a new feature with worktrees')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await createCommand(workspaceRoot);
  });

program
  .command('feature:status')
  .alias('feature status')
  .description('Show status of all features')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await statusCommand(workspaceRoot);
  });

program
  .command('feature:update')
  .alias('feature update')
  .description('Update project status within a feature')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await updateCommand(workspaceRoot);
  });

program
  .command('feature:complete')
  .alias('feature complete')
  .description('Complete a feature and cleanup worktrees')
  .argument('[feature-id]', 'Feature ID to complete')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (featureId, options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await completeCommand(workspaceRoot, featureId);
  });

program
  .command('feature:refresh-context')
  .alias('feature refresh-context')
  .description('Refresh Claude AI context (claude.md) with latest file structure')
  .argument('[feature-id]', 'Feature ID to refresh')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (featureId, options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await refreshContextCommand(workspaceRoot, featureId);
  });

program
  .command('feature:run')
  .alias('feature run')
  .description('Run a command across all worktrees in a feature')
  .argument('[feature-id]', 'Feature ID')
  .argument('[command]', 'Command to run (e.g., "npm test", "dotnet build")')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (featureId, command, options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await runCommand(workspaceRoot, featureId, command);
  });

program
  .command('feature:stats')
  .alias('feature stats')
  .description('Show detailed statistics for a feature (time, commits, changes)')
  .argument('[feature-id]', 'Feature ID')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (featureId, options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await statsCommand(workspaceRoot, featureId);
  });

program
  .command('feature:cleanup')
  .alias('feature cleanup')
  .description('Bulk delete features (select multiple or delete all)')
  .option('--all', 'Delete all features without prompting for selection')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await cleanupCommand(workspaceRoot, options.all);
  });

program
  .command('feature:prune-branches')
  .alias('feature prune-branches')
  .description('Delete all feature/* branches across all repos')
  .option('-w, --workspace <path>', 'Workspace root directory')
  .action(async (options) => {
    const workspaceRoot = getWorkspaceRoot(options.workspace);
    await pruneBranchesCommand(workspaceRoot);
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
