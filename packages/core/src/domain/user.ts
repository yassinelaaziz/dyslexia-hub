/**
 * Domain models for user profiles and preferences
 */

/**
 * User preferences for accessibility and personalization
 */
export interface UserPreferences {
  /** Theme option for visual customization */
  theme: 'default' | 'dyslexia' | 'high-contrast';
  /** Font size for readability */
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  /** Font family selection */
  fontFamily: 'default' | 'opendyslexic';
  /** Line spacing multiplier (1.0 - 2.0) */
  lineSpacing: number;
  /** Letter spacing in pixels (0 - 5) */
  letterSpacing: number;
  /** Enable sound effects in the application */
  enableSoundEffects: boolean;
  /** Enable animations in the application */
  enableAnimations: boolean;
  /** Enable offline mode for local-only operation */
  enableOfflineMode: boolean;
  /** Enable cloud synchronization (opt-in) */
  enableCloudSync: boolean;
}

/**
 * User profile containing demographic and preference information
 */
export interface UserProfile {
  /** Unique identifier for the user */
  id: string;
  /** User age in years */
  age: number;
  /** User language (ISO 639-1 code, e.g., 'en', 'es') */
  language: string;
  /** Timestamp when profile was created */
  createdAt: Date;
  /** Timestamp when profile was last updated */
  updatedAt: Date;
  /** User preferences for accessibility and personalization */
  preferences: UserPreferences;
}

/**
 * Validation result for user profile data
 */
export interface ValidationResult {
  /** Whether the data is valid */
  valid: boolean;
  /** Array of validation error messages */
  errors: string[];
}
