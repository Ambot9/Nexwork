import { ConfigManager } from '../core/config-manager';
import chalk from 'chalk';
import * as path from 'path';

export async function initCommand(workspaceRoot: string): Promise<void> {
  console.log(chalk.blue('🚀 Initializing Multi-Repo Orchestrator...'));
  
  try {
    // Auto-detect workspace root
    const detectedRoot = ConfigManager.findWorkspaceRoot(workspaceRoot);
    
    if (detectedRoot !== workspaceRoot) {
      console.log(chalk.yellow(`⚠️  Running from: ${workspaceRoot}`));
      console.log(chalk.green(`✅ Auto-detected workspace root: ${detectedRoot}`));
      console.log(chalk.gray(`💡 Tip: For best results, run commands from workspace root\n`));
    }
    
    const configManager = new ConfigManager(detectedRoot);
    await configManager.initialize();
    
    const config = configManager.loadConfig();
    const projectCount = Object.keys(config.projectLocations).length;
    
    console.log(chalk.green(`\n✅ Initialization complete!`));
    console.log(chalk.white(`Found ${projectCount} projects:`));
    
    if (projectCount === 0) {
      console.log(chalk.yellow(`\n⚠️  No projects found!`));
      console.log(chalk.white(`\nThe tool searched in these default folders:`));
      console.log(chalk.gray(`  - FE/`));
      console.log(chalk.gray(`  - BE/`));
      console.log(chalk.gray(`  - services/`));
      console.log(chalk.gray(`  - packages/`));
      console.log(chalk.gray(`  - apps/`));
      console.log(chalk.white(`\n💡 To customize search paths, create .multi-repo.user.json:`));
      console.log(chalk.gray(`{\n  "searchPaths": ["frontend/*", "backend/*"],\n  "exclude": ["node_modules", "dist"]\n}`));
    } else {
      for (const [name, path] of Object.entries(config.projectLocations)) {
        console.log(chalk.gray(`  - ${name} (${path})`));
      }
    }
    
    console.log(chalk.yellow('\nNext steps:'));
    console.log(chalk.white('  1. Run "multi-repo feature:create" to create a new feature'));
    console.log(chalk.white('  2. Run "multi-repo feature:status" to see all features'));
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
    process.exit(1);
  }
}
