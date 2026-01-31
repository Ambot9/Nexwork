# Usage Examples

## Example 1: Single Feature Across Multiple Services

### Scenario
You need to integrate a new payment provider that requires changes in:
- Kirby (FE) - Add UI for payment selection
- Tycho (FE) - Add player-facing payment options
- Coloris (BE) - Add routing logic
- Hermes (BE) - Implement payment provider integration
- Monika (BE) - Add database tables and stored procedures

### Steps

```bash
# 1. Initialize (one-time setup)
cd /workspace
multi-repo init

# 2. Create the feature
multi-repo feature create
# Input:
#   Feature name: Integrate Stripe Payment Provider
#   Select projects: Kirby, Tycho, Coloris, Hermes, Monika
#   Create worktrees now? Yes

# Output:
# ✅ Feature created: FEAT-001
# ✅ Created worktree: /workspace/FE/Kirby-FEAT-001
# ✅ Created worktree: /workspace/FE/Tycho-FEAT-001
# ✅ Created worktree: /workspace/BE/Coloris-FEAT-001
# ✅ Created worktree: /workspace/BE/Hermes-FEAT-001
# ✅ Created worktree: /workspace/BE/Monika-FEAT-001

# 3. Work on Monika first (database changes)
cd /workspace/BE/Monika-FEAT-001
claude "Create tables for Stripe payment provider"
git add .
git commit -m "Add Stripe payment tables"

# 4. Work on Hermes (payment integration)
cd /workspace/BE/Hermes-FEAT-001
claude "Implement Stripe payment provider client"
git add .
git commit -m "Add Stripe integration"

# 5. Work on Coloris (routing)
cd /workspace/BE/Coloris-FEAT-001
claude "Add routes for Stripe payment"
git add .
git commit -m "Add Stripe routing"

# 6. Work on FE projects
cd /workspace/FE/Kirby-FEAT-001
claude "Add Stripe payment option in backoffice"

cd /workspace/FE/Tycho-FEAT-001
claude "Add Stripe payment option for players"

# 7. Check progress
multi-repo feature status

# 8. Update status if needed
multi-repo feature update
# Select FEAT-001, then each completed project

# 9. Complete the feature
multi-repo feature complete FEAT-001
# Select: Full cleanup (merge, delete branches, remove worktrees)
```

## Example 2: Multiple Features with Conflicts

### Scenario
You have two features that both need changes in the same services:

**Feature 1: New Payment Provider**
- Projects: Kirby, Tycho, Coloris, Hermes, Monika

**Feature 2: Prevent Duplicate Transactions**
- Projects: Tycho, Coloris, Hermes

Both features touch Tycho, Coloris, and Hermes - this creates conflicts!

### Steps

```bash
# 1. Create Feature 1
multi-repo feature create
# Input: New Payment Provider
# Projects: Kirby, Tycho, Coloris, Hermes, Monika

# 2. Create Feature 2
multi-repo feature create
# Input: Prevent Duplicate Transactions
# Projects: Tycho, Coloris, Hermes

# 3. Check for conflicts
multi-repo feature status

# Output shows:
# ⚠️  Conflicts Detected:
#   FEAT-001 ↔ FEAT-002
#   Conflicting projects: Tycho, Coloris, Hermes
#
# 📋 Suggested Execution Plan:
#   Batch 1: FEAT-001
#   Batch 2: FEAT-002

# 4. Work on Feature 1 first (no conflicts with other features)
# Work on all projects for FEAT-001...

# 5. Complete Feature 1
multi-repo feature complete FEAT-001

# 6. Now work on Feature 2 (no more conflicts)
cd /workspace/FE/Tycho-FEAT-002
claude "Add duplicate transaction check"

cd /workspace/BE/Coloris-FEAT-002
claude "Add transaction deduplication middleware"

cd /workspace/BE/Hermes-FEAT-002
claude "Implement idempotency keys"

# 7. Complete Feature 2
multi-repo feature complete FEAT-002
```

## Example 3: Parallel Development (No Conflicts)

### Scenario
Two features that touch completely different services:

**Feature 1: Admin Dashboard Redesign**
- Projects: Kirby only

**Feature 2: Player Loyalty System**
- Projects: Tycho, Promodia

No conflicts! Can work on both simultaneously.

### Steps

