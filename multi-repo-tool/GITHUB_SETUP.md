# GitHub Setup Guide

How to publish Multi-Repo Orchestrator to GitHub and npm.

## Step 1: Prepare the Repository

### 1.1 Complete the Source Code

The tool needs all source files copied. Since the original source was removed, you'll need to:

```bash
# Copy the source files from the working version
# Or use the files in /Users/mac/multi-repo-orchestrator if they exist
```

**Required files:**
- `src/commands/*.ts` - All command files
- `src/core/*.ts` - Core functionality files  
- `src/types.ts` - Type definitions
- `src/index.ts` - Entry point

### 1.2 Update package.json

Replace placeholders:
```json
{
  "name": "@your-github-username/multi-repo-orchestrator",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-github-username/multi-repo-orchestrator.git"
  }
}
```

## Step 2: Create GitHub Repository

### 2.1 On GitHub

1. Go to https://github.com/new
2. Repository name: `multi-repo-orchestrator`
3. Description: "Multi-repository orchestrator for managing features across microservices with git worktrees"
4. Public or Private
5. Don't initialize with README (we have one)
6. Create repository

### 2.2 Push to GitHub

```bash
cd /Users/mac/multi-repo-tool

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Multi-Repo Orchestrator v1.0.0"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/multi-repo-orchestrator.git

# Push
git branch -M main
git push -u origin main
```

## Step 3: Publish to npm (Optional)

### 3.1 Create npm Account

1. Go to https://www.npmjs.com/signup
2. Create account
3. Verify email

### 3.2 Login via CLI

```bash
npm login
# Enter username, password, email
```

### 3.3 Publish

```bash
cd /Users/mac/multi-repo-tool

# Make sure it builds
npm install
npm run build

# Publish
npm publish --access public

# If scoped package
npm publish --access public --scope @your-username
```

### 3.4 Update README

After publishing, update installation commands:
```bash
npm install -g @your-username/multi-repo-orchestrator
```

## Step 4: Configure for Users

### 4.1 Create Release

On GitHub:
1. Go to Releases
2. Click "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: "Multi-Repo Orchestrator v1.0.0"
5. Description: List features
6. Publish release

### 4.2 Add Topics

On GitHub repository page:
- Click "Add topics"
- Add: `git`, `worktree`, `microservices`, `cli`, `orchestrator`, `typescript`

### 4.3 Enable Issues/Discussions

Repository Settings:
- ✅ Issues
- ✅ Discussions
- ✅ Projects (optional)

## Step 5: Documentation

### 5.1 GitHub Pages (Optional)

Create `docs/` folder for documentation website:

```bash
mkdir docs
echo "# Multi-Repo Orchestrator" > docs/index.md
```

Enable in Settings > Pages

### 5.2 Wiki

Create wiki pages:
- Getting Started
- Configuration Guide
- Examples
- Troubleshooting
- API Reference

## Step 6: For Your Use Case

### 6.1 Example Config for Your Team

Create `.multi-repo.config.json` in your Techbodia workspace:

```json
{
  "searchPaths": ["FE/*", "BE/*"],
  "exclude": [
    "node_modules",
    "dist",
    "build",
    ".git"
  ]
}
```

Commit this to your workspace repo!

### 6.2 Team Installation Guide

Share with team:

```bash
# 1. Install tool globally
npm install -g @your-username/multi-repo-orchestrator

# 2. Go to Techbodia workspace
cd /Users/mac/Documents/Techbodia

# 3. Initialize (config already exists in repo)
multi-repo init

# 4. Start creating features!
multi-repo feature create
```

## Step 7: For Other Users

### 7.1 Different Structures

They create their own `.multi-repo.config.json`:

**Services structure:**
```json
{
  "searchPaths": ["services/*", "apps/*"]
}
```

**Monorepo:**
```json
{
  "searchPaths": ["packages/*"]
}
```

**Flat:**
```json
{
  "searchPaths": ["*"]
}
```

### 7.2 Installation

```bash
# Install
npm install -g @your-username/multi-repo-orchestrator

# Configure for their structure
cd /their/workspace
cat > .multi-repo.config.json << 'EOF'
{
  "searchPaths": ["their/custom/paths/*"]
}
EOF

# Initialize
multi-repo init
```

## Step 8: Maintenance

### 8.1 Version Updates

When you add features:

```bash
# Update version in package.json
# 1.0.0 -> 1.1.0 (new features)
# 1.0.0 -> 1.0.1 (bug fixes)

# Commit changes
git add .
git commit -m "feat: add new feature"
git push

# Create new release on GitHub

# Publish to npm
npm publish
```

### 8.2 User Updates

Users update with:
```bash
npm update -g @your-username/multi-repo-orchestrator
```

## Summary

**To publish:**

1. ✅ Complete source code
2. ✅ Create GitHub repo
3. ✅ Push code
4. ✅ (Optional) Publish to npm
5. ✅ Create releases

**For your team:**

```bash
npm install -g @your-username/multi-repo-orchestrator
cd /Techbodia
multi-repo init
```

**For others:**

```bash
npm install -g @your-username/multi-repo-orchestrator
cd /their-workspace
# Create .multi-repo.config.json for their structure
multi-repo init
```

The tool is **flexible** - works with ANY folder structure through configuration! 🎉
