# 🚀 Getting Started with Nexwork - Complete Guide from Zero

## 📋 Table of Contents
1. [Installation](#installation)
2. [First Time Setup](#first-time-setup)
3. [Creating Your First Feature](#creating-your-first-feature)
4. [Working on the Feature](#working-on-the-feature)
5. [Updating Progress](#updating-progress)
6. [Completing the Feature](#completing-the-feature)
7. [Cleanup & Maintenance](#cleanup--maintenance)
8. [Common Workflows](#common-workflows)
9. [Troubleshooting](#troubleshooting)

---

## 📦 Installation

### Step 1: Install Nexwork Globally

```bash
npm install -g multi-repo-orchestrator
```

### Step 2: Verify Installation

```bash
multi-repo --version
# Should show: 1.1.0 (or higher)
```

---

## 🎯 First Time Setup

### Step 1: Navigate to Your Workspace

```bash
cd /Users/mac/Documents/Techbodia
```

Your workspace should look like this:
```
Techbodia/
├── FE/
│   ├── kirby/      (Git repo)
│   ├── tycho/      (Git repo)
│   └── picasso/    (Git repo)
├── BE/
│   ├── coloris/    (Git repo)
│   ├── monika/     (Git repo)
│   └── hermes/     (Git repo)
```

### Step 2: Initialize Nexwork

```bash
multi-repo init
```

**Expected Output:**
```
✅ Initialized configuration at: /Users/mac/Documents/Techbodia/.multi-repo-config.json
📁 Discovered 11 projects:
   - kirby
   - tycho
   - picasso
   - coloris
   - monika
   - hermes
   - core.api
   - promodia
   - proxydia
   - schedudia
   - yog
```

**What this does:**
- Creates `.multi-repo-config.json` in your workspace
- Auto-discovers all Git repositories in FE/ and BE/ folders
- Ready to create features!

---

## 🎨 Creating Your First Feature

### Step 1: Check Current Branch (IMPORTANT!)

Before creating a feature, **make sure you're on the right branch** in each repo:

```bash
# Check coloris
cd /Users/mac/Documents/Techbodia/BE/coloris
git branch
# * staging  ← Make sure it's staging (or your desired branch)

# Pull latest
git pull

# Check kirby
cd /Users/mac/Documents/Techbodia/FE/kirby
git branch
# * staging  ← Make sure it's staging
git pull
```

**Why this matters:**
- Nexwork creates worktrees FROM your current branch
- If you're on `main`, worktrees will be based on `main`
- If you're on `staging`, worktrees will be based on `staging`

### Step 2: Go to Workspace Root

```bash
cd /Users/mac/Documents/Techbodia
```

### Step 3: Create Feature

```bash
multi-repo feature:create
```

### Step 4: Answer the Prompts

#### Prompt 1: Feature Name
```
? Feature name: WPayCard_Integration
```
Type a descriptive name for your feature.

#### Prompt 2: Select Projects
```
? Select projects: (Press <space> to select, <enter> when done)
  ◯ kirby
  ◯ tycho
  ◯ picasso
  ◯ coloris
  ◯ monika
  ◯ hermes
```

**Use SPACE to select**, then **ENTER to confirm**:
```
  ◉ kirby       ← Selected
  ◯ tycho
  ◯ picasso
  ◉ coloris     ← Selected
  ◯ monika
  ◯ hermes
```

#### Prompt 3: Custom Feature ID (Optional)
```
? Use custom Feature ID? (default: FEAT-001) (y/N)
```

**Option A: Use Default**
```
Press N (or just Enter)
✅ Feature created: FEAT-001
```

**Option B: Custom ID**
```
Press Y
? Enter custom Feature ID: WPAY-001
✅ Feature created: WPAY-001
```

#### Prompt 4: Create Worktrees
```
? Create worktrees now? (Y/n)
```
Press Y (or just Enter)

**Expected Output:**
```
🔧 Creating worktrees...

✅ Created worktree from 'staging': /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration/kirby
✅ Created worktree from 'staging': /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration/coloris

✨ Worktrees created from branch(es): staging

✅ All worktrees created!

Next steps:
  1. Navigate to the worktree directories to start working
     cd /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration
  2. Check feature folder: /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration
     📄 README.md - Feature overview
     🤖 claude.md - Context for Claude AI
  3. Run "multi-repo feature:status" to track progress
```

**⚠️ Warning Example (if branch is behind):**
```
⚠️  Warnings:
  coloris: ⚠️  Branch 'staging' is 3 commit(s) behind remote. Consider running 'git pull' first.

✅ Created worktree from 'staging': /Users/mac/.../coloris
```

If you see this, you should:
1. Cancel (Ctrl+C)
2. Go pull the latest: `cd BE/coloris && git pull`
3. Try again: `multi-repo feature:create`

---

## 💻 Working on the Feature

### Step 1: Navigate to Feature Folder

```bash
cd /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration
ls
```

**You'll see:**
```
kirby/          ← Worktree for kirby project
coloris/        ← Worktree for coloris project
README.md       ← Human-readable overview
claude.md       ← AI context file
info.txt        ← Quick reference
worktrees.txt   ← List of worktree paths
```

### Step 2: Open in Your IDE

**VS Code:**
```bash
code .
```

**Cursor:**
```bash
cursor .
```

**WebStorm:**
```bash
webstorm .
```

### Step 3: Check Which Branch You're On

```bash
cd kirby
git branch
```

**Output:**
```
* feature/WPAY-001  ← You're on the feature branch!
  staging
```

### Step 4: Make Your Changes

```bash
# Work on kirby
cd /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration/kirby

# Edit files...
# For example: Add new component

# Check what changed
git status
```

### Step 5: Commit Your Changes

```bash
git add .
git commit -m "Add WPayCard integration to frontend"
```

### Step 6: Push to Remote

```bash
git push origin feature/WPAY-001
```

**First time pushing:**
```bash
git push -u origin feature/WPAY-001
```

### Step 7: Work on Other Projects

```bash
# Go to coloris worktree
cd ../coloris

# Make changes...
git add .
git commit -m "Add WPayCard API endpoints"
git push origin feature/WPAY-001
```

---

## 📊 Updating Progress

### Step 1: Check Feature Status

```bash
cd /Users/mac/Documents/Techbodia
multi-repo feature:status
```

**Output:**
```
📊 Feature Status Report

WPAY-001: WPayCard_Integration
Created: 02/02/2026, 1:30:00 pm
Progress: [0/2] 0%

  ⏳ kirby           pending
     └─ /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration/kirby
  ⏳ coloris         pending
     └─ /Users/mac/Documents/Techbodia/features/2026-02-02-WPayCard-Integration/coloris
```

### Step 2: Update Project Status

```bash
multi-repo feature:update
```

**Follow the prompts:**
```
? Select feature: WPAY-001: WPayCard_Integration
? Select project to update: kirby (pending)
? Select new status: In Progress

✅ Updated kirby status to in_progress
Progress: [0/2] 0%
```

### Step 3: View Updated Status

```bash
multi-repo feature:status
```

**Output:**
```
WPAY-001: WPayCard_Integration
Progress: [0/2] 0%

  🔄 kirby           in_progress  ← Status changed!
  ⏳ coloris         pending
```

### Step 4: Mark as Completed

When done with a project:
```bash
multi-repo feature:update
? Select project: kirby (in_progress)
? Select new status: Completed

✅ Updated kirby status to completed
Progress: [1/2] 50%
```

---

## 📈 Viewing Statistics

### View Detailed Stats

```bash
multi-repo feature:stats WPAY-001
```

**Output:**
```
📊 Feature Statistics

📋 Feature: WPayCard_Integration (WPAY-001)
────────────────────────────────────────────

⏱️  Time Tracking
Created:    02/02/2026, 1:30:00 pm
Started:    02/02/2026, 2:00:00 pm
Completed:  In progress
Elapsed:    3h 30m

📦 Project Status
Total:       2
✅ Completed: 1
🔄 In Progress: 0
⏳ Pending: 1
Progress:    50%

📈 Git Statistics
Commits:       5
Files changed: 12
Lines added:   +342
Lines deleted: -45
Net change:    297

📁 Project Details
✅ kirby               completed
   /Users/mac/.../kirby
   Updated: 02/02/2026, 5:00:00 pm

⏳ coloris             pending
   /Users/mac/.../coloris
   Updated: 02/02/2026, 1:30:00 pm
```

---

## 🏁 Completing the Feature

### Step 1: Ensure All Projects are Completed

```bash
multi-repo feature:status
```

Make sure all projects show ✅ completed.

### Step 2: Complete the Feature

```bash
multi-repo feature:complete WPAY-001
```

### Step 3: Choose Action

```
? What would you like to do?
  > Remove worktrees only (keep branches)
    Merge branches to main and remove worktrees
    Full cleanup (merge, delete branches, remove worktrees)
    Cancel
```

**Option 1: Remove worktrees only**
- Deletes feature folders
- Keeps Git branches (you can merge manually)

**Option 2: Merge branches to main and remove worktrees**
- Merges feature/WPAY-001 to staging (or main)
- Deletes feature folders
- Keeps branches

**Option 3: Full cleanup (Recommended)**
- Merges to staging/main
- Deletes feature folders
- Deletes Git branches
- Complete cleanup!

### Step 4: Confirm Removal

```
? Remove feature from configuration? (Y/n)
```
Press Y

**Output:**
```
✅ Processed kirby
✅ Processed coloris
✓ Deleted feature folder

✅ Feature WPAY-001 completed and removed from configuration!
```

---

## 🧹 Cleanup & Maintenance

### Cleanup All Features at Once

```bash
multi-repo feature:cleanup --all
```

**Deletes:**
- ✅ All worktrees
- ✅ All Git branches (feature/*)
- ✅ All feature folders
- ✅ All from config

### Cleanup Specific Features

```bash
multi-repo feature:cleanup
```

**Use SPACE to select features, ENTER to confirm**

### Delete All Feature Branches

If you have old feature branches from before using Nexwork:

```bash
multi-repo feature:prune-branches
```

**This will:**
- Scan all repos for feature/* branches
- Show you what it found
- Ask confirmation
- Delete all feature branches

---

## 🎯 Common Workflows

### Workflow 1: Quick Feature (One Day)

```bash
# 1. Create
cd /Users/mac/Documents/Techbodia
multi-repo feature:create
# Name: QuickFix_Button
# Projects: kirby

# 2. Work
cd features/2026-02-02-QuickFix-Button/kirby
# ... make changes ...
git add .
git commit -m "Fix button alignment"
git push origin feature/FEAT-001

# 3. Complete
cd /Users/mac/Documents/Techbodia
multi-repo feature:complete FEAT-001
# Choose: Full cleanup
```

### Workflow 2: Large Feature (Multiple Days)

```bash
# Day 1: Create and start
multi-repo feature:create
cd features/2026-02-02-Large-Feature
code .
# Work on projects...
multi-repo feature:update  # Mark in_progress

# Day 2: Continue
cd features/2026-02-02-Large-Feature
# Keep working...
multi-repo feature:stats FEAT-001  # Check progress

# Day 3: Complete
multi-repo feature:update  # Mark completed
multi-repo feature:complete FEAT-001
```

### Workflow 3: Parallel Features (No Conflicts)

```bash
# Create Feature 1
multi-repo feature:create
# Name: Frontend_Enhancement
# Projects: kirby, tycho

# Create Feature 2 (different projects)
multi-repo feature:create
# Name: Backend_API
# Projects: coloris, monika

# Check conflicts
multi-repo feature:status
# No conflicts! Can work in parallel

# Work on both simultaneously
cd features/2026-02-02-Frontend-Enhancement
cd features/2026-02-02-Backend-API
```

---

## 🆘 Troubleshooting

### Problem 1: "Configuration not found"

**Solution:**
```bash
cd /Users/mac/Documents/Techbodia
multi-repo init
```

### Problem 2: "No projects found"

**Solution:**
```bash
# Check your folder structure
ls FE/
ls BE/

# Make sure repos have .git folders
ls FE/kirby/.git
```

### Problem 3: "Branch already exists"

**Cause:** Feature branch from previous feature still exists

**Solution:**
```bash
# Delete old branches
multi-repo feature:prune-branches
```

### Problem 4: "Worktree already exists"

**Cause:** Old worktree folder not cleaned up

**Solution:**
```bash
# Manual cleanup
cd /Users/mac/Documents/Techbodia
rm -rf features/2026-02-02-OldFeature

# Or use cleanup command
multi-repo feature:cleanup --all
```

### Problem 5: "Branch is behind remote"

**Warning shows:**
```
⚠️  Branch 'staging' is 3 commit(s) behind remote
```

**Solution:**
```bash
# Go to each repo and pull
cd BE/coloris
git pull

cd FE/kirby
git pull

# Try again
multi-repo feature:create
```

### Problem 6: Can't push worktree branch

**Error:**
```
fatal: The current branch feature/FEAT-001 has no upstream branch
```

**Solution:**
```bash
cd features/2026-02-02-YourFeature/kirby
git push -u origin feature/FEAT-001
```

---

## 📚 Quick Command Reference

```bash
# Setup
multi-repo init                          # One-time initialization

# Feature Management
multi-repo feature:create                # Create new feature
multi-repo feature:status                # View all features
multi-repo feature:update                # Update project status
multi-repo feature:complete FEAT-001     # Complete feature

# Cleanup
multi-repo feature:cleanup               # Interactive cleanup
multi-repo feature:cleanup --all         # Delete all features
multi-repo feature:prune-branches        # Delete old branches

# Utilities
multi-repo feature:stats FEAT-001        # View statistics
multi-repo feature:refresh-context FEAT-001  # Refresh AI context
multi-repo feature:run FEAT-001 "npm test"   # Run command

# Help
multi-repo --help                        # Show all commands
multi-repo --version                     # Show version
```

---

## 🎓 Best Practices

1. **Always pull before creating features**
   ```bash
   cd BE/coloris && git pull
   cd FE/kirby && git pull
   ```

2. **Use meaningful Feature IDs**
   ```
   ✅ WPAY-001, JIRA-1234, KYC-PHASE2
   ❌ FEAT-001, TEST-1
   ```

3. **Update status regularly**
   - Mark as `in_progress` when you start
   - Mark as `completed` when done

4. **Commit often in worktrees**
   ```bash
   git add .
   git commit -m "Descriptive message"
   git push
   ```

5. **Clean up when done**
   ```bash
   multi-repo feature:complete FEAT-001
   # Choose: Full cleanup
   ```

6. **Check for conflicts**
   ```bash
   multi-repo feature:status
   # Look for ⚠️  Conflicts Detected section
   ```

---

## 🎉 You're Ready!

You now know how to:
- ✅ Install and setup Nexwork
- ✅ Create features with worktrees
- ✅ Work on features across multiple repos
- ✅ Track progress and view statistics
- ✅ Complete and cleanup features
- ✅ Handle common issues

**Next Steps:**
1. Try creating your first feature
2. Work on it
3. Complete it
4. Share with your team!

---

**Need Help?**
- GitHub: https://github.com/Ambot9/Nexwork
- Issues: https://github.com/Ambot9/Nexwork/issues

**Happy coding! 🚀**
