/**
 * Domain models for screening results and assessments
 */

/**
 * Screening scores across different cognitive domains
 * All scores are normalized to 0-100 scale
 */
export interface ScreeningScores {
  /** Phonological awareness score (0-100) */
  phonological: number;
  /** Rapid automatized naming score (0-100) */
  rapidNaming: number;
  /** Visual processing score (0-100) */
  visual: number;
  /** Working memory score (0-100) */
  workingMemory: number;
  /** Overall composite score (0-100) */
  overall: number;
}

/**
 * Severity level for dyslexia screening results
 */
export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe';

/**
 * Complete screening result for a user
 */
export interface ScreeningResult {
  /** Unique identifier for the screening result */
  id: string;
  /** User ID who completed the screening */
  userId: string;
  /** Date when screening was completed */
  date: Date;
  /** User age at time of screening */
  age: number;
  /** Screening version identifier */
  version: string;
  /** Scores across cognitive domains */
  scores: ScreeningScores;
  /** Calculated severity level */
  severity: SeverityLevel;
  /** Recommended intervention IDs based on results */
  recommendations: string[];
}

/**
 * Screening request data
 */
export interface ScreeningRequest {
  /** User ID for the screening */
  userId: string;
  /** User age */
  age: number;
  /** User language (ISO 639-1 code) */
  language: string;
  /** Screening version to use */
  version: string;
}
