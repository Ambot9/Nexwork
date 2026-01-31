# Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Multi-Repo Orchestrator                   │
│                          (CLI Tool)                           │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
        │   Commands   │ │  Core  │ │   Utils    │
        │              │ │        │ │            │
        │ - init       │ │ Config │ │ Types      │
        │ - create     │ │ Manager│ │            │
        │ - status     │ │        │ │            │
        │ - update     │ │ Worktree│            │
        │ - complete   │ │ Manager│            │
        │              │ │        │            │
        │              │ │ Conflict│           │
        │              │ │ Detector│           │
        └──────────────┘ └────────┘ └───────────┘
                │
                │
        ┌───────▼──────────────────────────┐
        │   .multi-repo-config.json        │
        │   (Workspace Configuration)       │
        └───────┬──────────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
┌───▼───┐   ┌──▼──┐    ┌───▼────┐
│  FE/  │   │ BE/ │    │ Other  │
│       │   │     │    │        │
│ Kirby │   │Coloris  │Project │
│ Tycho │   │Hermes│    │        │
└───────┘   └─────┘    └────────┘
```

## Data Flow

### 1. Feature Creation Flow

```
User runs: multi-repo feature create
    ↓
CLI prompts for:
  - Feature name
  - Project selection
    ↓
ConfigManager creates Feature object
    ↓
For each selected project:
    ↓
    WorktreeManager.createWorktree()
        ↓
        Git operations:
        1. Create branch: feature/FEAT-XXX
        2. Create worktree: {Project}-FEAT-XXX
        ↓
    Update Feature with worktree path
    ↓
ConfigManager.saveConfig()
    ↓
Display success + worktree paths
```

### 2. Status Check Flow

```
User runs: multi-repo feature status
    ↓
ConfigManager.getAllFeatures()
    ↓
For each feature:
    ↓
    Calculate progress
    Display project statuses
    ↓
ConflictDetector.detectConflicts()
    ↓
Build conflict graph
    ↓
Display conflicts (if any)
    ↓
ConflictDetector.createExecutionPlan()
    ↓
Topological sort
    ↓
Display suggested execution order
```

### 3. Feature Completion Flow

```
User runs: multi-repo feature complete FEAT-XXX
    ↓
ConfigManager.getFeature(FEAT-XXX)
    ↓
Prompt for cleanup action:
  - Remove worktrees only
  - Merge + remove worktrees
  - Full cleanup
    ↓
For each project in feature:
    ↓
    WorktreeManager operations:
    1. Merge branch (if requested)
    2. Remove worktree
    3. Delete branch (if requested)
    ↓
ConfigManager.deleteFeature() (if requested)
    ↓
Display completion message
```

## Component Details

### Commands Layer

**Responsibility:** User interaction and orchestration

```
init.ts
├─ Prompt user for workspace
├─ Call ConfigManager.initialize()
└─ Display discovered projects

create.ts
├─ Prompt for feature details
├─ Generate feature ID
├─ Call WorktreeManager for each project
├─ Update configuration
└─ Display worktree paths

status.ts
├─ Load all features
├─ Calculate progress for each
├─ Call ConflictDetector
├─ Display formatted output
└─ Show execution plan

update.ts
├─ Prompt for feature selection
├─ Prompt for project selection
├─ Prompt for new status
└─ Call ConfigManager.updateProjectStatus()

complete.ts
├─ Prompt for cleanup action
├─ Call WorktreeManager operations
├─ Optional: delete feature
└─ Display results
```

### Core Layer

**Responsibility:** Business logic and Git operations

```
config-manager.ts
├─ initialize()
│  ├─ Discover projects in FE/ and BE/
│  ├─ Create default config
│  └─ Save to .multi-repo-config.json
│
├─ loadConfig() / saveConfig()
│  └─ JSON file operations
│
├─ Feature CRUD
│  ├─ addFeature()
│  ├─ updateFeature()
│  ├─ deleteFeature()
│  └─ getFeature()
│
└─ Project operations
   ├─ getProjectPath()
   ├─ updateProjectStatus()
   └─ getAvailableProjects()

worktree-manager.ts
├─ createWorktree()
│  ├─ Check if worktree exists
│  ├─ Create feature branch
│  └─ git worktree add
│
├─ removeWorktree()
│  └─ git worktree remove
│
├─ mergeFeatureBranch()
│  ├─ git checkout main
│  └─ git merge feature/XXX
│
├─ deleteFeatureBranch()
│  └─ git branch -d feature/XXX
│
└─ Utility methods
   ├─ listWorktrees()
   ├─ getWorktreeStatus()
   └─ isClean()

