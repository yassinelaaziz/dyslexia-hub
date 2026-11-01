/**
 * Training repository interface
 *
 * Defines the contract for training data persistence
 */

import {
  TrainingRecord,
  UserTrainingProgress,
  Achievement
} from '../domain/training';

/**
 * Training repository interface
 */
export interface TrainingRepository {
  /**
   * Save a training record
   * @param record - Training record to save
   * @returns Promise resolving when save is complete
   */
  saveTrainingRecord(record: TrainingRecord): Promise<void>;

  /**
   * Get training history for a user
   * @param userId - User ID
   * @param limit - Optional limit on number of records
   * @returns Array of training records
   */
  getTrainingHistory(userId: string, limit?: number): Promise<TrainingRecord[]>;

  /**
   * Get training record by ID
   * @param id - Training record ID
   * @returns Training record or null
   */
  getTrainingRecord(id: string): Promise<TrainingRecord | null>;

  /**
   * Delete a training record
   * @param id - Training record ID
   * @returns Promise resolving when delete is complete
   */
  deleteTrainingRecord(id: string): Promise<void>;

  /**
   * Delete all training records for a user
   * @param userId - User ID
   * @returns Promise resolving when delete is complete
   */
  deleteUserTrainingRecords(userId: string): Promise<void>;

  /**
   * Save user training progress
   * @param progress - User training progress
   * @returns Promise resolving when save is complete
   */
  saveUserProgress(progress: UserTrainingProgress): Promise<void>;

  /**
   * Get user training progress
   * @param userId - User ID
   * @returns User training progress or null
   */
  getUserProgress(userId: string): Promise<UserTrainingProgress | null>;

  /**
   * Reset user training progress
   * @param userId - User ID
   * @returns Promise resolving when reset is complete
   */
  resetUserProgress(userId: string): Promise<void>;

  /**
   * Get achievements for a user
   * @param userId - User ID
   * @returns Array of achievements
   */
  getAchievements(userId: string): Promise<Achievement[]>;

  /**
   * Unlock an achievement for a user
   * @param userId - User ID
   * @param achievementId - Achievement ID
   * @returns Promise resolving when unlock is complete
   */
  unlockAchievement(userId: string, achievementId: string): Promise<void>;
}
