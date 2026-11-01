/**
 * Repository interface for research claims and sources
 */

import { Repository } from './base.repository';
import { Claim, Source } from '../domain/research';

/**
 * Repository for managing research claims
 */
export interface ClaimRepository extends Repository<Claim> {
  /**
   * Find claims by research phase
   * @param phase - Research phase (1-7)
   * @returns Promise resolving to array of claims
   */
  findByPhase(phase: number): Promise<Claim[]>;

  /**
   * Find claims by topic
   * @param topic - Topic to filter by
   * @returns Promise resolving to array of claims
   */
  findByTopic(topic: string): Promise<Claim[]>;

  /**
   * Find claims by source ID
   * @param sourceId - Source ID to filter by
   * @returns Promise resolving to array of claims
   */
  findBySourceId(sourceId: string): Promise<Claim[]>;

  /**
   * Find claims by minimum confidence level
   * @param minConfidence - Minimum confidence (0-1)
   * @returns Promise resolving to array of claims
   */
  findByMinConfidence(minConfidence: number): Promise<Claim[]>;

  /**
   * Search claims by text content
   * @param searchTerm - Search term
   * @returns Promise resolving to array of matching claims
   */
  search(searchTerm: string): Promise<Claim[]>;

  /**
   * Find claims related to a specific claim
   * @param claimId - Claim ID to find related claims for
   * @returns Promise resolving to array of related claims
   */
  findRelated(claimId: string): Promise<Claim[]>;

  /**
   * Find claims that contradict a specific claim
   * @param claimId - Claim ID to find contradictions for
   * @returns Promise resolving to array of contradictory claims
   */
  findContradictions(claimId: string): Promise<Claim[]>;

  /**
   * Find claims updated after a specific date
   * @param date - Date to filter by
   * @returns Promise resolving to array of claims
   */
  findByUpdatedAfter(date: Date): Promise<Claim[]>;
}

/**
 * Repository for managing research sources
 */
export interface SourceRepository extends Repository<Source> {
  /**
   * Find sources by publication year
   * @param year - Year to filter by
   * @returns Promise resolving to array of sources
   */
  findByYear(year: number): Promise<Source[]>;

  /**
   * Find sources by DOI
   * @param doi - DOI to search for
   * @returns Promise resolving to source or null
   */
  findByDoi(doi: string): Promise<Source | null>;

  /**
   * Find sources by PubMed ID
   * @param pmid - PubMed ID to search for
   * @returns Promise resolving to source or null
   */
  findByPmid(pmid: string): Promise<Source | null>;

  /**
   * Find sources by arXiv ID
   * @param arxivId - arXiv ID to search for
   * @returns Promise resolving to source or null
   */
  findByArxivId(arxivId: string): Promise<Source | null>;

  /**
   * Find sources by author name
   * @param author - Author name to search for
   * @returns Promise resolving to array of sources
   */
  findByAuthor(author: string): Promise<Source[]>;

  /**
   * Find sources by journal name
   * @param journal - Journal name to filter by
   * @returns Promise resolving to array of sources
   */
  findByJournal(journal: string): Promise<Source[]>;

  /**
   * Search sources by title or abstract
   * @param searchTerm - Search term
   * @returns Promise resolving to array of matching sources
   */
  search(searchTerm: string): Promise<Source[]>;
}
