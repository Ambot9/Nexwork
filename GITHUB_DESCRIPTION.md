# GitHub Repository Description & Setup Guide

## Short Description (for GitHub repo description field)

```
🚀 Manage features across multiple Git repositories with isolated worktrees, AI-powered context generation, and cross-repo command execution. Perfect for microservices teams!
```

## About Section (190 characters max for GitHub)

```
Multi-repo orchestrator with Git worktrees, AI context generation, time tracking, and cross-repo commands. Built for microservices and multi-repository workflows.
```

## Topics/Tags (add these to your GitHub repo)

```
git
worktree
microservices
multi-repo
orchestrator
cli-tool
developer-tools
productivity
nodejs
typescript
ai-tools
devops
git-workflow
monorepo-alternative
```

---

## Complete Step-by-Step Guide for GitHub README

This is a beginner-friendly tutorial showing exactly how to use the tool:

---

# 🎯 Complete Step-by-Step Tutorial

## What This Tool Does

Imagine you're building a payment feature that needs changes in 3 repos:
- `frontend-app` (React UI)
- `backend-api` (Node.js API)
- `payment-service` (Python service)

**Without this tool:**
- ❌ Manually clone/branch each repo
- ❌ Track progress in your head
- ❌ Switch between 3 different folders
- ❌ Remember which repos are involved

**With this tool:**
- ✅ One command creates all worktrees
- ✅ Auto-tracks progress
- ✅ All repos in one feature folder
- ✅ Run tests across all repos at once
- ✅ AI gets complete context automatically

---

## 📦 Installation

### Option 1: Install from npm

```bash
npm install -g multi-repo-orchestrator
```

### Option 2: Install from source

```bash
git clone https://github.com/YOUR_USERNAME/multi-repo-orchestrator.git
cd multi-repo-orchestrator
npm install
npm run build
npm install -g .
```

### Verify Installation

```bash
multi-repo --version
# Should show: 1.0.0
```

---

## 🚀 Quick Start (5 minutes)

### Your Workspace Structure

Let's say your workspace looks like this:

```
~/projects/my-company/
├── frontend/
│   ├── web-app/           # React app
│   └── mobile-app/        # React Native app
├── backend/
│   ├── user-service/      # Node.js
│   ├── payment-service/   # Python
│   └── notification-service/  # Go
└── shared/
    └── common-lib/        # Shared utilities
```

### Step 1: Initialize (One-time setup)

```bash
cd ~/projects/my-company
multi-repo init
```

**What happens:**
```
✅ Initialized configuration at: ~/projects/my-company/.multi-repo-config.json
📁 Discovered 6 projects:
   - web-app
   - mobile-app
   - user-service
   - payment-service
   - notification-service
   - common-lib
```

---

## 📋 Example 1: Simple Feature (One Repo)

### Create Feature

```bash
multi-repo feature:create
```

**Interactive prompts:**
```
? Enter feature name: Add Dark Mode
? Select projects: (use space to select, enter to confirm)
  ◉ web-app
  ◯ mobile-app
  ◯ user-service
  ◯ payment-service
  ◯ notification-service
  ◯ common-lib
```

**Result:**
```
✅ Feature created: FEAT-001
📁 Feature folder: ~/projects/my-company/features/2026-01-31-Add-Dark-Mode/
📄 Created files:
   - README.md (overview)
   - claude.md (AI context)
   - info.txt (quick reference)
   - worktrees.txt (paths)

🌿 Worktrees created:
   ✓ web-app → feature/FEAT-001
```

### Work on the Feature

```bash
cd features/2026-01-31-Add-Dark-Mode/web-app
# Make your changes...
git add .
git commit -m "Add dark mode toggle"
```

### Check Status

```bash
multi-repo feature:status
```

**Output:**
```
📊 Feature Status Report

FEAT-001: Add Dark Mode
Created: 31/01/2026, 2:00:00 pm
Progress: [0/1] 0%

  ⏳ web-app          pending
     └─ ~/projects/my-company/features/2026-01-31-Add-Dark-Mode/web-app
```

### Update Progress

```bash
multi-repo feature:update
```

**Interactive:**
```
? Select feature: FEAT-001: Add Dark Mode
? Select project: web-app (pending)
? Select new status: In Progress

✅ Updated web-app status to in_progress
Progress: [0/1] 0%
```

### Complete Feature

```bash
multi-repo feature:complete FEAT-001
```

