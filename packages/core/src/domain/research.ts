/**
 * Domain models for research claims and sources
 */

/**
 * Research source (paper, article, etc.)
 */
export interface Source {
  /** Unique identifier for the source */
  id: string;
  /** Title of the source */
  title: string;
  /** List of authors */
  authors: string[];
  /** Publication year */
  year: number;
  /** Digital Object Identifier (if available) */
  doi: string | null;
  /** PubMed ID (if available) */
  pmid: string | null;
  /** arXiv ID (if available) */
  arxivId: string | null;
  /** Journal name (if applicable) */
  journal: string | null;
  /** Volume number (if applicable) */
  volume: string | null;
  /** Issue number (if applicable) */
  issue: string | null;
  /** Page numbers (if applicable) */
  pages: string | null;
  /** Abstract text (if available) */
  abstract: string | null;
  /** Timestamp when source was last updated */
  lastUpdated: Date;
}

/**
 * Research claim extracted from literature
 */
export interface Claim {
  /** Unique identifier for the claim */
  id: string;
  /** Text content of the claim */
  text: string;
  /** Source ID from which claim was extracted */
  sourceId: string;
  /** Confidence score (0-1) based on evidence quality */
  confidence: number;
  /** Research phase (1-7) from which claim originated */
  phase: number;
  /** Topics associated with this claim */
  topics: string[];
  /** IDs of related claims */
  relatedClaims: string[];
  /** IDs of contradictory claims */
  contradictoryClaims: string[];
  /** Timestamp when claim was last updated */
  lastUpdated: Date;
}

/**
 * Filters for searching claims
 */
export interface ClaimFilters {
  /** Filter by research phase */
  phase?: number;
  /** Filter by topic */
  topic?: string;
  /** Filter by minimum confidence */
  minConfidence?: number;
  /** Filter by source ID */
  sourceId?: string;
  /** Include contradictory claims */
  includeContradictions?: boolean;
}
