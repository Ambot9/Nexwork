# Multi-Repo Orchestrator

🚀 A powerful CLI tool for managing features across multiple repositories using Git worktrees. Perfect for microservices architectures!

## Features

✅ **Flexible Project Discovery** - Works with ANY folder structure  
✅ **Git Worktree Management** - Isolated development environments  
✅ **Conflict Detection** - Avoid merge conflicts before they happen  
✅ **Smart Sequencing** - Optimal execution order for parallel work  
✅ **Progress Tracking** - Visual status across all repositories  
✅ **Multi-Repo Coordination** - Single command for complex operations  

## Installation

### Option 1: NPM Global Install (Recommended)

```bash
npm install -g @yourusername/multi-repo-orchestrator

# Verify installation
multi-repo --help
```

### Option 2: Clone and Link

```bash
# Clone the repository
git clone https://github.com/yourusername/multi-repo-orchestrator.git
cd multi-repo-orchestrator

# Install dependencies
npm install

# Build
npm run build

# Link globally
npm link

# Verify
multi-repo --help
```

### Option 3: Use npx (No Installation)

```bash
npx @yourusername/multi-repo-orchestrator init
npx @yourusername/multi-repo-orchestrator feature create
```

## Quick Start

### 1. Navigate to Your Workspace

Your workspace can have ANY structure! Examples:

```bash
# Example 1: FE/BE structure
/workspace
├── FE/
│   ├── project-a/
│   └── project-b/
└── BE/
    ├── service-1/
    └── service-2/

# Example 2: Services structure
/workspace
├── services/
│   ├── api/
│   ├── auth/
│   └── payments/
└── apps/
    ├── web/
    └── mobile/

# Example 3: Flat structure
/workspace
├── frontend-app/
├── backend-api/
├── admin-panel/
└── mobile-app/
```

### 2. Configure Search Paths (Optional)

Create `.multi-repo.config.json` in your workspace to customize project discovery:

```json
{
  "searchPaths": [
    "FE/*",
    "BE/*",
    "services/*",
    "packages/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ]
}
```

**Without this file**, the tool will search for git repos in:
- `FE/*`
- `BE/*`
- `services/*`
- `packages/*`
- `apps/*`

### 3. Initialize

```bash
cd /your/workspace
multi-repo init
```

This will:
- Scan for git repositories
- Create `.multi-repo-config.json`
- Display all discovered projects

### 4. Create a Feature

```bash
multi-repo feature create
```

Interactive prompts:
```
? Feature name: Add Payment Integration
? Select projects:
  ◉ api-service
  ◉ web-app
  ◉ mobile-app
  ◯ admin-panel

? Create worktrees now? Yes
```

### 5. Work on the Feature

```bash
# Navigate to worktree
cd api-service-FEAT-001

# Make changes (with AI or manually)
# Changes are isolated to this worktree!

git add .
git commit -m "Add payment endpoint"
```

### 6. Track Progress

```bash
multi-repo feature status
```

Output:
```
📊 Feature Status Report

FEAT-001: Add Payment Integration
Progress: [2/3] 67%

  ✅ api-service     completed
  ✅ web-app         completed
  🔄 mobile-app      in_progress
```

### 7. Complete the Feature

```bash
multi-repo feature complete FEAT-001
```

## Configuration for Different Structures

### Example 1: Standard FE/BE

```json
{
  "searchPaths": ["FE/*", "BE/*"]
}
```

### Example 2: Microservices

```json
{
  "searchPaths": ["services/*", "apps/*"]
}
```

### Example 3: Monorepo

```json
{
  "searchPaths": ["packages/*", "apps/*", "services/*"]
}
```

### Example 4: Nested Structure

```json
{
  "searchPaths": [
    "frontend/apps/*",
    "backend/services/*",
    "mobile/*"
  ]
}
```

### Example 5: Flat Structure

