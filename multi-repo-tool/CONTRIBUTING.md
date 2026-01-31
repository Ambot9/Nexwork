# Contributing to Multi-Repo Orchestrator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+
- Git
- TypeScript knowledge

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/multi-repo-orchestrator.git
cd multi-repo-orchestrator

# 3. Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/multi-repo-orchestrator.git

# 4. Install dependencies
npm install

# 5. Build
npm run build

# 6. Link for local testing
npm link
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Build
npm run build

# Test manually
multi-repo --help

# Create a test workspace
mkdir -p /tmp/test-workspace/{FE,BE}
cd /tmp/test-workspace
git init FE/project1
git init BE/service1

# Test commands
multi-repo init
multi-repo feature create
```

### 4. Commit Changes

Follow conventional commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:
```bash
git commit -m "feat(config): add support for custom search paths"
git commit -m "fix(worktree): handle spaces in project names"
git commit -m "docs(readme): update installation instructions"
```

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## Code Style

### TypeScript

- Use TypeScript strict mode
- Define interfaces for all data structures
- Add JSDoc comments for public methods
- Use meaningful variable names

Example:
```typescript
/**
 * Create a git worktree for a feature branch
 * @param featureId - The feature ID (e.g., "FEAT-001")
 * @param projectName - Name of the project
 * @returns Path to the created worktree
 */
async createWorktree(
  featureId: string,
  projectName: string
): Promise<string> {
  // Implementation
}
```

### File Organization

```
src/
├── commands/      # CLI command handlers
├── core/          # Business logic
├── utils/         # Utility functions
├── types.ts       # Type definitions
└── index.ts       # Entry point
```

## Adding New Features

### Example: Add New Command

1. Create command file:
```typescript
// src/commands/my-command.ts
import { ConfigManager } from '../core/config-manager';
import chalk from 'chalk';

export async function myCommand(workspaceRoot: string): Promise<void> {
  console.log(chalk.blue('Running my command...'));
  
  const configManager = new ConfigManager(workspaceRoot);
  // Implementation
}
```

2. Register in index.ts:
```typescript
// src/index.ts
import { myCommand } from './commands/my-command';

program
  .command('my-command')
  .description('Description of my command')
  .action(async () => {
    await myCommand(process.cwd());
  });
```

3. Update documentation

4. Test thoroughly

## Testing

Currently the project uses manual testing. We welcome contributions to add automated tests!

### Manual Test Checklist

- [ ] `multi-repo init` finds projects correctly
- [ ] `multi-repo feature create` creates worktrees
- [ ] `multi-repo feature status` shows correct information
- [ ] `multi-repo feature complete` cleans up properly
- [ ] Works with different folder structures
- [ ] Handles errors gracefully
- [ ] Custom config works as expected

## Documentation

Update documentation when you:
- Add new features
- Change command syntax
- Add configuration options
- Fix bugs that affect usage

Files to update:
- `README.md` - Main documentation
- `EXAMPLES.md` - Usage examples
- Inline code comments
- JSDoc comments

## Pull Request Guidelines

### Before Submitting

- [ ] Code builds without errors
- [ ] Manually tested changes
- [ ] Updated documentation
- [ ] Followed code style
- [ ] Meaningful commit messages
- [ ] No console.log() left in code (use proper logging)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code builds
- [ ] Tested manually
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Ideas for Contributions

### High Priority

- [ ] Automated tests (Jest/Mocha)
- [ ] Support for custom branch naming patterns
- [ ] Better error messages
- [ ] Progress bars for long operations
- [ ] Logging system

### Medium Priority

- [ ] GitHub Actions integration
- [ ] PR auto-creation
- [ ] Support for git submodules
- [ ] Interactive tutorial/wizard
- [ ] Configuration validation

### Nice to Have

- [ ] Web dashboard
- [ ] Slack/Discord notifications
- [ ] Plugin system
- [ ] Support for other VCS (SVN, Mercurial)
- [ ] Integration with Jira/Linear

## Code Review Process

1. Maintainer reviews PR
2. Feedback/changes requested
3. You update PR
4. Maintainer approves
5. PR merged

## Questions?

- Open an [Issue](https://github.com/yourusername/multi-repo-orchestrator/issues)
- Start a [Discussion](https://github.com/yourusername/multi-repo-orchestrator/discussions)
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
