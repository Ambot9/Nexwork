# Nexwork

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](https://github.com/Ambot9/Nexwork)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

A powerful CLI tool for managing features that span multiple Git repositories using worktrees, with AI-powered context generation for enhanced productivity.

## 🚀 Try It Now (2 minutes)

```bash
# Install
npm install -g multi-repo-orchestrator

# Or try with npx (no install needed)
npx multi-repo-orchestrator --help

# Quick demo
cd your-workspace
npx multi-repo-orchestrator init
npx multi-repo-orchestrator feature:create
```

## Features

- **Multi-Repo Feature Management** - Track features across multiple repositories
- **Git Worktree Integration** - Create isolated worktrees for each project in a feature
- **AI Context Generation** - Auto-generate `claude.md` with file structures to boost AI productivity
- **Cross-Repo Command Execution** - Run commands across all worktrees in parallel
- **Time Tracking** - Automatic tracking of feature start/completion times
- **Git Statistics** - Track commits, files changed, and lines modified
- **Conflict Detection** - Identifies features working on the same repositories
- **Execution Planning** - Suggests optimal order for working on features

## Installation

```bash
npm install -g multi-repo-orchestrator
```

Or from source:

```bash
git clone https://github.com/yourusername/multi-repo-orchestrator.git
cd multi-repo-orchestrator
npm install
npm run build
npm install -g .
```

## Quick Start

### 1. Initialize in your workspace

```bash
cd /path/to/your/workspace
multi-repo init
```

This will auto-discover all Git repositories in your workspace (searches in `FE/`, `BE/`, `services/`, `packages/`, `apps/` by default).

### 2. Create a feature

```bash
multi-repo feature:create
```

This will:
- Prompt you to select projects involved in the feature
- Create a feature tracking folder with date stamp (e.g., `features/2026-01-31-MyFeature/`)
- Generate git worktrees for each selected project
- Auto-generate `claude.md` with complete file structures
- Create `README.md`, `info.txt`, and `worktrees.txt` for reference

### 3. View feature status

```bash
multi-repo feature:status
```

Shows all features, their progress, conflicts, and suggested execution order.

### 4. Work on your feature

All worktrees are created inside the feature folder:

```
workspace/
├── FE/
│   └── my-frontend/        # Original repo
├── BE/
│   └── my-backend/         # Original repo
└── features/
    └── 2026-01-31-MyFeature/
        ├── README.md       # Human-readable overview
        ├── claude.md       # AI context file
        ├── info.txt        # Quick reference
        ├── worktrees.txt   # Worktree paths
        ├── my-frontend/    # Worktree (isolated branch)
        └── my-backend/     # Worktree (isolated branch)
```

Open the feature folder in your IDE and start coding!

## Commands

### Core Commands

```bash
# Initialize workspace
multi-repo init

# Create new feature with worktrees
multi-repo feature:create

# Show all features with status and conflicts
multi-repo feature:status

# Update project status (pending → in_progress → completed)
multi-repo feature:update

# Complete feature and cleanup worktrees
multi-repo feature:complete [feature-id]

# Bulk delete multiple features (interactive selection)
multi-repo feature:cleanup

# Delete all features at once
multi-repo feature:cleanup --all

# Delete all feature/* branches across all repos
multi-repo feature:prune-branches
```

### AI Productivity Commands

```bash
# Refresh claude.md with latest file structure
multi-repo feature:refresh-context [feature-id]
```

The `claude.md` file contains:
- Complete file tree of all worktrees
- Absolute paths for AI assistants
- Navigation instructions
- Workflow guidance

**Use case:** After adding/removing files, run this to update the AI context file so Claude doesn't waste tokens scanning directories.

### Multi-Repo Commands

```bash
# Run a command across all worktrees
multi-repo feature:run [feature-id] [command]

# Examples:
multi-repo feature:run FEAT-001 "npm test"
multi-repo feature:run FEAT-001 "git status"
multi-repo feature:run FEAT-001 "dotnet build"
```

**Supported languages:** Node.js, .NET/C#, SQL Server, Python, Java, Go, Rust, Ruby, PHP, Docker (auto-detected)

### Statistics & Tracking

```bash
# Show detailed statistics
multi-repo feature:stats [feature-id]
```

Displays:
- **Time Tracking:** Created, started, completed timestamps, duration
- **Project Status:** Pending/in-progress/completed counts, progress %
- **Git Statistics:** Commits, files changed, lines added/deleted
- **Project Details:** Status and last updated time for each project

## Configuration

### Custom Search Paths

Create `.multi-repo.user.json` in your workspace root:

```json
{
  "searchPaths": ["frontend/*", "backend/*", "shared/*"],
  "exclude": ["node_modules", "dist", "build", ".git"]
}
```

### Auto-Detection

The tool automatically detects:
- **Workspace root** - Looks for `.multi-repo-config.json` or workspace folders
- **Default branch** - Tries `staging`, `main`, `master`, `develop` in order
- **Project type** - Detects from files (package.json, *.csproj, etc.)

## Workflow Example

```bash
# 1. Initialize (one-time setup)
cd ~/workspace
multi-repo init

# 2. Create a feature
multi-repo feature:create
# > Enter feature name: "Add Payment Integration"
# > Select projects: [backend-api, frontend-ui, payment-service]

# 3. Check status
multi-repo feature:status
# FEAT-001: Add Payment Integration
# Progress: [0/3] 0%

# 4. Start working
cd features/2026-01-31-Add-Payment-Integration/
# Open in IDE and make changes...

# 5. Run tests across all repos
multi-repo feature:run FEAT-001 "npm test"

# 6. Update progress
multi-repo feature:update
# > Select feature: FEAT-001
# > Select project: backend-api
# > New status: in_progress

# 7. View statistics
multi-repo feature:stats FEAT-001
# Shows time spent, commits, changes

# 8. Refresh AI context after adding files
multi-repo feature:refresh-context FEAT-001

# 9. Complete feature when done
multi-repo feature:complete FEAT-001
```

## Key Concepts

### Git Worktrees

Worktrees are **NOT clones**. They share the same `.git` database as the original repo, making them:
- **Lightweight** - No need to re-clone entire history
- **Fast** - Instant branch switching
- **Isolated** - Changes don't affect main/staging branch
- **Efficient** - Share objects, refs, and config

### Feature Folder Structure

Each feature gets its own date-stamped folder:

```
features/2026-01-31-FeatureName/
├── README.md          # Overview for humans
├── claude.md          # Context for AI assistants
├── info.txt           # Quick reference
├── worktrees.txt      # List of worktree paths
├── project-1/         # Worktree
├── project-2/         # Worktree
└── project-3/         # Worktree
```

### Conflict Detection

The tool prevents you from working on conflicting features simultaneously:

```bash
multi-repo feature:status

⚠️  Conflicts Detected:
  FEAT-001 ↔ FEAT-002
  Conflicting projects: backend-api, frontend-ui

📋 Suggested Execution Plan:
  Batch 1: FEAT-001
  Batch 2: FEAT-002
```

## Advanced Features

### Time Tracking

Automatic tracking:
- `createdAt` - When feature was created
- `startedAt` - When first project moved to `in_progress`
- `completedAt` - When all projects completed

### Git Statistics

Tracks for each feature:
- Total commits on feature branch
- Files changed (diff vs base branch)
- Lines added/deleted
- Net change

### Project Type Detection

Auto-detects project language:
- **Node.js** - package.json
- **.NET/C#** - *.csproj, *.sln
- **SQL Server** - *.sqlproj
- **Python** - requirements.txt, setup.py
- **Java** - pom.xml, build.gradle
- **Go** - go.mod
- **Rust** - Cargo.toml
- **Ruby** - Gemfile
- **PHP** - composer.json

## Troubleshooting

### "Configuration not found"

Run `multi-repo init` in your workspace root.

### "No projects found"

Check that your repos have `.git` folders. Customize search paths in `.multi-repo.user.json`.

### "tree: command not found"

The tool falls back to `find` if `tree` isn't installed. For better output, install tree:

```bash
# macOS
brew install tree

# Linux
sudo apt-get install tree
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Built for teams managing microservices across multiple repositories.

## Roadmap

- [ ] Feature templates for common patterns
- [ ] One-command rollback for merged features
- [ ] Interactive TUI mode
- [ ] Git hooks for auto-refreshing context
- [ ] Support for monorepos
- [ ] Parallel execution strategies
- [ ] Custom scripts per feature
- [ ] Integration with CI/CD

## Why Multi-Repo Orchestrator?

When working on features that span multiple repositories:

**Before:**
- Manually clone/branch each repo
- Track progress in your head or docs
- Context switching nightmare
- AI assistants waste tokens scanning files
- Forget which repos are involved

**After:**
- One command creates all worktrees
- Auto-generated AI context file
- Visual progress tracking
- Conflict detection
- Run commands across all repos
- Complete statistics and time tracking

---

**Star this repo if it helps your workflow!**
