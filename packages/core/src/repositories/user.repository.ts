/**
 * Repository interface for user profiles
 */

import { Repository } from './base.repository';
import { UserProfile } from '../domain/user';

/**
 * Repository for managing user profiles
 */
export interface UserRepository extends Repository<UserProfile> {
  /**
   * Find a user by their language preference
   * @param language - ISO 639-1 language code
   * @returns Promise resolving to array of users with that language
   */
  findByLanguage(language: string): Promise<UserProfile[]>;

  /**
   * Find users created after a specific date
   * @param date - Date to filter by
   * @returns Promise resolving to array of users
   */
  findByCreatedAfter(date: Date): Promise<UserProfile[]>;

  /**
   * Update user preferences
   * @param userId - User ID to update
   * @param preferences - New preferences to set
   * @returns Promise resolving to updated user profile
   */
  updatePreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<UserProfile>;
}