**What happens:**
```
? Are you sure you want to complete FEAT-001? Yes

✅ Removed worktree: web-app
✅ Feature FEAT-001 completed!
💡 Don't forget to merge feature/FEAT-001 to main in each repo
```

---

## 📋 Example 2: Multi-Repo Feature

### Create Complex Feature

```bash
multi-repo feature:create
```

**Selections:**
```
? Enter feature name: Payment Integration
? Select projects:
  ◉ web-app          (Frontend UI)
  ◯ mobile-app
  ◉ user-service     (User balance)
  ◉ payment-service  (Payment processing)
  ◯ notification-service
  ◯ common-lib
```

**Result:**
```
✅ Feature created: FEAT-002

📁 ~/projects/my-company/features/2026-01-31-Payment-Integration/
   ├── README.md
   ├── claude.md
   ├── web-app/           (worktree)
   ├── user-service/      (worktree)
   └── payment-service/   (worktree)

🌿 3 worktrees created on branch: feature/FEAT-002
```

### View All Features

```bash
multi-repo feature:status
```

**Output:**
```
FEAT-001: Add Dark Mode
Created: 31/01/2026, 2:00:00 pm
Progress: [1/1] 100%
  ✅ web-app          completed

FEAT-002: Payment Integration
Created: 31/01/2026, 3:00:00 pm
Progress: [0/3] 0%
  ⏳ web-app          pending
  ⏳ user-service     pending
  ⏳ payment-service  pending

⚠️  Conflicts Detected:
  FEAT-001 ↔ FEAT-002
  Conflicting projects: web-app

📋 Suggested Execution Plan:
  Batch 1: FEAT-001 (complete first)
  Batch 2: FEAT-002
```

---

## 🤖 Example 3: AI Productivity

### Open in AI Assistant

```bash
cd features/2026-01-31-Payment-Integration
code .  # Or your preferred IDE
```

In Claude/ChatGPT, paste the content of `claude.md`:

**claude.md contains:**
```markdown
# Context for Claude AI

## Your Task
Implement: Payment Integration

## Project Worktrees

### web-app
- Path: ~/projects/my-company/features/2026-01-31-Payment-Integration/web-app
- Branch: feature/FEAT-002

### user-service
- Path: ~/projects/my-company/features/2026-01-31-Payment-Integration/user-service
- Branch: feature/FEAT-002

### payment-service
- Path: ~/projects/my-company/features/2026-01-31-Payment-Integration/payment-service
- Branch: feature/FEAT-002

## File Structures

(Complete file tree for each project)

## Important Rules
1. Always use absolute paths
2. Each worktree is isolated
3. All on branch: feature/FEAT-002
```

### After Adding Files

```bash
multi-repo feature:refresh-context FEAT-002
```

**Result:**
```
🔄 Refreshing Claude context...
  Scanning web-app...
  ✅ web-app scanned
  Scanning user-service...
  ✅ user-service scanned
  Scanning payment-service...
  ✅ payment-service scanned

✅ Claude context refreshed!
📄 Updated: ~/projects/.../claude.md
```

---

## 🏃 Example 4: Run Commands Across Repos

### Run Tests

```bash
multi-repo feature:run FEAT-002 "npm test"
```

**Output:**
```
🚀 Running command across worktrees...
Command: npm test

📦 web-app
   Detected: Node.js
   ✅ Success
   > All tests passed (23/23)

📦 user-service
   Detected: Node.js
   ✅ Success
   > All tests passed (45/45)

📦 payment-service
   Detected: Python
   ❌ Failed
   > 2 tests failed

📊 Summary
✅ Successful: 2/3
❌ Failed: 1/3

Failed projects:
  - payment-service
```

### Check Git Status

```bash
multi-repo feature:run FEAT-002 "git status"
```

### Install Dependencies

```bash
multi-repo feature:run FEAT-002 "npm install"
```

---

## 📊 Example 5: Track Progress & Stats

### View Detailed Statistics

```bash
multi-repo feature:stats FEAT-002
```

