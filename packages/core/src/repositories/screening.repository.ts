/**
 * Repository interface for screening results
 */

import { Repository } from './base.repository';
import { ScreeningResult, SeverityLevel } from '../domain/screening';

/**
 * Repository for managing screening results
 */
export interface ScreeningResultRepository extends Repository<ScreeningResult> {
  /**
   * Find all screening results for a specific user
   * @param userId - User ID to filter by
   * @returns Promise resolving to array of screening results
   */
  findByUserId(userId: string): Promise<ScreeningResult[]>;

  /**
   * Find screening results for a user within a date range
   * @param userId - User ID to filter by
   * @param startDate - Start of date range
   * @param endDate - End of date range
   * @returns Promise resolving to array of screening results
   */
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<ScreeningResult[]>;

  /**
   * Find screening results by severity level
   * @param severity - Severity level to filter by
   * @returns Promise resolving to array of screening results
   */
  findBySeverity(severity: SeverityLevel): Promise<ScreeningResult[]>;

  /**
   * Find the most recent screening result for a user
   * @param userId - User ID to filter by
   * @returns Promise resolving to the most recent screening result or null
   */
  findMostRecentByUserId(userId: string): Promise<ScreeningResult | null>;

  /**
   * Get screening history for a user, sorted by date (most recent first)
   * @param userId - User ID to filter by
   * @param limit - Maximum number of results to return
   * @returns Promise resolving to array of screening results
   */
  getHistory(userId: string, limit?: number): Promise<ScreeningResult[]>;
}
