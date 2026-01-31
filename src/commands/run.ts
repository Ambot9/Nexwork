import { ConfigManager } from '../core/config-manager';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

interface ProjectType {
  name: string;
  detected: boolean;
  indicators: string[];
}

export async function runCommand(workspaceRoot: string, featureId: string | undefined, command: string | undefined): Promise<void> {
  console.log(chalk.blue('🚀 Running command across worktrees...'));
  
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
          message: 'Select feature to run command in:',
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

    // If no command provided, prompt user
    let commandToRun = command;
    if (!commandToRun) {
      const { cmd } = await inquirer.prompt([
        {
          type: 'input',
          name: 'cmd',
          message: 'Enter command to run:',
          default: 'npm test'
        }
      ]);
      commandToRun = cmd;
    }

    if (!commandToRun) {
      console.error(chalk.red('❌ No command provided.'));
      process.exit(1);
    }

    console.log(chalk.gray(`Feature: ${feature.name}`));
    console.log(chalk.gray(`Command: ${commandToRun}\n`));

    // Filter projects with worktrees
    const projectsWithWorktrees = feature.projects.filter(p => 
      p.worktreePath && fs.existsSync(p.worktreePath)
    );

    if (projectsWithWorktrees.length === 0) {
      console.error(chalk.red('❌ No worktrees found for this feature.'));
      process.exit(1);
    }

    // Run command in each worktree
    const results: Array<{project: string, success: boolean, output: string}> = [];

    for (const project of projectsWithWorktrees) {
      console.log(chalk.cyan(`\n📦 ${project.name}`));
      console.log(chalk.gray(`   ${project.worktreePath}`));
      
      // Detect project type
      const projectType = detectProjectType(project.worktreePath!);
      console.log(chalk.gray(`   Detected: ${projectType.name}`));
      
      try {
        const output = execSync(commandToRun, {
          cwd: project.worktreePath,
          encoding: 'utf-8',
          stdio: 'pipe',
          maxBuffer: 10 * 1024 * 1024
        });
        
        console.log(chalk.green(`   ✅ Success`));
        if (output.trim()) {
          console.log(chalk.gray(`   ${output.trim().split('\n').slice(0, 5).join('\n   ')}`));
          if (output.split('\n').length > 5) {
            console.log(chalk.gray(`   ... (${output.split('\n').length - 5} more lines)`));
          }
        }
        
        results.push({ project: project.name, success: true, output });
      } catch (error: any) {
        console.log(chalk.red(`   ❌ Failed`));
        if (error.stdout) {
          console.log(chalk.gray(`   ${error.stdout.toString().trim().split('\n').slice(0, 3).join('\n   ')}`));
        }
        if (error.stderr) {
          console.log(chalk.red(`   ${error.stderr.toString().trim().split('\n').slice(0, 3).join('\n   ')}`));
        }
        
        results.push({ project: project.name, success: false, output: error.message });
      }
    }

    // Summary
    console.log(chalk.blue('\n\n📊 Summary\n'));
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(chalk.green(`✅ Successful: ${successful}/${results.length}`));
    if (failed > 0) {
      console.log(chalk.red(`❌ Failed: ${failed}/${results.length}`));
      console.log(chalk.yellow('\nFailed projects:'));
      results.filter(r => !r.success).forEach(r => {
        console.log(chalk.red(`  - ${r.project}`));
      });
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}

function detectProjectType(projectPath: string): ProjectType {
  // Order matters - more specific types first
  const checks: ProjectType[] = [
    {
      name: 'Node.js',
      detected: false,
      indicators: ['package.json']
    },
    {
      name: 'SQL Server Database',
      detected: false,
      indicators: ['*.sqlproj']
    },
    {
      name: '.NET/C#',
      detected: false,
      indicators: ['*.csproj', '*.fsproj', '*.vbproj', '*.sln']
    },
    {
      name: 'Python',
      detected: false,
      indicators: ['requirements.txt', 'setup.py', 'pyproject.toml', 'Pipfile']
    },
    {
      name: 'Java',
      detected: false,
      indicators: ['pom.xml', 'build.gradle', 'build.gradle.kts']
    },
    {
      name: 'Go',
      detected: false,
      indicators: ['go.mod', 'go.sum']
    },
    {
      name: 'Rust',
      detected: false,
      indicators: ['Cargo.toml']
    },
    {
      name: 'Ruby',
      detected: false,
      indicators: ['Gemfile', 'Rakefile']
    },
    {
      name: 'PHP',
      detected: false,
      indicators: ['composer.json']
    },
    {
      name: 'Docker',
      detected: false,
      indicators: ['Dockerfile', 'docker-compose.yml']
    }
  ];

  for (const check of checks) {
    for (const indicator of check.indicators) {
      if (indicator.includes('*')) {
        // Pattern matching (e.g., *.csproj) - search in root and one level deep
        const pattern = indicator.replace('*', '');
        try {
          // Check root directory
          const rootFiles = fs.readdirSync(projectPath);
          if (rootFiles.some(f => f.endsWith(pattern))) {
            check.detected = true;
            break;
          }
          
          // Check subdirectories (one level deep)
          for (const file of rootFiles) {
            const fullPath = path.join(projectPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
              try {
                const subFiles = fs.readdirSync(fullPath);
                if (subFiles.some(f => f.endsWith(pattern))) {
                  check.detected = true;
                  break;
                }
              } catch (error) {
                // Ignore errors
              }
            }
          }
        } catch (error) {
          // Ignore errors
        }
      } else {
        // Exact file match
        const filePath = path.join(projectPath, indicator);
        if (fs.existsSync(filePath)) {
          check.detected = true;
          break;
        }
      }
    }
    
    if (check.detected) {
      return check;
    }
  }

  return { name: 'Unknown', detected: false, indicators: [] };
}
