/**
 * Repository interface for interventions and intervention progress
 */

import { Repository } from './base.repository';
import { Intervention, InterventionProgress, InterventionCategory, ProgressStatus } from '../domain/intervention';

/**
 * Repository for managing intervention definitions
 */
export interface InterventionRepository extends Repository<Intervention> {
  /**
   * Find interventions by category
   * @param category - Category to filter by
   * @returns Promise resolving to array of interventions
   */
  findByCategory(category: InterventionCategory): Promise<Intervention[]>;

  /**
   * Find interventions appropriate for a specific age
   * @param age - Age to filter by
   * @returns Promise resolving to array of interventions
   */
  findByAge(age: number): Promise<Intervention[]>;

  /**
   * Find interventions by minimum efficacy rating
   * @param minRating - Minimum efficacy rating (0-10)
   * @returns Promise resolving to array of interventions
   */
  findByMinEfficacy(minRating: number): Promise<Intervention[]>;

  /**
   * Find interventions targeting a specific deficit
   * @param deficit - Target deficit to filter by
   * @returns Promise resolving to array of interventions
   */
  findByTargetDeficit(deficit: string): Promise<Intervention[]>;

  /**
   * Search interventions by name or description
   * @param searchTerm - Search term
   * @returns Promise resolving to array of matching interventions
   */
  search(searchTerm: string): Promise<Intervention[]>;
}

/**
 * Repository for managing intervention progress tracking
 */
export interface InterventionProgressRepository extends Repository<InterventionProgress> {
  /**
   * Find all progress records for a specific user
   * @param userId - User ID to filter by
   * @returns Promise resolving to array of progress records
   */
  findByUserId(userId: string): Promise<InterventionProgress[]>;

  /**
   * Find progress record for a specific user and intervention
   * @param userId - User ID to filter by
   * @param interventionId - Intervention ID to filter by
   * @returns Promise resolving to progress record or null
   */
  findByUserAndIntervention(userId: string, interventionId: string): Promise<InterventionProgress | null>;

  /**
   * Find progress records by status
   * @param status - Status to filter by
   * @returns Promise resolving to array of progress records
   */
  findByStatus(status: ProgressStatus): Promise<InterventionProgress[]>;

  /**
   * Find active interventions for a user
   * @param userId - User ID to filter by
   * @returns Promise resolving to array of active progress records
   */
  findActiveByUserId(userId: string): Promise<InterventionProgress[]>;

  /**
   * Find recently updated progress records
   * @param userId - User ID to filter by
   * @param days - Number of days to look back
   * @returns Promise resolving to array of progress records
   */
  findRecentlyUpdated(userId: string, days: number): Promise<InterventionProgress[]>;
}