```json
{
  "searchPaths": ["*"]
}
```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `multi-repo init` | Initialize configuration | `multi-repo init` |
| `multi-repo feature create` | Create new feature | `multi-repo feature create` |
| `multi-repo feature status` | Show all features | `multi-repo feature status` |
| `multi-repo feature update` | Update project status | `multi-repo feature update` |
| `multi-repo feature complete` | Complete feature | `multi-repo feature complete FEAT-001` |

## Real-World Example

### Scenario: Payment Integration Feature

**Affects:**
- api-service (BE)
- web-app (FE)
- mobile-app (FE)

**Workflow:**

```bash
# 1. Initialize (one time)
cd /workspace
multi-repo init

# 2. Create feature
multi-repo feature create
# Name: Payment Integration
# Projects: api-service, web-app, mobile-app

# 3. Work in isolation
cd api-service-FEAT-001
# Implement payment API...

cd ../web-app-FEAT-001
# Add payment UI...

cd ../mobile-app-FEAT-001
# Add payment screens...

# 4. Check progress
multi-repo feature status

# 5. Complete
multi-repo feature complete FEAT-001
# Choose: Full cleanup (merge, delete branches, remove worktrees)
```

## For Teams

### Setup for New Team Member

```bash
# 1. Clone workspace
git clone https://github.com/team/workspace.git
cd workspace

# 2. Install tool
npm install -g @yourusername/multi-repo-orchestrator

# 3. Initialize
multi-repo init

# 4. Start working!
multi-repo feature create
```

### Custom Configuration Per Team

Include `.multi-repo.config.json` in your workspace repo:

```json
{
  "searchPaths": [
    "frontend/apps/*",
    "backend/services/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "*.test.*"
  ]
}
```

Commit this file so all team members use the same configuration!

## Troubleshooting

### No projects found

**Problem:** `multi-repo init` finds 0 projects

**Solutions:**

1. **Check your folder structure**
   ```bash
   ls -la
   ```

2. **Verify projects are git repos**
   ```bash
   ls -la project-name/.git
   ```

3. **Create custom config** with correct search paths
   ```bash
   cat > .multi-repo.config.json << EOF
   {
     "searchPaths": ["your/custom/path/*"]
   }
   EOF
   ```

4. **Re-run init**
   ```bash
   multi-repo init
   ```

### Projects in different locations

If your structure is:
```
/workspace
├── deep/nested/frontend/app1/
├── deep/nested/frontend/app2/
└── services/backend/api/
```

Use wildcards:
```json
{
  "searchPaths": [
    "deep/nested/frontend/*",
    "services/backend/*"
  ]
}
```

### Projects not in subdirectories

If your repos are at root level:
```
/workspace
├── repo1/
├── repo2/
└── repo3/
```

Use:
```json
{
  "searchPaths": ["*"]
}
```

## Advanced Usage

### Multiple Features with Conflicts

```bash
# Create two features
multi-repo feature create  # FEAT-001: Payment
multi-repo feature create  # FEAT-002: Auth

# Check conflicts
multi-repo feature status

# Output shows:
# ⚠️ Conflicts: FEAT-001 ↔ FEAT-002 on api-service
# Suggested: Work on FEAT-001 first
```

### Custom Branch Names

Features use `feature/FEAT-XXX` by default. Worktrees are named `{project}-FEAT-XXX`.

### Integration with CI/CD

```yaml
# .github/workflows/feature.yml
name: Feature Workflow
on:
  push:
    branches:
      - 'feature/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install tool
        run: npm install -g @yourusername/multi-repo-orchestrator
      - name: Check status
        run: multi-repo feature status
```

## Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

- 📖 [Documentation](https://github.com/yourusername/multi-repo-orchestrator/wiki)
- 🐛 [Issues](https://github.com/yourusername/multi-repo-orchestrator/issues)
- 💬 [Discussions](https://github.com/yourusername/multi-repo-orchestrator/discussions)

## Roadmap

- [ ] Support for custom branch naming
- [ ] Integration with GitHub/GitLab for PR creation
- [ ] Web dashboard for visual tracking
- [ ] Slack/Discord notifications
- [ ] Plugin system
- [ ] Support for git submodules

---

Made with ❤️ for developers managing microservices
