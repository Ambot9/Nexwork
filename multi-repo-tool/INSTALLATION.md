# Installation Guide

Multiple ways to install Multi-Repo Orchestrator depending on your needs.

## For End Users

### Method 1: NPM Global Install (Recommended)

```bash
npm install -g @yourusername/multi-repo-orchestrator
multi-repo --help
```

### Method 2: npx (No Installation)

```bash
# Use directly without installing
npx @yourusername/multi-repo-orchestrator init
npx @yourusername/multi-repo-orchestrator feature create
```

### Method 3: Clone and Link

```bash
# Clone
git clone https://github.com/yourusername/multi-repo-orchestrator.git
cd multi-repo-orchestrator

# Install
npm install
npm run build
npm link

# Use
multi-repo --help
```

## Configuration for Different Workspace Structures

### Your Structure (FE/BE)

```bash
# Your workspace
cd /Users/mac/Documents/Techbodia

# Create config
cat > .multi-repo.config.json << 'EOF'
{
  "searchPaths": ["FE/*", "BE/*"]
}
EOF

# Initialize
multi-repo init
```

### Someone Else's Structure (services/apps)

```bash
# Their workspace
cd /path/to/their/workspace

# Create config
cat > .multi-repo.config.json << 'EOF'
{
  "searchPaths": ["services/*", "apps/*"]
}
EOF

# Initialize
multi-repo init
```

### Flat Structure

```bash
# Workspace with repos at root
cd /workspace

# Create config
cat > .multi-repo.config.json << 'EOF'
{
  "searchPaths": ["*"]
}
EOF

# Initialize
multi-repo init
```

### Nested Structure

```bash
# Complex nested structure
cd /workspace

# Create config
cat > .multi-repo.config.json << 'EOF'
{
  "searchPaths": [
    "frontend/apps/*",
    "backend/services/*",
    "mobile/*"
  ]
}
EOF

# Initialize
multi-repo init
```

## First Time Setup

After installation:

```bash
# 1. Go to your workspace
cd /your/workspace

# 2. (Optional) Create custom config
#    If your structure is NOT FE/BE/services/packages/apps
cat > .multi-repo.config.json << 'EOF'
{
  "searchPaths": ["your/custom/paths/*"]
}
EOF

# 3. Initialize
multi-repo init

# 4. Verify projects found
cat .multi-repo-config.json

# 5. Create your first feature
multi-repo feature create
```

## Updating

### If Installed via npm

```bash
npm update -g @yourusername/multi-repo-orchestrator
```

### If Installed via Clone

```bash
cd /path/to/multi-repo-orchestrator
git pull
npm install
npm run build
```

## Uninstallation

### If Installed via npm

```bash
npm uninstall -g @yourusername/multi-repo-orchestrator
```

### If Installed via npm link

```bash
cd /path/to/multi-repo-orchestrator
npm unlink
```

### Clean Workspace

```bash
# Remove config files
cd /your/workspace
rm .multi-repo-config.json
rm .multi-repo.config.json

# Remove all worktrees (careful!)
# Check each project first
cd your-project
git worktree list
git worktree remove project-name-FEAT-001
```

## Troubleshooting

### Command not found

**After npm install -g:**
```bash
# Check npm global path
npm config get prefix

# Add to PATH if needed
export PATH="$(npm config get prefix)/bin:$PATH"

# Add to ~/.zshrc or ~/.bashrc permanently
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
```

**After npm link:**
```bash
# Re-link
cd /path/to/multi-repo-orchestrator
npm link

# Or use full path
node /path/to/multi-repo-orchestrator/dist/index.js --help
```

### No projects found

**Check folder structure:**
```bash
ls -la
```

**Check if projects are git repos:**
```bash
ls -la project-name/.git
```

**Create custom config:**
```bash
cat > .multi-repo.config.json << 'EOF'
{
  "searchPaths": ["actual/path/to/projects/*"]
}
EOF

multi-repo init
```

### Permission errors

```bash
# Use sudo (Linux/Mac)
sudo npm install -g @yourusername/multi-repo-orchestrator

# Or install without sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
npm install -g @yourusername/multi-repo-orchestrator
```

## Platform-Specific Notes

### macOS

```bash
# Usually works out of the box
npm install -g @yourusername/multi-repo-orchestrator
```

### Linux

```bash
# May need sudo
sudo npm install -g @yourusername/multi-repo-orchestrator

# Or configure npm for user install
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g @yourusername/multi-repo-orchestrator
```

### Windows

```powershell
# PowerShell as Administrator
npm install -g @yourusername/multi-repo-orchestrator

# Or use WSL for better compatibility
```

## Next Steps

After installation:

1. Read [README.md](README.md) for features
2. Check [EXAMPLES.md](EXAMPLES.md) for usage examples
3. See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

Happy orchestrating! 🚀
