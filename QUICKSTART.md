# Quick Start Guide

Get started with Multi-Repo Orchestrator in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Git repositories organized in `workspace/FE/` and `workspace/BE/` structure
- Each project is a git repository

## Installation

```bash
# Clone or download this tool
cd multi-repo-orchestrator

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (makes 'multi-repo' command available everywhere)
npm link
```

## First Time Setup

### 1. Navigate to your workspace

```bash
cd /path/to/your/workspace
# Your workspace should have FE/ and BE/ folders
```

### 2. Initialize configuration

```bash
multi-repo init
```

This will scan your FE and BE folders and create `.multi-repo-config.json`.

**Example output:**
```
🚀 Initializing Multi-Repo Orchestrator...

✅ Initialization complete!
Found 7 projects:
  - Kirby (FE/Kirby)
  - Tycho (FE/Tycho)
  - Coloris (BE/Coloris)
  - Hermes (BE/Hermes)
  - Proxydia (BE/Proxydia)
  - Promodia (BE/Promodia)
  - Monika (BE/Monika)
```

## Create Your First Feature

### 1. Create a feature

```bash
multi-repo feature create
```

### 2. Answer the prompts

```
? Feature name: My First Feature
? Select projects: 
  ◉ Coloris
  ◉ Hermes
  ◯ Kirby
  ◯ Tycho
  
? Create worktrees now? Yes
```

### 3. Worktrees are created!

```
✅ Created worktree: /workspace/BE/Coloris-FEAT-001
✅ Created worktree: /workspace/BE/Hermes-FEAT-001
```

## Work on the Feature

### Navigate to a worktree

```bash
cd /workspace/BE/Coloris-FEAT-001
```

### Make changes (with AI or manually)

```bash
# Using Claude Code
claude "Add new endpoint for feature X"

# Or manually
vim src/controllers/feature.ts
git add .
git commit -m "Add new endpoint"
```

### Check progress

```bash
multi-repo feature status
```

Output:
```
📊 Feature Status Report

FEAT-001: My First Feature
Progress: [1/2] 50%

  ✅ Coloris         completed
  ⏳ Hermes          pending
```

## Complete the Feature

### When all projects are done

```bash
multi-repo feature complete FEAT-001
```

### Choose cleanup option

```
? What would you like to do?
  ❯ Full cleanup (merge, delete branches, remove worktrees)
```

### Done!

```
✅ Feature FEAT-001 completed and removed from configuration!
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [EXAMPLES.md](EXAMPLES.md) for real-world scenarios
- Run `multi-repo --help` to see all commands

## Common Commands

```bash
# Initialize workspace
multi-repo init

# Create new feature
multi-repo feature create

# Check status of all features
multi-repo feature status

# Update project status manually
multi-repo feature update

# Complete and cleanup feature
multi-repo feature complete [feature-id]

# Get help
multi-repo --help
```

## Troubleshooting

### Command not found: multi-repo

Run `npm link` again in the multi-repo-orchestrator directory.

### No projects found

Make sure:
1. You're in the workspace root
2. Projects are in `FE/` and `BE/` folders
3. Each project has a `.git` directory

### Worktree already exists

Remove it manually:
```bash
cd /workspace/BE/Coloris
git worktree remove Coloris-FEAT-001
```

## Tips

1. **Always run `multi-repo init` once** before creating features
2. **Check status regularly** with `multi-repo feature status`
3. **Work in worktrees**, not main repos
4. **Complete features** to clean up when done

That's it! You're ready to manage multi-repo features efficiently!
