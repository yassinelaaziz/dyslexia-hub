/**
 * Domain models for interventions and intervention tracking
 */

/**
 * Categories of interventions
 */
export type InterventionCategory =
  | 'phonological'
  | 'RAN'
  | 'neurofeedback'
  | 'BCI'
  | 'multisensory'
  | 'environmental'
  | 'technological';

/**
 * Evidence tier classification based on research support
 */
export type EvidenceTier = 'established' | 'emerging' | 'experimental';

/**
 * Evidence tier configuration
 */
export interface EvidenceTierConfig {
  /** Tier label */
  label: string;
  /** Description of evidence quality */
  description: string;
  /** Color for visual indication */
  color: string;
  /** Background color */
  backgroundColor: string;
  /** Minimum number of supporting studies */
  minStudies: number;
  /** Required evidence quality */
  minQuality: 'High' | 'Moderate' | 'Low';
}

/**
 * Single step in an intervention guide
 */
export interface GuideStep {
  /** Step number in the sequence */
  step: number;
  /** Title of the step */
  title: string;
  /** Detailed description of the step */
  description: string;
  /** Expected duration in minutes */
  duration: number;
}

/**
 * Complete guide for conducting an intervention
 */
export interface InterventionGuide {
  /** Ordered list of steps to follow */
  steps: GuideStep[];
  /** Duration per session in minutes */
  duration: number;
  /** Recommended frequency (e.g., '3x per week') */
  frequency: string;
  /** List of required materials */
  materials: string[];
  /** Important warnings or contraindications */
  warnings: string[];
}

/**
 * Intervention definition
 */
export interface Intervention {
  /** Unique identifier for the intervention */
  id: string;
  /** Human-readable name */
  name: string;
  /** Category of intervention */
  category: InterventionCategory;
  /** Target cognitive deficits addressed */
  targetDeficit: string[];
  /** Age range [min, max] for which intervention is appropriate */
  ageRange: [number, number];
  /** Efficacy rating (0-10) based on research evidence */
  efficacyRating: number;
  /** Number of research claims supporting this intervention */
  evidenceCount: number;
  /** Evidence tier based on research quality and quantity */
  evidenceTier: EvidenceTier;
  /** Detailed description of the intervention */
  description: string;
  /** Step-by-step guide for implementation */
  guide: InterventionGuide;
  /** Timestamp when intervention was last updated */
  lastUpdated: Date;
}

/**
 * Type of progress note
 */
export type NoteType = 'manual' | 'automatic';

/**
 * Single progress note entry
 */
export interface ProgressNote {
  /** Date when note was created */
  date: Date;
  /** Content of the note */
  content: string;
  /** Whether note was manually entered or automatically generated */
  type: NoteType;
}

/**
 * Status of intervention progress
 */
export type ProgressStatus = 'active' | 'paused' | 'completed' | 'abandoned';

/**
 * Progress tracking for a user on a specific intervention
 */
export interface InterventionProgress {
  /** Unique identifier for the progress record */
  id: string;
  /** User ID tracking progress */
  userId: string;
  /** Intervention ID being tracked */
  interventionId: string;
  /** Date when intervention was started */
  startDate: Date;
  /** Date of the most recent session */
  lastSessionDate: Date;
  /** Number of sessions completed */
  sessionsCompleted: number;
  /** Total time spent in minutes */
  totalDuration: number;
  /** Overall progress score (0-100) */
  progressScore: number;
  /** Array of progress notes */
  notes: ProgressNote[];
  /** Current status of the intervention */
  status: ProgressStatus;
}

/**
 * Session data for tracking a single intervention session
 */
export interface Session {
  /** Session date */
  date: Date;
  /** Duration in minutes */
  duration: number;
  /** Activities completed in the session */
  activities: string[];
  /** Notes from the session */
  notes?: string;
  /** Performance metrics (optional) */
  metrics?: Record<string, number>;
}

/**
 * Filters for searching interventions
 */
export interface InterventionFilters {
  /** Filter by category */
  category?: InterventionCategory;
  /** Filter by target deficit */
  targetDeficit?: string;
  /** Filter by minimum age */
  minAge?: number;
  /** Filter by maximum age */
  maxAge?: number;
  /** Filter by minimum efficacy rating */
  minEfficacy?: number;
  /** Filter by evidence tier */
  evidenceTier?: EvidenceTier;
  /** Search term for name or description */
  searchTerm?: string;
}

/**
 * Get evidence tier configuration
 * @param tier - Evidence tier
 * @returns Configuration object for the tier
 */
export function getEvidenceTierConfig(tier: EvidenceTier): EvidenceTierConfig {
  switch (tier) {
    case 'established':
      return {
        label: 'Established',
        description: 'Strong research evidence from multiple randomized controlled trials',
        color: '#10B981',
        backgroundColor: '#D1FAE5',
        minStudies: 10,
        minQuality: 'High',
      };
    case 'emerging':
      return {
        label: 'Emerging',
        description: 'Moderate evidence from promising but limited studies',
        color: '#F59E0B',
        backgroundColor: '#FEF3C7',
        minStudies: 3,
        minQuality: 'Moderate',
      };
    case 'experimental':
      return {
        label: 'Experimental',
        description: 'Theoretical or early-stage research with limited evidence',
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        minStudies: 0,
        minQuality: 'Low',
      };
    default:
      return {
        label: 'Unknown',
        description: 'Evidence tier not specified',
        color: '#9CA3AF',
        backgroundColor: '#E5E7EB',
        minStudies: 0,
        minQuality: 'Low',
      };
  }
}
