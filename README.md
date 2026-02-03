# Nexwork

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/Ambot9/Nexwork)
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

## ✨ Features

### Core Features
- **Multi-Repo Feature Management** - Track features across multiple repositories
- **Git Worktree Integration** - Create isolated worktrees for each project in a feature
- **Smart Branch Detection** - Creates worktrees from your current branch (staging, main, demo, etc.)
- **Pull Check Warning** - Warns if your branch is behind remote before creating worktrees
- **Custom Feature IDs** - Use your own IDs (WPAY-001, JIRA-1234, etc.) instead of auto-generated

### Productivity Features
- **AI Context Generation** - Auto-generate `claude.md` with file structures to boost AI productivity
- **Cross-Repo Command Execution** - Run commands across all worktrees in parallel
- **Time Tracking** - Automatic tracking of feature start/completion times
- **Git Statistics** - Track commits, files changed, and lines modified
- **Conflict Detection** - Identifies features working on the same repositories
- **Execution Planning** - Suggests optimal order for working on features

### Cleanup Features
- **Bulk Cleanup** - Delete multiple features at once
- **Complete Cleanup** - Removes worktrees, branches, and feature folders automatically
- **Branch Pruning** - Clean up all orphaned feature branches across repos

## Installation

```bash
npm install -g multi-repo-orchestrator
```

Or from source:

```bash
git clone https://github.com/Ambot9/Nexwork.git
cd Nexwork
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

**Important:** Before creating a feature, make sure you're on the right branch!

```bash
# Check your current branch (e.g., in coloris repo)
cd BE/coloris
git branch
# * staging  ← Make sure you're on the correct branch

# Pull latest changes
git pull

# Now create the feature from workspace root
cd /path/to/your/workspace
multi-repo feature:create
```

This will:
- **Detect your current branch** (staging, main, demo, etc.)
- **Check if branch is up-to-date** with remote
- **Warn you if behind** (needs git pull)
- Prompt you to enter feature name
- Allow **custom Feature ID** (optional: WPAY-001, JIRA-1234, etc.)
- Prompt you to select projects involved in the feature
- Create a feature tracking folder with date stamp (e.g., `features/2026-02-02-MyFeature/`)
- **Create git worktrees FROM your current branch** (not default branch!)
- **Confirm which branch** worktrees were created from
- Auto-generate `claude.md` with complete file structures
- Create `README.md`, `info.txt`, and `worktrees.txt` for reference

**Example Output:**
```
✅ Created worktree from 'staging': /path/to/features/2026-02-02-MyFeature/coloris
✨ Worktrees created from branch(es): staging
```

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
- **Current branch** - Detects which branch you're on when creating worktrees
- **Branch sync status** - Checks if branch is up-to-date with remote
- **Project type** - Detects from files (package.json, *.csproj, etc.)

### Important: Branch Detection

Nexwork creates worktrees **from your current branch**, not from a default branch!

**Example:**
```bash
# If you're on 'staging' branch
cd BE/coloris
git branch
# * staging

# Worktrees will be created FROM staging
multi-repo feature:create
# ✨ Worktrees created from branch(es): staging

# If you're on 'demo' branch
cd BE/coloris
git checkout demo
multi-repo feature:create
# ✨ Worktrees created from branch(es): demo
```

**Always ensure:**
1. You're on the correct branch before creating features
2. Your branch is up-to-date (`git pull`)
3. The tool will warn you if behind remote

## 📖 Complete Workflow Example

```bash
# 1. Initialize (one-time setup)
cd ~/workspace
multi-repo init

# 2. Ensure you're on the correct branch and up-to-date
cd BE/coloris
git checkout staging
git pull
cd FE/frontend-ui
git checkout staging
git pull

# 3. Create a feature
cd ~/workspace
multi-repo feature:create
# > Enter feature name: "Add Payment Integration"
# > Select projects: [backend-api, frontend-ui, payment-service]
# > Use custom Feature ID? (default: FEAT-001) Yes
# > Enter custom Feature ID: WPAY-001
# > Create worktrees now? Yes
# ✅ Created worktree from 'staging': .../backend-api
# ✅ Created worktree from 'staging': .../frontend-ui
# ✅ Created worktree from 'staging': .../payment-service
# ✨ Worktrees created from branch(es): staging