**Output:**
```
📊 Feature Statistics

📋 Feature: Payment Integration (FEAT-002)
────────────────────────────────────────────

⏱️  Time Tracking
Created:    31/01/2026, 3:00:00 pm
Started:    31/01/2026, 3:15:00 pm
Completed:  In progress
Elapsed:    2h 45m

📦 Project Status
Total:       3
✅ Completed: 1
🔄 In Progress: 1
⏳ Pending: 1
Progress:    33%

📈 Git Statistics
Commits:       12
Files changed: 45
Lines added:   +823
Lines deleted: -156
Net change:    667

📁 Project Details
✅ web-app               completed
   ~/projects/.../web-app
   Updated: 31/01/2026, 5:30:00 pm

🔄 user-service          in_progress
   ~/projects/.../user-service
   Updated: 31/01/2026, 4:15:00 pm

⏳ payment-service       pending
   ~/projects/.../payment-service
   Updated: 31/01/2026, 3:00:00 pm
```

---

## 🎓 Example 6: Complete Workflow

```bash
# 1. Create feature
multi-repo feature:create
# Name: "User Authentication"
# Select: web-app, user-service

# 2. Navigate to feature folder
cd features/2026-01-31-User-Authentication

# 3. Open in IDE
code .

# 4. Make changes in web-app
cd web-app
# ... edit files ...
git add .
git commit -m "Add login form"

# 5. Update status
multi-repo feature:update
# Feature: FEAT-003
# Project: web-app
# Status: completed

# 6. Make changes in user-service
cd ../user-service
# ... edit files ...
git add .
git commit -m "Add JWT authentication"

# 7. Run tests across all repos
multi-repo feature:run FEAT-003 "npm test"

# 8. Check statistics
multi-repo feature:stats FEAT-003

# 9. Refresh AI context
multi-repo feature:refresh-context FEAT-003

# 10. Complete feature
multi-repo feature:complete FEAT-003
```

---

## 💡 Common Workflows

### Daily Standup

```bash
multi-repo feature:status
# See all features and progress
```

### Code Review

```bash
multi-repo feature:stats FEAT-005
# Show commits, files changed, time spent
```

### QA Testing

```bash
multi-repo feature:run FEAT-005 "npm run build"
multi-repo feature:run FEAT-005 "npm test"
```

### Documentation

```bash
# All context is in the feature folder
cat features/2026-01-31-MyFeature/README.md
```

---

## 🔧 Customization

### Custom Search Paths

Create `.multi-repo.user.json`:

```json
{
  "searchPaths": ["apps/*", "services/*", "libs/*"],
  "exclude": ["node_modules", "dist", ".git"]
}
```

Then reinitialize:

```bash
multi-repo init
```

---

## 📚 All Commands Reference

```bash
# Setup
multi-repo init                          # Initialize workspace

# Feature Management
multi-repo feature:create                # Create new feature
multi-repo feature:status                # Show all features
multi-repo feature:update                # Update project status
multi-repo feature:complete FEAT-001     # Complete & cleanup

# AI Productivity
multi-repo feature:refresh-context FEAT-001  # Refresh AI context

# Multi-Repo Operations
multi-repo feature:run FEAT-001 "npm test"   # Run command

# Analytics
multi-repo feature:stats FEAT-001        # Show statistics

# Help
multi-repo --help                        # Show all commands
multi-repo --version                     # Show version
```

---

## 🎯 Real-World Use Cases

### Use Case 1: Microservices Team
- 10+ repositories
- Features span 3-5 services
- Track progress across team
- AI helps write consistent code

### Use Case 2: Full-Stack Developer
- Frontend + Backend + Database repos
- Work on features in isolation
- Run tests across all layers
- Track time spent

### Use Case 3: Open Source Maintainer
- Multiple related projects
- Coordinate breaking changes
- Test across repositories
- Document changes easily

---

## 🆘 Troubleshooting

### "Configuration not found"
```bash
multi-repo init
```

### "No projects found"
1. Ensure repos have `.git` folders
2. Check your folder structure matches search paths
3. Create `.multi-repo.user.json` with custom paths

### Worktree already exists
```bash
# Clean up old worktrees
git worktree prune
```

### Can't push worktree branch
```bash
cd features/2026-01-31-MyFeature/my-repo
git push -u origin feature/FEAT-001
```

---

## 🌟 Tips & Best Practices

1. **Name features clearly**: Use descriptive names like "Add Payment Gateway" not "Feature 1"
2. **Update status regularly**: Keep team informed of progress
3. **Refresh context often**: Run `refresh-context` after adding files
4. **Use run for consistency**: Run tests/builds across all repos
5. **Complete features promptly**: Don't let worktrees accumulate

---

## 📄 License

MIT License - See LICENSE file

---

## 🤝 Contributing

Issues and PRs welcome!

---

**Happy multi-repo orchestrating! 🎉**
