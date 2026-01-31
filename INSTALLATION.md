# Installation Guide

Complete guide to installing and setting up Multi-Repo Orchestrator.

## Prerequisites

Before installing, ensure you have:

- ✅ **Node.js 18+** installed
  ```bash
  node --version  # Should be v18.0.0 or higher
  ```

- ✅ **npm** installed
  ```bash
  npm --version
  ```

- ✅ **Git** installed
  ```bash
  git --version
  ```

- ✅ **Workspace structure** with FE and BE folders
  ```
  /your-workspace/
  ├── FE/
  │   ├── ProjectA/  (.git repo)
  │   └── ProjectB/  (.git repo)
  └── BE/
      ├── ProjectC/  (.git repo)
      └── ProjectD/  (.git repo)
  ```

## Installation Steps

### Option 1: Global Installation (Recommended)

```bash
# 1. Navigate to the tool directory
cd /path/to/multi-repo-orchestrator

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Link globally
npm link

# 5. Verify installation
multi-repo --help
```

You can now use `multi-repo` command from anywhere!

### Option 2: Local Installation

```bash
# 1. Navigate to the tool directory
cd /path/to/multi-repo-orchestrator

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Use with full path
node dist/index.js --help

# Or create an alias
alias multi-repo='node /path/to/multi-repo-orchestrator/dist/index.js'
```

### Option 3: Development Mode

```bash
# 1. Navigate to the tool directory
cd /path/to/multi-repo-orchestrator

# 2. Install dependencies
npm install

# 3. Run directly with ts-node (no build needed)
npm run dev -- --help

# 4. Use for development
npm run dev init
npm run dev feature create
```

## Verification

After installation, verify everything works:

```bash
# Check version
multi-repo --version

# Check help
multi-repo --help

# Should output:
# Usage: multi-repo [options] [command]
# 
# Multi-repository orchestrator for managing features across microservices
# 
# Options:
#   -V, --version        output the version number
#   -h, --help          display help for command
# 
# Commands:
#   init [options]
#   feature
#   feature:create [options]
#   feature:status [options]
#   feature:update [options]
#   feature:complete [options] [feature-id]
```

## First Time Setup

### 1. Navigate to Your Workspace

```bash
cd /path/to/your-workspace
```

Your workspace should look like:
```
/workspace
├── FE/
│   ├── Kirby/
│   ├── Tycho/
│   └── ...
└── BE/
    ├── Coloris/
    ├── Hermes/
    └── ...
```

### 2. Initialize Configuration

```bash
multi-repo init
```

This will:
- Scan `FE/` and `BE/` folders
- Discover all git repositories
- Create `.multi-repo-config.json`

Expected output:
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

Next steps:
  1. Run "multi-repo feature create" to create a new feature
  2. Run "multi-repo feature status" to see all features
```

### 3. Verify Configuration

```bash
cat .multi-repo-config.json
```

Should show:
```json
{
  "workspaceRoot": "/path/to/your-workspace",
  "features": [],
  "projectLocations": {
    "Kirby": "FE/Kirby",
    "Tycho": "FE/Tycho",
    "Coloris": "BE/Coloris",
    ...
  }
}
```

## Troubleshooting

### Issue: Command not found: multi-repo

**Solution 1:** Re-link globally
```bash
cd /path/to/multi-repo-orchestrator
npm link
```

**Solution 2:** Check npm global bin path
```bash
npm config get prefix
# Add this to your PATH if not already
export PATH="$(npm config get prefix)/bin:$PATH"
```

**Solution 3:** Use npx
```bash
npx multi-repo --help
```

### Issue: No projects found

**Problem:** `multi-repo init` says "Found 0 projects"

**Solution:**
1. Check folder structure:
   ```bash
   ls -la FE/
   ls -la BE/
   ```

2. Verify each project is a git repo:
   ```bash
   ls -la FE/Kirby/.git
   ls -la BE/Coloris/.git
   ```

3. If projects aren't git repos, initialize them:
   ```bash
   cd FE/Kirby
   git init
   git add .
   git commit -m "Initial commit"
   ```

### Issue: Permission denied

**Problem:** Cannot execute `multi-repo`

**Solution:**
```bash
chmod +x dist/index.js
```

### Issue: Module not found errors

**Problem:** Build fails with missing modules

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: TypeScript compilation errors

**Problem:** `npm run build` fails

**Solution:**
```bash
# Check TypeScript version
npx tsc --version  # Should be 5.x

# Clean build
rm -rf dist
npm run build
```

### Issue: Worktree already exists

**Problem:** Cannot create worktree

**Solution:**
```bash
# List existing worktrees
cd /workspace/BE/Coloris
git worktree list

# Remove old worktree
git worktree remove Coloris-FEAT-001

# Or force remove
git worktree remove --force Coloris-FEAT-001
```

## Uninstallation

### Unlink Global Command

```bash
cd /path/to/multi-repo-orchestrator
npm unlink
```

### Remove Tool Completely

```bash
rm -rf /path/to/multi-repo-orchestrator
```

### Clean Workspace

```bash
# Remove configuration (from workspace)
cd /your-workspace
rm .multi-repo-config.json

# Remove all worktrees (be careful!)
# Manual cleanup - check each project:
cd FE/Kirby
git worktree list
git worktree remove Kirby-FEAT-001
```

## Updating

### Update to Latest Version

```bash
cd /path/to/multi-repo-orchestrator

# Pull latest changes (if from git)
git pull

# Or download new version manually

# Reinstall
npm install
npm run build
npm link
```

## Configuration

### Workspace Path

By default, commands use current directory as workspace.

To specify different workspace:
```bash
multi-repo init --workspace /path/to/workspace
multi-repo feature create --workspace /path/to/workspace
```

### Environment Variables

None required currently. All configuration in `.multi-repo-config.json`.

## Next Steps

After successful installation:

1. ✅ **Read Quick Start Guide**
   ```bash
   cat QUICKSTART.md
   ```

2. ✅ **Try Example Workflow**
   ```bash
   cat EXAMPLES.md
   ```

3. ✅ **Create Your First Feature**
   ```bash
   multi-repo feature create
   ```

4. ✅ **Check Status**
   ```bash
   multi-repo feature status
   ```

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify prerequisites are met
3. Try clean reinstall
4. Check README.md for more details

Happy orchestrating! 🚀
