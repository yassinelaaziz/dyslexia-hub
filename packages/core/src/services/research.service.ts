/**
 * Research service for accessing research claims and sources
 */

import { Claim, Source, ClaimFilters } from '../domain/research';
import { ClaimRepository, SourceRepository } from '../repositories/claim.repository';

/**
 * Research service interface
 */
export interface ResearchService {
  /**
   * Search claims with optional filters
   * @param query - Search query
   * @param filters - Optional filter options
   * @returns Promise resolving to array of claims
   */
  searchClaims(query: string, filters?: ClaimFilters): Promise<Claim[]>;

  /**
   * Get a claim by its ID
   * @param id - Claim ID
   * @returns Promise resolving to claim or null
   */
  getClaimById(id: string): Promise<Claim | null>;

  /**
   * Get claims by topic
   * @param topic - Topic to filter by
   * @returns Promise resolving to array of claims
   */
  getClaimsByTopic(topic: string): Promise<Claim[]>;

  /**
   * Get claims by research phase
   * @param phase - Research phase (1-7)
   * @returns Promise resolving to array of claims
   */
  getClaimsByPhase(phase: number): Promise<Claim[]>;

  /**
   * Get contradictory claims for a specific claim
   * @param claimId - Claim ID
   * @returns Promise resolving to array of contradictory claims
   */
  getContradictoryClaims(claimId: string): Promise<Claim[]>;

  /**
   * Get related claims for a specific claim
   * @param claimId - Claim ID
   * @returns Promise resolving to array of related claims
   */
  getRelatedClaims(claimId: string): Promise<Claim[]>;

  /**
   * Get a source by its ID
   * @param id - Source ID
   * @returns Promise resolving to source or null
   */
  getSourceById(id: string): Promise<Source | null>;

  /**
   * Get claims by source ID
   * @param sourceId - Source ID
   * @returns Promise resolving to array of claims
   */
  getClaimsBySource(sourceId: string): Promise<Claim[]>;

  /**
   * Get all available topics
   * @returns Promise resolving to array of topic names
   */
  getTopics(): Promise<string[]>;

  /**
   * Get claims updated after a specific date
   * @param date - Date to filter by
   * @returns Promise resolving to array of claims
   */
  getClaimsUpdatedAfter(date: Date): Promise<Claim[]>;
}

/**
 * Implementation of research service
 */
export class ResearchServiceImpl implements ResearchService {
  constructor(
    private claimRepository: ClaimRepository,
    private sourceRepository: SourceRepository
  ) {}

  /**
   * Search claims with optional filters
   * @param query - Search query
   * @param filters - Optional filter options
   * @returns Promise resolving to array of claims
   */
  async searchClaims(query: string, filters?: ClaimFilters): Promise<Claim[]> {
    let claims = await this.claimRepository.search(query);

    // Apply additional filters
    if (filters) {
      claims = this.applyFilters(claims, filters);
    }

    return claims;
  }

  /**
   * Get a claim by its ID
   * @param id - Claim ID
   * @returns Promise resolving to claim or null
   */
  async getClaimById(id: string): Promise<Claim | null> {
    return await this.claimRepository.findById(id);
  }

  /**
   * Get claims by topic
   * @param topic - Topic to filter by
   * @returns Promise resolving to array of claims
   */
  async getClaimsByTopic(topic: string): Promise<Claim[]> {
    return await this.claimRepository.findByTopic(topic);
  }

  /**
   * Get claims by research phase
   * @param phase - Research phase (1-7)
   * @returns Promise resolving to array of claims
   */
  async getClaimsByPhase(phase: number): Promise<Claim[]> {
    if (phase < 1 || phase > 7) {
      throw new Error('Phase must be between 1 and 7');
    }
    return await this.claimRepository.findByPhase(phase);
  }

  /**
   * Get contradictory claims for a specific claim
   * @param claimId - Claim ID
   * @returns Promise resolving to array of contradictory claims
   */
  async getContradictoryClaims(claimId: string): Promise<Claim[]> {
    return await this.claimRepository.findContradictions(claimId);
  }

  /**
   * Get related claims for a specific claim
   * @param claimId - Claim ID
   * @returns Promise resolving to array of related claims
   */
  async getRelatedClaims(claimId: string): Promise<Claim[]> {
    return await this.claimRepository.findRelated(claimId);
  }

  /**
   * Get a source by its ID
   * @param id - Source ID
   * @returns Promise resolving to source or null
   */
  async getSourceById(id: string): Promise<Source | null> {
    return await this.sourceRepository.findById(id);
  }

  /**
   * Get claims by source ID
   * @param sourceId - Source ID
   * @returns Promise resolving to array of claims
   */
  async getClaimsBySource(sourceId: string): Promise<Claim[]> {
    return await this.claimRepository.findBySourceId(sourceId);
  }

  /**
   * Get all available topics
   * @returns Promise resolving to array of topic names
   */
  async getTopics(): Promise<string[]> {
    // Get all claims and extract unique topics
    const allClaims = await this.claimRepository.findAll();
    const topicSet = new Set<string>();

    allClaims.forEach(claim => {
      claim.topics.forEach(topic => topicSet.add(topic));
    });

    return Array.from(topicSet).sort();
  }

  /**
   * Get claims updated after a specific date
   * @param date - Date to filter by
   * @returns Promise resolving to array of claims
   */
  async getClaimsUpdatedAfter(date: Date): Promise<Claim[]> {
    return await this.claimRepository.findByUpdatedAfter(date);
  }

  /**
   * Apply filters to claims
   * @param claims - Array of claims to filter
   * @param filters - Filter options
   * @returns Filtered array of claims
   */
  private applyFilters(claims: Claim[], filters: ClaimFilters): Claim[] {
    return claims.filter(claim => {
      // Filter by phase
      if (filters.phase !== undefined && claim.phase !== filters.phase) {
        return false;
      }

      // Filter by topic
      if (filters.topic && !claim.topics.includes(filters.topic)) {
        return false;
      }

      // Filter by minimum confidence
      if (filters.minConfidence !== undefined && claim.confidence < filters.minConfidence) {
        return false;
      }

      // Filter by source ID
      if (filters.sourceId && claim.sourceId !== filters.sourceId) {
        return false;
      }

      return true;
    });
  }
}
