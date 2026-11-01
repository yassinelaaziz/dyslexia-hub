/**
 * User profile service for managing user profiles and preferences
 */

import { UserProfile, UserPreferences, ValidationResult } from '../domain/user';
import { UserRepository } from '../repositories/user.repository';
import { SyncResult } from '../repositories/base.repository';

/**
 * User profile service interface
 */
export interface UserProfileService {
  /**
   * Create a new user profile
   * @param profile - User profile data
   * @returns Promise resolving to created profile ID
   */
  createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;

  /**
   * Update an existing user profile
   * @param userId - User ID to update
   * @param updates - Partial updates to apply
   * @returns Promise resolving when update is complete
   */
  updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void>;

  /**
   * Get a user profile by ID
   * @param userId - User ID
   * @returns Promise resolving to user profile or null
   */
  getProfile(userId: string): Promise<UserProfile | null>;

  /**
   * Set user preferences
   * @param userId - User ID
   * @param preferences - New preferences to set
   * @returns Promise resolving when preferences are set
   */
  setPreferences(userId: string, preferences: UserPreferences): Promise<void>;

  /**
   * Update user preferences partially
   * @param userId - User ID
   * @param updates - Partial preference updates
   * @returns Promise resolving when preferences are updated
   */
  updatePreferences(userId: string, updates: Partial<UserPreferences>): Promise<void>;

  /**
   * Sync user profile with cloud storage
   * @param userId - User ID
   * @returns Promise resolving to sync result
   */
  syncProfile(userId: string): Promise<SyncResult>;

  /**
   * Validate user profile data
   * @param profile - Profile data to validate
   * @returns Validation result
   */
  validateProfile(profile: Partial<UserProfile>): ValidationResult;

  /**
   * Delete a user profile
   * @param userId - User ID to delete
   * @returns Promise resolving when deletion is complete
   */
  deleteProfile(userId: string): Promise<void>;
}

/**
 * Implementation of user profile service
 */
export class UserProfileServiceImpl implements UserProfileService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Create a new user profile
   * @param profile - User profile data
   * @returns Promise resolving to created profile ID
   */
  async createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Validate profile data
    const validation = this.validateProfile(profile);
    if (!validation.valid) {
      throw new Error(`Invalid profile data: ${validation.errors.join(', ')}`);
    }

    const now = new Date();
    const newProfile: UserProfile = {
      ...profile,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    const created = await this.userRepository.create(newProfile);
    return created.id;
  }

  /**
   * Update an existing user profile
   * @param userId - User ID to update
   * @param updates - Partial updates to apply
   * @returns Promise resolving when update is complete
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    // Validate updates
    const validation = this.validateProfile(updates);
    if (!validation.valid) {
      throw new Error(`Invalid profile data: ${validation.errors.join(', ')}`);
    }

    // Add updated timestamp
    updates.updatedAt = new Date();

    await this.userRepository.update(userId, updates);
  }

  /**
   * Get a user profile by ID
   * @param userId - User ID
   * @returns Promise resolving to user profile or null
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    return await this.userRepository.findById(userId);
  }

  /**
   * Set user preferences
   * @param userId - User ID
   * @param preferences - New preferences to set
   * @returns Promise resolving when preferences are set
   */
  async setPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    await this.userRepository.updatePreferences(userId, preferences);
  }

  /**
   * Update user preferences partially
   * @param userId - User ID
   * @param updates - Partial preference updates
   * @returns Promise resolving when preferences are updated
   */
  async updatePreferences(userId: string, updates: Partial<UserPreferences>): Promise<void> {
    await this.userRepository.updatePreferences(userId, updates);
  }

  /**
   * Sync user profile with cloud storage
   * @param userId - User ID
   * @returns Promise resolving to sync result
   */
  async syncProfile(userId: string): Promise<SyncResult> {
    try {
      // Check if cloud sync is enabled for this user
      const profile = await this.getProfile(userId);
      if (!profile) {
        return {
          success: false,
          recordsSynced: 0,
          conflicts: 0,
          error: 'User profile not found',
          timestamp: new Date()
        };
      }

      if (!profile.preferences.enableCloudSync) {
        return {
          success: false,
          recordsSynced: 0,
          conflicts: 0,
          error: 'Cloud sync is disabled for this user',
          timestamp: new Date()
        };
      }

      // Perform sync operation
      const syncResult = await this.userRepository.sync();

      return {
        success: syncResult.success,
        recordsSynced: syncResult.recordsSynced,
        conflicts: syncResult.conflicts,
        error: syncResult.error,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        recordsSynced: 0,
        conflicts: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  /**
   * Validate user profile data
   * @param profile - Profile data to validate
   * @returns Validation result
   */
  validateProfile(profile: Partial<UserProfile>): ValidationResult {
    const errors: string[] = [];

    // Validate age
    if (profile.age !== undefined) {
      if (typeof profile.age !== 'number' || profile.age < 0 || profile.age > 120) {
        errors.push('Age must be a number between 0 and 120');
      }
    }

    // Validate language
    if (profile.language !== undefined) {
      if (typeof profile.language !== 'string' || profile.language.length !== 2) {
        errors.push('Language must be a valid ISO 639-1 code (2 letters)');
      }
    }

    // Validate preferences
    if (profile.preferences) {
      const prefErrors = this.validatePreferences(profile.preferences);
      errors.push(...prefErrors);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user preferences
   * @param preferences - Preferences to validate
   * @returns Array of error messages
   */
  private validatePreferences(preferences: UserPreferences): string[] {
    const errors: string[] = [];

    // Validate theme
    const validThemes = ['default', 'dyslexia', 'high-contrast'];
    if (!validThemes.includes(preferences.theme)) {
      errors.push(`Theme must be one of: ${validThemes.join(', ')}`);
    }

    // Validate fontSize
    const validFontSizes = ['small', 'medium', 'large', 'extra-large'];
    if (!validFontSizes.includes(preferences.fontSize)) {
      errors.push(`Font size must be one of: ${validFontSizes.join(', ')}`);
    }

    // Validate fontFamily
    const validFontFamilies = ['default', 'opendyslexic'];
    if (!validFontFamilies.includes(preferences.fontFamily)) {
      errors.push(`Font family must be one of: ${validFontFamilies.join(', ')}`);
    }

    // Validate lineSpacing
    if (typeof preferences.lineSpacing !== 'number' || preferences.lineSpacing < 1.0 || preferences.lineSpacing > 2.0) {
      errors.push('Line spacing must be a number between 1.0 and 2.0');
    }

    // Validate letterSpacing
    if (typeof preferences.letterSpacing !== 'number' || preferences.letterSpacing < 0 || preferences.letterSpacing > 5) {
      errors.push('Letter spacing must be a number between 0 and 5');
    }

    // Validate boolean fields
    if (typeof preferences.enableSoundEffects !== 'boolean') {
      errors.push('enableSoundEffects must be a boolean');
    }
    if (typeof preferences.enableAnimations !== 'boolean') {
      errors.push('enableAnimations must be a boolean');
    }
    if (typeof preferences.enableOfflineMode !== 'boolean') {
      errors.push('enableOfflineMode must be a boolean');
    }
    if (typeof preferences.enableCloudSync !== 'boolean') {
      errors.push('enableCloudSync must be a boolean');
    }

    return errors;
  }

  /**
   * Delete a user profile
   * @param userId - User ID to delete
   * @returns Promise resolving when deletion is complete
   */
  async deleteProfile(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }

  /**
   * Generate a unique ID
   * @returns Unique ID string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
