/**
 * Intervention service for managing interventions and tracking progress
 */

import { Intervention, InterventionProgress, InterventionFilters, Session } from '../domain/intervention';
import { InterventionRepository, InterventionProgressRepository } from '../repositories/intervention.repository';

/**
 * Intervention service interface
 */
export interface InterventionService {
  /**
   * Search interventions with optional filters
   * @param filters - Filter options
   * @returns Promise resolving to array of interventions
   */
  searchInterventions(filters?: InterventionFilters): Promise<Intervention[]>;

  /**
   * Get an intervention by its ID
   * @param id - Intervention ID
   * @returns Promise resolving to intervention or null
   */
  getInterventionById(id: string): Promise<Intervention | null>;

  /**
   * Track progress for a user on an intervention
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @param session - Session data
   * @returns Promise resolving when progress is tracked
   */
  trackProgress(userId: string, interventionId: string, session: Session): Promise<void>;

  /**
   * Get progress for a user on a specific intervention
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving to progress record or null
   */
  getProgress(userId: string, interventionId: string): Promise<InterventionProgress | null>;

  /**
   * Get efficacy rating for an intervention
   * @param interventionId - Intervention ID
   * @returns Promise resolving to efficacy rating (0-10)
   */
  getEfficacyRating(interventionId: string): Promise<number>;

  /**
   * Start an intervention for a user
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving to progress record
   */
  startIntervention(userId: string, interventionId: string): Promise<InterventionProgress>;

  /**
   * Pause an intervention for a user
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving when intervention is paused
   */
  pauseIntervention(userId: string, interventionId: string): Promise<void>;

  /**
   * Complete an intervention for a user
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving when intervention is completed
   */
  completeIntervention(userId: string, interventionId: string): Promise<void>;

  /**
   * Get all active interventions for a user
   * @param userId - User ID
   * @returns Promise resolving to array of active progress records
   */
  getActiveInterventions(userId: string): Promise<InterventionProgress[]>;
}

/**
 * Implementation of intervention service
 */
export class InterventionServiceImpl implements InterventionService {
  constructor(
    private interventionRepository: InterventionRepository,
    private progressRepository: InterventionProgressRepository
  ) {}

  /**
   * Search interventions with optional filters
   * @param filters - Filter options
   * @returns Promise resolving to array of interventions
   */
  async searchInterventions(filters?: InterventionFilters): Promise<Intervention[]> {
    let interventions: Intervention[];

    if (filters?.searchTerm) {
      interventions = await this.interventionRepository.search(filters.searchTerm);
    } else {
      interventions = await this.interventionRepository.findAll();
    }

    // Apply additional filters
    if (filters) {
      interventions = this.applyFilters(interventions, filters);
    }

    return interventions;
  }

  /**
   * Get an intervention by its ID
   * @param id - Intervention ID
   * @returns Promise resolving to intervention or null
   */
  async getInterventionById(id: string): Promise<Intervention | null> {
    return await this.interventionRepository.findById(id);
  }

  /**
   * Track progress for a user on an intervention
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @param session - Session data
   * @returns Promise resolving when progress is tracked
   */
  async trackProgress(userId: string, interventionId: string, session: Session): Promise<void> {
    let progress = await this.progressRepository.findByUserAndIntervention(userId, interventionId);

    if (!progress) {
      // Create new progress record
      progress = await this.startIntervention(userId, interventionId);
    }

    // Update progress with session data
    progress.sessionsCompleted += 1;
    progress.totalDuration += session.duration;
    progress.lastSessionDate = session.date;

    // Add automatic note if session has notes
    if (session.notes) {
      progress.notes.push({
        date: new Date(),
        content: session.notes,
        type: 'manual'
      });
    }

    // Calculate progress score based on sessions completed
    // This is a simplified calculation - real implementation would be more sophisticated
    const intervention = await this.interventionRepository.findById(interventionId);
    if (intervention) {
      const recommendedSessions = this.calculateRecommendedSessions(intervention);
      progress.progressScore = Math.min(
        (progress.sessionsCompleted / recommendedSessions) * 100,
        100
      );
    }

    await this.progressRepository.update(progress.id, progress);
  }

