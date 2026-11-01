/**
 * In-memory implementation of InterventionRepository that loads from JSON data
 *
 * This implementation is suitable for client-side applications where the intervention
 * data is bundled with the application as a JSON file.
 */

import {
  Intervention,
  InterventionProgress,
  InterventionCategory,
  ProgressStatus,
} from '../domain/intervention';
import {
  InterventionRepository,
  InterventionProgressRepository,
} from './intervention.repository';

/**
 * Intervention data structure from JSON file
 */
interface InterventionData {
  id: string;
  name: string;
  category: InterventionCategory;
  targetDeficit: string[];
  ageRange: [number, number];
  efficacyRating: number;
  evidenceCount: number;
  evidenceTier: 'established' | 'emerging' | 'experimental';
  description: string;
  guide: {
    steps: Array<{
      step: number;
      title: string;
      description: string;
      duration: number;
    }>;
    duration: number;
    frequency: string;
    materials: string[];
    warnings: string[];
  };
  sources: Array<{
    title: string;
    authors: string;
    year: number;
    journal: string;
    doi?: string;
    confidence: number;
    evidenceQuality: string;
  }>;
  lastUpdated: string;
}

/**
 * In-memory intervention repository implementation
 */
export class InMemoryInterventionRepository implements InterventionRepository {
  private interventions: Map<string, Intervention> = new Map();
  private initialized = false;

  /**
   * Initialize the repository with intervention data
   * @param data - Intervention data from JSON file
   */
  async initialize(data: { interventions: InterventionData[] }): Promise<void> {
    if (this.initialized) {
      return;
    }

    for (const item of data.interventions) {
      const intervention: Intervention = {
        id: item.id,
        name: item.name,
        category: item.category,
        targetDeficit: item.targetDeficit,
        ageRange: item.ageRange,
        efficacyRating: item.efficacyRating,
        evidenceCount: item.evidenceCount,
        evidenceTier: item.evidenceTier,
        description: item.description,
        guide: {
          steps: item.guide.steps,
          duration: item.guide.duration,
          frequency: item.guide.frequency,
          materials: item.guide.materials,
          warnings: item.guide.warnings,
        },
        lastUpdated: new Date(item.lastUpdated),
      };
      this.interventions.set(intervention.id, intervention);
    }

    this.initialized = true;
  }

  /**
   * Get all interventions
   */
  async findAll(): Promise<Intervention[]> {
    this.ensureInitialized();
    return Array.from(this.interventions.values());
  }

  /**
   * Find intervention by ID
   */
  async findById(id: string): Promise<Intervention | null> {
    this.ensureInitialized();
    return this.interventions.get(id) || null;
  }

  /**
   * Create intervention (not supported in this implementation)
   */
  async create(_entity: Intervention): Promise<Intervention> {
    throw new Error('Create operation not supported in in-memory repository');
  }

  /**
   * Update intervention (not supported in this implementation)
   */
  async update(_id: string, _entity: Partial<Intervention>): Promise<Intervention> {
    throw new Error('Update operation not supported in in-memory repository');
  }

  /**
   * Delete intervention (not supported in this implementation)
   */
  async delete(_id: string): Promise<void> {
    throw new Error('Delete operation not supported in in-memory repository');
  }

  /**
   * Sync intervention data (not supported in this implementation)
   */
  async sync(): Promise<{ success: boolean; recordsSynced: number; conflicts: number; error?: string; timestamp: Date }> {
    throw new Error('Sync operation not supported in in-memory repository');
  }

  /**
   * Count interventions
   */
  async count(): Promise<number> {
    this.ensureInitialized();
    return this.interventions.size;
  }

  /**
   * Find interventions by category
   */
  async findByCategory(category: InterventionCategory): Promise<Intervention[]> {
    this.ensureInitialized();
    return Array.from(this.interventions.values()).filter(
      (intervention) => intervention.category === category
    );
  }

  /**
   * Find interventions appropriate for a specific age
   */
  async findByAge(age: number): Promise<Intervention[]> {
    this.ensureInitialized();
    return Array.from(this.interventions.values()).filter(
      (intervention) => age >= intervention.ageRange[0] && age <= intervention.ageRange[1]
    );
  }

