import { Feature, ConflictInfo, ExecutionPlan } from '../types';

export class ConflictDetector {
  /**
   * Detect conflicts between features
   */
  detectConflicts(features: Feature[]): ConflictInfo[] {
    const conflicts: ConflictInfo[] = [];

    // Check each pair of features
    for (let i = 0; i < features.length; i++) {
      for (let j = i + 1; j < features.length; j++) {
        const feature1 = features[i];
        const feature2 = features[j];

        // Get project names for each feature
        const projects1 = new Set(feature1.projects.map(p => p.name));
        const projects2 = new Set(feature2.projects.map(p => p.name));

        // Find overlapping projects
        const overlapping = Array.from(projects1).filter(p => projects2.has(p));

        if (overlapping.length > 0) {
          conflicts.push({
            feature1: feature1.id,
            feature2: feature2.id,
            conflictingProjects: overlapping
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Create execution plan with smart sequencing
   */
  createExecutionPlan(features: Feature[]): ExecutionPlan {
    const conflicts = this.detectConflicts(features);
    
    // Build dependency graph
    const graph = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();

    // Initialize
    for (const feature of features) {
      graph.set(feature.id, new Set());
      inDegree.set(feature.id, 0);
    }

    // Add edges for conflicts (if feature1 conflicts with feature2, feature2 depends on feature1)
    for (const conflict of conflicts) {
      const { feature1, feature2 } = conflict;
      
      // Create dependency: feature2 must wait for feature1
      graph.get(feature1)!.add(feature2);
      inDegree.set(feature2, (inDegree.get(feature2) || 0) + 1);
    }

    // Topological sort to create batches
    const batches: string[][] = [];
    const remaining = new Set(features.map(f => f.id));

    while (remaining.size > 0) {
      // Find all nodes with no dependencies (in-degree = 0)
      const currentBatch: string[] = [];
      
      for (const featureId of remaining) {
        if (inDegree.get(featureId) === 0) {
          currentBatch.push(featureId);
        }
      }

      if (currentBatch.length === 0) {
        // Circular dependency or error
        throw new Error('Circular dependency detected in features');
      }

      batches.push(currentBatch);

      // Remove current batch from graph
      for (const featureId of currentBatch) {
        remaining.delete(featureId);
        
        // Decrease in-degree for dependent features
        const dependents = graph.get(featureId) || new Set();
        for (const dependent of dependents) {
          inDegree.set(dependent, (inDegree.get(dependent) || 0) - 1);
        }
      }
    }

    return {
      sequential: batches,
      conflicts
    };
  }

  /**
   * Get features that can be worked on in parallel
   */
  getParallelizableFeatures(features: Feature[]): string[][] {
    const plan = this.createExecutionPlan(features);
    return plan.sequential;
  }

  /**
   * Check if two features conflict
   */
  doFeaturesConflict(feature1: Feature, feature2: Feature): boolean {
    const projects1 = new Set(feature1.projects.map(p => p.name));
    const projects2 = new Set(feature2.projects.map(p => p.name));

    for (const project of projects1) {
      if (projects2.has(project)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get conflicting projects between two features
   */
  getConflictingProjects(feature1: Feature, feature2: Feature): string[] {
    const projects1 = new Set(feature1.projects.map(p => p.name));
    const projects2 = new Set(feature2.projects.map(p => p.name));

    return Array.from(projects1).filter(p => projects2.has(p));
  }
}
