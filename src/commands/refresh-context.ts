import { ConfigManager } from '../core/config-manager';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

export async function refreshContextCommand(workspaceRoot: string, featureId?: string): Promise<void> {
  console.log(chalk.blue('🔄 Refreshing Claude context...'));
  
  try {
    const configManager = new ConfigManager(workspaceRoot);
    const config = configManager.loadConfig();
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
          message: 'Select feature to refresh:',
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

    // Find feature tracking directory
    const featureDate = new Date(feature.createdAt).toISOString().split('T')[0];
    const featureFolderName = `${featureDate}-${feature.name.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const featureTrackingDir = path.join(config.workspaceRoot, 'features', featureFolderName);

    if (!fs.existsSync(featureTrackingDir)) {
      console.error(chalk.red(`❌ Feature folder not found: ${featureTrackingDir}`));
      process.exit(1);
    }

    console.log(chalk.gray(`Feature: ${feature.name}`));
    console.log(chalk.gray(`Location: ${featureTrackingDir}\n`));

    // Regenerate project structures
    const projectStructures = feature.projects
      .filter(p => p.worktreePath && fs.existsSync(p.worktreePath))
      .map(p => {
        try {
          console.log(chalk.gray(`  Scanning ${p.name}...`));
          
          let structure = '';
          try {
            // Try tree command
            structure = execSync(
              `tree -L 3 -I 'node_modules|.git|dist|build|coverage|.next|out' "${p.worktreePath}"`,
              { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
            );
          } catch (treeError) {
            // Fallback to find
            structure = execSync(
              `find "${p.worktreePath}" -maxdepth 3 -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/build/*" | head -100`,
              { encoding: 'utf-8' }
            );
          }
          
          console.log(chalk.green(`  ✅ ${p.name} scanned`));
          return { name: p.name, path: p.worktreePath, structure };
        } catch (error) {
          console.log(chalk.yellow(`  ⚠️  ${p.name} failed to scan`));
          return { name: p.name, path: p.worktreePath, structure: 'Unable to generate structure' };
        }
      });

    // Update claude.md
    const timestamp = new Date().toLocaleString();
    const claudeMd = `# Context for Claude AI

**Last Updated:** ${timestamp}

## Current Feature
**${feature.name}** (${feature.id})

## Your Task
You are helping to implement the feature: **${feature.name}**

This feature spans across multiple repositories. Each repository has its own isolated worktree.

## Project Worktrees

${feature.projects
  .filter(p => p.worktreePath)
  .map(p => `### ${p.name}
- **Path**: \`${p.worktreePath}\`
- **Branch**: \`${p.branch}\`
- **Status**: ${p.status}`)
  .join('\n\n')}

## Project File Structures

**IMPORTANT**: Use these paths directly. Do NOT scan directories - all important files are listed below.

${projectStructures.map(ps => `### ${ps.name}

**Location**: \`${ps.path}\`

\`\`\`
${ps.structure}
\`\`\`
`).join('\n')}

## Important Rules

1. **Always use absolute paths** when referencing files
2. **Each worktree is isolated** - changes don't affect main/staging branch
3. **All projects are part of the same feature** - keep consistency across repos
4. **Git branch**: All worktrees are on \`${feature.projects[0]?.branch || 'feature/' + feature.id}\`

## Quick Navigation

To work on each project, use these commands:

${feature.projects
  .filter(p => p.worktreePath)
  .map(p => `\`\`\`bash
# Work on ${p.name}
cd ${p.worktreePath}
\`\`\``)
  .join('\n\n')}

## Workflow

1. **Read the code** in the worktree paths listed above
2. **Make changes** as requested by the user
3. **Test your changes** in the isolated worktree
4. **Commit** when ready:
   \`\`\`bash
   git add .
   git commit -m "Description of changes"
   \`\`\`

## Project Structure

${feature.projects
  .filter(p => p.worktreePath)
  .map(p => `**${p.name}**: ${p.worktreePath.includes('/FE/') ? 'Frontend' : 'Backend'} project`)
  .join('\n')}

## User Notes

_(User can add notes here about what needs to be done)_

---

**Feature Created**: ${new Date(feature.createdAt).toLocaleString()}
**Current Directory**: \`${featureTrackingDir}\`
**Context Refreshed**: ${timestamp}
`;

    fs.writeFileSync(path.join(featureTrackingDir, 'claude.md'), claudeMd);

    console.log(chalk.green('\n✅ Claude context refreshed!'));
    console.log(chalk.cyan(`📄 Updated: ${path.join(featureTrackingDir, 'claude.md')}`));
    console.log(chalk.gray(`\n💡 Tip: Run this command whenever you add/remove files`));

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}