  /**
   * Get progress for a user on a specific intervention
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving to progress record or null
   */
  async getProgress(userId: string, interventionId: string): Promise<InterventionProgress | null> {
    return await this.progressRepository.findByUserAndIntervention(userId, interventionId);
  }

  /**
   * Get efficacy rating for an intervention
   * @param interventionId - Intervention ID
   * @returns Promise resolving to efficacy rating (0-10)
   */
  async getEfficacyRating(interventionId: string): Promise<number> {
    const intervention = await this.interventionRepository.findById(interventionId);
    return intervention?.efficacyRating ?? 0;
  }

  /**
   * Start an intervention for a user
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving to progress record
   */
  async startIntervention(userId: string, interventionId: string): Promise<InterventionProgress> {
    const progress: InterventionProgress = {
      id: this.generateId(),
      userId,
      interventionId,
      startDate: new Date(),
      lastSessionDate: new Date(),
      sessionsCompleted: 0,
      totalDuration: 0,
      progressScore: 0,
      notes: [],
      status: 'active'
    };

    return await this.progressRepository.create(progress);
  }

  /**
   * Pause an intervention for a user
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving when intervention is paused
   */
  async pauseIntervention(userId: string, interventionId: string): Promise<void> {
    const progress = await this.progressRepository.findByUserAndIntervention(userId, interventionId);
    if (progress) {
      await this.progressRepository.update(progress.id, { status: 'paused' });
    }
  }

  /**
   * Complete an intervention for a user
   * @param userId - User ID
   * @param interventionId - Intervention ID
   * @returns Promise resolving when intervention is completed
   */
  async completeIntervention(userId: string, interventionId: string): Promise<void> {
    const progress = await this.progressRepository.findByUserAndIntervention(userId, interventionId);
    if (progress) {
      await this.progressRepository.update(progress.id, {
        status: 'completed',
        progressScore: 100
      });
    }
  }

  /**
   * Get all active interventions for a user
   * @param userId - User ID
   * @returns Promise resolving to array of active progress records
   */
  async getActiveInterventions(userId: string): Promise<InterventionProgress[]> {
    return await this.progressRepository.findActiveByUserId(userId);
  }

  /**
   * Apply filters to interventions
   * @param interventions - Array of interventions to filter
   * @param filters - Filter options
   * @returns Filtered array of interventions
   */
  private applyFilters(interventions: Intervention[], filters: InterventionFilters): Intervention[] {
    return interventions.filter(intervention => {
      // Filter by category
      if (filters.category && intervention.category !== filters.category) {
        return false;
      }

      // Filter by target deficit
      if (filters.targetDeficit && !intervention.targetDeficit.includes(filters.targetDeficit)) {
        return false;
      }

      // Filter by age range
      if (filters.minAge !== undefined && intervention.ageRange[1] < filters.minAge) {
        return false;
      }
      if (filters.maxAge !== undefined && intervention.ageRange[0] > filters.maxAge) {
        return false;
      }

      // Filter by minimum efficacy
      if (filters.minEfficacy !== undefined && intervention.efficacyRating < filters.minEfficacy) {
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate recommended number of sessions for an intervention
   * @param intervention - Intervention definition
   * @returns Recommended number of sessions
   */
  private calculateRecommendedSessions(intervention: Intervention): number {
    // This is a simplified calculation
    // Real implementation would use research-based recommendations
    const guide = intervention.guide;
    const frequency = this.parseFrequency(guide.frequency);

    // Assume 8-week program as default
    return 8 * frequency;
  }

  /**
   * Parse frequency string to sessions per week
   * @param frequency - Frequency string (e.g., '3x per week')
   * @returns Sessions per week
   */
  private parseFrequency(frequency: string): number {
    const match = frequency.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 3; // Default to 3x per week
  }

  /**
   * Generate a unique ID
   * @returns Unique ID string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