  /**
   * Find interventions by minimum efficacy rating
   */
  async findByMinEfficacy(minRating: number): Promise<Intervention[]> {
    this.ensureInitialized();
    return Array.from(this.interventions.values()).filter(
      (intervention) => intervention.efficacyRating >= minRating
    );
  }

  /**
   * Find interventions targeting a specific deficit
   */
  async findByTargetDeficit(deficit: string): Promise<Intervention[]> {
    this.ensureInitialized();
    return Array.from(this.interventions.values()).filter((intervention) =>
      intervention.targetDeficit.some((d) => d.toLowerCase().includes(deficit.toLowerCase()))
    );
  }

  /**
   * Search interventions by name or description
   */
  async search(searchTerm: string): Promise<Intervention[]> {
    this.ensureInitialized();
    const term = searchTerm.toLowerCase();
    return Array.from(this.interventions.values()).filter(
      (intervention) =>
        intervention.name.toLowerCase().includes(term) ||
        intervention.description.toLowerCase().includes(term) ||
        intervention.targetDeficit.some((d) => d.toLowerCase().includes(term))
    );
  }

  /**
   * Ensure repository is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Repository not initialized. Call initialize() first.');
    }
  }
}

/**
 * In-memory intervention progress repository implementation
 */
export class InMemoryInterventionProgressRepository implements InterventionProgressRepository {
  private progress: Map<string, InterventionProgress> = new Map();

  /**
   * Get all progress records
   */
  async findAll(): Promise<InterventionProgress[]> {
    return Array.from(this.progress.values());
  }

  /**
   * Find progress record by ID
   */
  async findById(id: string): Promise<InterventionProgress | null> {
    return this.progress.get(id) || null;
  }

  /**
   * Create progress record
   */
  async create(entity: InterventionProgress): Promise<InterventionProgress> {
    this.progress.set(entity.id, entity);
    return entity;
  }

  /**
   * Update progress record
   */
  async update(id: string, entity: Partial<InterventionProgress>): Promise<InterventionProgress> {
    const existing = this.progress.get(id);
    if (!existing) {
      throw new Error(`Progress record with id ${id} not found`);
    }
    const updated = { ...existing, ...entity };
    this.progress.set(id, updated);
    return updated;
  }

  /**
   * Delete progress record
   */
  async delete(id: string): Promise<void> {
    this.progress.delete(id);
  }

  /**
   * Find all progress records for a specific user
   */
  async findByUserId(userId: string): Promise<InterventionProgress[]> {
    return Array.from(this.progress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  /**
   * Find progress record for a specific user and intervention
   */
  async findByUserAndIntervention(
    userId: string,
    interventionId: string
  ): Promise<InterventionProgress | null> {
    return (
      Array.from(this.progress.values()).find(
        (progress) => progress.userId === userId && progress.interventionId === interventionId
      ) || null
    );
  }

  /**
   * Find progress records by status
   */
  async findByStatus(status: ProgressStatus): Promise<InterventionProgress[]> {
    return Array.from(this.progress.values()).filter((progress) => progress.status === status);
  }

  /**
   * Find active interventions for a user
   */
  async findActiveByUserId(userId: string): Promise<InterventionProgress[]> {
    return Array.from(this.progress.values()).filter(
      (progress) => progress.userId === userId && progress.status === 'active'
    );
  }

  /**
   * Find recently updated progress records
   */
  async findRecentlyUpdated(userId: string, days: number): Promise<InterventionProgress[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return Array.from(this.progress.values())
      .filter((progress) => progress.userId === userId)
      .filter((progress) => progress.lastSessionDate >= cutoffDate);
  }

  /**
   * Sync progress data (not supported in this implementation)
   */
  async sync(): Promise<{ success: boolean; recordsSynced: number; conflicts: number; error?: string; timestamp: Date }> {
    throw new Error('Sync operation not supported in in-memory repository');
  }

  /**
   * Count progress records
   */
  async count(): Promise<number> {
    return this.progress.size;
  }
}