```bash
# 1. Create both features
multi-repo feature create
# Feature 1: Admin Dashboard Redesign
# Projects: Kirby

multi-repo feature create
# Feature 2: Player Loyalty System
# Projects: Tycho, Promodia

# 2. Check status
multi-repo feature status

# Output shows:
# 📋 Suggested Execution Plan:
#   Batch 1 (can work in parallel):
#     - FEAT-001: Admin Dashboard Redesign
#     - FEAT-002: Player Loyalty System

# 3. Work on both in parallel!
# Terminal 1:
cd /workspace/FE/Kirby-FEAT-001
claude "Redesign admin dashboard"

# Terminal 2:
cd /workspace/FE/Tycho-FEAT-002
claude "Add loyalty points UI"

# Terminal 3:
cd /workspace/BE/Promodia-FEAT-002
claude "Implement loyalty points calculation"

# 4. Complete both when ready
multi-repo feature complete FEAT-001
multi-repo feature complete FEAT-002
```

## Example 4: Partial Feature Completion

### Scenario
You've completed some projects but not all, and need to temporarily stop work.

### Steps

```bash
# 1. Create feature
multi-repo feature create
# Feature: Integrate PayPal
# Projects: Kirby, Tycho, Coloris, Hermes

# 2. Complete work on some projects
cd /workspace/BE/Hermes-FEAT-001
# Complete implementation
git commit -m "Done"

cd /workspace/BE/Coloris-FEAT-001
# Complete implementation
git commit -m "Done"

# 3. Update status manually
multi-repo feature update
# Select FEAT-001 → Hermes → Completed
multi-repo feature update
# Select FEAT-001 → Coloris → Completed

# 4. Check status
multi-repo feature status
# Output:
# FEAT-001: Integrate PayPal
# Progress: [2/4] 50%
#   ✅ Hermes          completed
#   ✅ Coloris         completed
#   ⏳ Kirby           pending
#   ⏳ Tycho           pending

# 5. Complete feature but keep branches for later
multi-repo feature complete FEAT-001
# Select: Remove worktrees only (keep branches)
# Select: No (don't remove from config)

# Now worktrees are cleaned up but branches remain
# Can recreate worktrees later or work directly on branches
```

## Example 5: Using with AI Assistants

### Scenario
Using Claude Code or other AI assistants in isolated worktrees.

### Steps

```bash
# 1. Create feature with worktrees
multi-repo feature create
# Feature: Add GraphQL API
# Projects: Coloris, Hermes

# 2. Work in first worktree with Claude
cd /workspace/BE/Coloris-FEAT-001

# Ask Claude to implement GraphQL
claude "Add GraphQL schema and resolvers for payment queries"

# Claude works in this isolated environment:
# - Reads files from FEAT-001 worktree
# - Makes changes only to feature branch
# - Main branch untouched

# 3. Test changes in isolation
npm test

# 4. Move to next service
cd /workspace/BE/Hermes-FEAT-001

# Continue with Claude
claude "Add GraphQL mutations for payment processing"

# 5. Complete when all done
multi-repo feature complete FEAT-001
```

## Tips and Best Practices

### 1. Always Check Status Before Starting
```bash
multi-repo feature status
```
This shows conflicts and suggests execution order.

### 2. Work on Non-Conflicting Projects First
If Feature 1 touches [A, B, C] and Feature 2 touches [B, C, D]:
- Work on A for Feature 1 (no conflicts)
- Work on D for Feature 2 (no conflicts)
- Complete one feature before starting conflicting projects

### 3. Update Status Regularly
```bash
multi-repo feature update
```
Keeps progress visible to team members.

### 4. Use Feature Complete Options Wisely
- **Remove worktrees only**: If you want to keep branches for backup
- **Merge and remove**: Standard workflow after testing
- **Full cleanup**: When feature is fully done and merged

### 5. Name Features Descriptively
Good: "Integrate Stripe Payment Provider"
Bad: "Feature 1" or "Payment stuff"

### 6. Test in Worktrees Before Merging
Each worktree is isolated - run tests there:
```bash
cd /workspace/BE/Coloris-FEAT-001
npm test
npm run build
```

### 7. Use Worktrees for Long-Running Features
If a feature takes days/weeks:
- Worktrees keep it separate from main
- Can work on other features in main repos
- No branch switching confusion