conflict-detector.ts
├─ detectConflicts()
│  ├─ Compare project lists
│  └─ Find overlapping projects
│
├─ createExecutionPlan()
│  ├─ Build dependency graph
│  ├─ Topological sort
│  └─ Group into batches
│
└─ Utility methods
   ├─ doFeaturesConflict()
   └─ getConflictingProjects()
```

## Algorithms

### Conflict Detection Algorithm

```typescript
function detectConflicts(features: Feature[]): ConflictInfo[] {
  conflicts = []
  
  for each pair (feature1, feature2) in features:
    projects1 = Set(feature1.projects)
    projects2 = Set(feature2.projects)
    
    overlapping = projects1 ∩ projects2
    
    if overlapping.length > 0:
      conflicts.push({
        feature1: feature1.id,
        feature2: feature2.id,
        conflictingProjects: overlapping
      })
  
  return conflicts
}
```

### Smart Sequencing Algorithm (Topological Sort)

```typescript
function createExecutionPlan(features: Feature[]): ExecutionPlan {
  // Step 1: Build dependency graph
  graph = Map<featureId, Set<dependentFeatureIds>>
  inDegree = Map<featureId, count>
  
  for each conflict in detectConflicts(features):
    // feature2 depends on feature1
    graph[feature1].add(feature2)
    inDegree[feature2]++
  
  // Step 2: Topological sort using Kahn's algorithm
  batches = []
  remaining = Set(all feature IDs)
  
  while remaining.size > 0:
    // Find all features with no dependencies
    currentBatch = []
    for each featureId in remaining:
      if inDegree[featureId] == 0:
        currentBatch.push(featureId)
    
    batches.push(currentBatch)
    
    // Remove current batch and update dependencies
    for each featureId in currentBatch:
      remaining.remove(featureId)
      
      for each dependent in graph[featureId]:
        inDegree[dependent]--
  
  return { sequential: batches, conflicts }
}
```

**Example:**
```
Features:
  FEAT-001: [Kirby, Tycho, Coloris]
  FEAT-002: [Tycho, Hermes]
  FEAT-003: [Monika]

Conflicts:
  FEAT-001 ↔ FEAT-002 (Tycho overlaps)

Dependency Graph:
  FEAT-001 → FEAT-002
  FEAT-003 → (none)

In-Degree:
  FEAT-001: 0
  FEAT-002: 1
  FEAT-003: 0

Execution Plan:
  Batch 1: [FEAT-001, FEAT-003]  ← Can work in parallel
  Batch 2: [FEAT-002]             ← Must wait for FEAT-001
```

## Configuration Schema

### .multi-repo-config.json

```json
{
  "workspaceRoot": "/path/to/workspace",
  "features": [
    {
      "id": "FEAT-001",
      "name": "Integrate Payment Provider",
      "projects": [
        {
          "name": "Coloris",
          "status": "completed",
          "branch": "feature/FEAT-001",
          "worktreePath": "/workspace/BE/Coloris-FEAT-001",
          "lastUpdated": "2026-01-29T10:00:00.000Z"
        }
      ],
      "createdAt": "2026-01-29T09:00:00.000Z",
      "updatedAt": "2026-01-29T10:00:00.000Z"
    }
  ],
  "projectLocations": {
    "Kirby": "FE/Kirby",
    "Tycho": "FE/Tycho",
    "Coloris": "BE/Coloris",
    "Hermes": "BE/Hermes",
    "Monika": "BE/Monika"
  }
}
```

## Git Worktree Structure

### Before Feature Creation

```
/workspace
├── FE/
│   ├── Kirby/
│   │   └── .git/
│   └── Tycho/
│       └── .git/
└── BE/
    ├── Coloris/
    │   └── .git/
    └── Hermes/
        └── .git/
```

### After Creating FEAT-001

```
/workspace
├── FE/
│   ├── Kirby/              (main branch)
│   │   └── .git/
│   ├── Kirby-FEAT-001/     (worktree: feature/FEAT-001)
│   ├── Tycho/              (main branch)
│   │   └── .git/
│   └── Tycho-FEAT-001/     (worktree: feature/FEAT-001)
└── BE/
    ├── Coloris/            (main branch)
    │   └── .git/
    ├── Coloris-FEAT-001/   (worktree: feature/FEAT-001)
    ├── Hermes/             (main branch)
    │   └── .git/
    └── Hermes-FEAT-001/    (worktree: feature/FEAT-001)