# 4. Check status
multi-repo feature:status
# WPAY-001: Add Payment Integration
# Progress: [0/3] 0%

# 5. Start working
cd features/2026-02-02-Add-Payment-Integration/
code .  # Open in IDE and make changes...

# 6. Work on projects
cd backend-api
git add .
git commit -m "Add payment API endpoints"
git push origin feature/WPAY-001

cd ../frontend-ui
git add .
git commit -m "Add payment UI components"
git push origin feature/WPAY-001

# 7. Run tests across all repos
cd ~/workspace
multi-repo feature:run WPAY-001 "npm test"

# 8. Update progress
multi-repo feature:update
# > Select feature: WPAY-001
# > Select project: backend-api
# > New status: completed

# 9. View statistics
multi-repo feature:stats WPAY-001
# Shows time spent, commits, changes

# 10. Refresh AI context after adding files
multi-repo feature:refresh-context WPAY-001

# 11. Complete feature when done
multi-repo feature:complete WPAY-001
# > What would you like to do? Full cleanup
# > Remove feature from configuration? Yes
# ✅ Feature WPAY-001 completed and removed!
```

**📚 For detailed step-by-step guide, see [GETTING_STARTED.md](GETTING_STARTED.md)**

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

## 📋 Version History

### v1.1.0 (Latest) - Smart Branch Detection
- ✅ Creates worktrees from current branch (not default)
- ✅ Checks if branch is up-to-date with remote
- ✅ Warns if branch is behind (needs pull)
- ✅ Confirms source branch after creation

### v1.0.5 - Complete Cleanup
- ✅ Delete feature folders automatically
- ✅ Delete Git branches
- ✅ Complete cleanup (no leftovers)

### v1.0.4 - Simplified Workflow
- ✅ Custom Feature IDs (WPAY-001, JIRA-1234)
- ✅ Removed manual worktree naming (cleaner)

### v1.0.1 - Bulk Operations
- ✅ Bulk feature cleanup
- ✅ Prune orphaned branches
- ✅ Interactive selection

### v1.0.0 - Initial Release
- ✅ Multi-repo feature management
- ✅ Git worktree integration
- ✅ AI context generation
- ✅ Cross-repo commands
- ✅ Time tracking & statistics

## 🗺️ Roadmap

- [ ] Feature templates for common patterns
- [ ] One-command rollback for merged features
- [ ] Interactive TUI mode
- [ ] Git hooks for auto-refreshing context
- [ ] Support for monorepos
- [ ] Parallel execution strategies
- [ ] Custom scripts per feature
- [ ] Integration with CI/CD

## ❓ Why Nexwork?

When working on features that span multiple repositories:

**Before:**
- ❌ Manually clone/branch each repo
- ❌ Track progress in your head or docs
- ❌ Context switching nightmare
- ❌ AI assistants waste tokens scanning files
- ❌ Forget which repos are involved
- ❌ Accidentally branch from wrong base (main vs staging)
- ❌ Work with outdated code (forget to pull)

**After:**
- ✅ One command creates all worktrees
- ✅ Auto-generated AI context file
- ✅ Visual progress tracking
- ✅ Conflict detection
- ✅ Run commands across all repos
- ✅ Complete statistics and time tracking
- ✅ **Smart branch detection** - Always branches from your current branch
- ✅ **Pull check** - Warns if you're behind remote
- ✅ **Complete cleanup** - No leftovers when done
- ✅ **Custom Feature IDs** - Match your Jira/ticket system

---

## 📚 Documentation

- **Quick Start:** See above for basic usage
- **Complete Guide:** [GETTING_STARTED.md](GETTING_STARTED.md) - Step-by-step from zero
- **GitHub:** [github.com/Ambot9/Nexwork](https://github.com/Ambot9/Nexwork)
- **Issues:** [Report bugs or request features](https://github.com/Ambot9/Nexwork/issues)

---

## 🌟 Star This Repo!

If Nexwork helps your workflow, please star the repository! ⭐

**Made with ❤️ for teams managing microservices**