```

### Git Internals

```
Coloris/.git/
├── worktrees/
│   └── Coloris-FEAT-001/   ← Worktree metadata
│       ├── HEAD
│       └── gitdir
└── refs/
    └── heads/
        ├── main
        └── feature/
            └── FEAT-001    ← Feature branch
```

## Error Handling

### Graceful Failures

```typescript
try {
  worktreeManager.createWorktree(featureId, projectName);
} catch (error) {
  console.error(`Failed to create worktree for ${projectName}`);
  // Continue with other projects
}
```

### Validation

```typescript
// Before creating worktree
if (worktreeExists(path)) {
  console.log("Worktree already exists");
  return existingPath;
}

// Before completing feature
if (projectsNotCompleted.length > 0) {
  prompt("Some projects not completed. Continue?");
}
```

## Performance Considerations

### Optimization Strategies

1. **Parallel Worktree Creation**
   - Could use Promise.all() for independent projects
   - Currently sequential for error visibility

2. **Caching**
   - Config loaded once per command
   - Git operations cached where possible

3. **Lazy Loading**
   - Only load git status when needed
   - Don't check all repos unless required

## Security Considerations

1. **Git Operations**
   - Uses simple-git library (well-maintained)
   - No shell injection risks
   - Validates paths before operations

2. **Configuration**
   - Stored in workspace root
   - User-controlled location
   - No sensitive data stored

3. **File System**
   - Only operates within workspace
   - Validates project paths
   - No deletion without confirmation

## Extension Points

### Future Enhancements

1. **Plugin System**
```typescript
interface Plugin {
  onFeatureCreate?(feature: Feature): void;
  onFeatureComplete?(feature: Feature): void;
  onStatusCheck?(features: Feature[]): void;
}
```

2. **Custom Hooks**
```typescript
// .multi-repo-hooks.js
module.exports = {
  beforeCreate: async (feature) => { },
  afterCreate: async (feature) => { },
  beforeComplete: async (feature) => { },
  afterComplete: async (feature) => { }
};
```

3. **Remote Operations**
```typescript
// Push all worktrees to remote
multi-repo push FEAT-001

// Create PRs for all projects
multi-repo pr create FEAT-001
```

## Design Decisions

### Why Worktrees?

**Advantages:**
- Isolated work environments
- No branch switching
- Parallel development
- Independent testing

**Alternatives considered:**
- Branch switching: Too tedious
- Separate clones: Wastes disk space
- Submodules: Too complex

### Why Topological Sort?

**Advantages:**
- Optimal execution order
- Identifies parallelizable work
- Prevents deadlocks

**Alternatives considered:**
- Simple sequential: Inefficient
- Manual ordering: Error-prone
- No ordering: Merge conflicts

### Why CLI?

**Advantages:**
- Fast to use
- Scriptable
- Works with AI assistants
- No UI dependencies

**Alternatives considered:**
- Web UI: Slower development
- IDE plugin: Platform-specific
- Git aliases: Less powerful

## Testing Strategy

### Manual Testing Checklist

- [ ] Initialize fresh workspace
- [ ] Create feature with multiple projects
- [ ] Check status shows correct progress
- [ ] Create conflicting feature
- [ ] Verify conflict detection
- [ ] Complete feature with different cleanup options
- [ ] Update project status manually
- [ ] Handle missing configuration
- [ ] Handle non-existent projects

### Automated Testing (Future)

```typescript
describe('WorktreeManager', () => {
  it('should create worktree for feature');
  it('should remove worktree');
  it('should merge feature branch');
});

describe('ConflictDetector', () => {
  it('should detect conflicts between features');
  it('should create correct execution plan');
});

describe('ConfigManager', () => {
  it('should initialize configuration');
  it('should add feature');
  it('should update project status');
});
```

## Summary

The architecture is **modular, extensible, and production-ready**:

- **Clear separation of concerns** (Commands, Core, Utils)
- **Well-defined data models** (Feature, ProjectStatus, Config)
- **Robust algorithms** (Conflict detection, Topological sort)
- **Error handling** at all levels
- **Extension points** for future enhancements

The tool is ready to handle your exact use case and can grow with your needs!
