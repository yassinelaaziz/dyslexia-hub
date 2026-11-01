/**
 * Domain models for training progress and sessions
 */

/**
 * Training module categories
 */
export type TrainingModuleCategory = 'phonological' | 'RAN' | 'cognitive' | 'reading';

/**
 * Training difficulty levels
 */
export type TrainingDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Training session status
 */
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

/**
 * Individual training record for a single session
 */
export interface TrainingRecord {
  /** Unique identifier for the training record */
  id: string;
  /** User ID who completed the training */
  userId: string;
  /** Training module ID */
  trainingModule: string;
  /** Level within the module (1-3) */
  level: number;
  /** Score achieved (0-100) */
  score: number;
  /** Whether the session was completed */
  completed: boolean;
  /** Time spent in seconds */
  timeSpent: number;
  /** Date when training was completed */
  date: Date;
  /** Additional performance metrics */
  metrics?: Record<string, number>;
}

/**
 * Overall training progress for a user
 */
export interface UserTrainingProgress {
  /** User ID */
  userId: string;
  /** Overall progress percentage (0-100) */
  overallProgress: number;
  /** Current training streak (consecutive days) */
  streak: number;
  /** Date of last training session */
  lastTrainingDate: Date | null;
  /** Total training sessions completed */
  totalSessions: number;
  /** Total time spent in training (seconds) */
  totalTimeSpent: number;
  /** Average score across all sessions */
  averageScore: number;
  /** Unlocked achievement IDs */
  achievements: string[];
  /** Recommended training module IDs */
  recommendedModules: string[];
  /** Progress per training module */
  moduleProgress: ModuleProgress[];
}

/**
 * Progress for a specific training module
 */
export interface ModuleProgress {
  /** Training module ID */
  moduleId: string;
  /** Current level achieved (1-3) */
  currentLevel: number;
  /** Highest level completed (1-3) */
  highestLevel: number;
  /** Total sessions completed for this module */
  sessionsCompleted: number;
  /** Best score achieved */
  bestScore: number;
  /** Total time spent on this module (seconds) */
  totalTimeSpent: number;
  /** Completion percentage (0-100) */
  completionPercentage: number;
  /** Whether all levels are completed */
  isComplete: boolean;
}

/**
 * Training session request
 */
export interface TrainingSessionRequest {
  /** User ID */
  userId: string;
  /** Training module ID */
  trainingModule: string;
  /** Level to start at */
  level: number;
}

/**
 * Training session result
 */
export interface TrainingSessionResult {
  /** Training record ID */
  id: string;
  /** User ID */
  userId: string;
  /** Training module ID */
  trainingModule: string;
  /** Level completed */
  level: number;
  /** Score achieved */
  score: number;
  /** Time spent in seconds */
  timeSpent: number;
  /** Date completed */
  date: Date;
  /** Whether session was completed */
  completed: boolean;
  /** Performance metrics */
  metrics?: Record<string, number>;
  /** Achievements unlocked in this session */
  achievementsUnlocked: string[];
}

/**
 * Training plan generated from assessment
 */
export interface TrainingPlan {
  /** User ID */
  userId: string;
  /** Assessment result ID used to generate plan */
  assessmentId: string;
  /** Date plan was created */
  createdDate: Date;
  /** Severity level */
  severity: 'severe' | 'moderate' | 'mild' | 'normal';
  /** Recommended training modules in priority order */
  recommendedModules: RecommendedModule[];
  /** Training program details */
  program: TrainingProgram;
  /** Estimated completion date */
  estimatedCompletionDate: Date;
}

/**
 * Recommended training module with priority
 */
export interface RecommendedModule {
  /** Training module ID */
  moduleId: string;
  /** Priority order (1 = highest) */
  priority: number;
  /** Reason for recommendation */
  reason: string;
  /** Target deficit being addressed */
  targetDeficit: string;
  /** Expected difficulty */
  difficulty: TrainingDifficulty;
}

/**
 * Training program configuration
 */
export interface TrainingProgram {
  /** Program name */
  name: string;
  /** Description */
  description: string;
  /** Sessions per week */
  sessionsPerWeek: number;
  /** Minutes per session */
  minutesPerSession: number;
  /** Duration in weeks */
  durationWeeks: number;
  /** Estimated total hours */
  estimatedTotalHours: number;
}

/**
 * Achievement definition
 */
export interface Achievement {
  /** Achievement ID */
  id: string;
  /** Achievement name */
  name: string;
  /** Description */
  description: string;
  /** Icon emoji */
  icon: string;
  /** Category */
  category: string;
  /** Points awarded */
  points: number;
  /** Rarity */
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  /** Whether it's unlocked */
  unlocked: boolean;
  /** Date unlocked (if applicable) */
  unlockedDate?: Date;
}

/**
 * Training statistics for analytics
 */
export interface TrainingStatistics {
  /** User ID */
  userId: string;
  /** Total sessions */
  totalSessions: number;
  /** Sessions in last 7 days */
  sessionsLast7Days: number;
  /** Sessions in last 30 days */
  sessionsLast30Days: number;
  /** Current streak */
  currentStreak: number;
  /** Longest streak */
  longestStreak: number;
  /** Total time spent (hours) */
  totalHours: number;
  /** Average score */
  averageScore: number;
  /** Best score */
  bestScore: number;
  /** Most trained module */
  mostTrainedModule: string;
  /** Improvement trend (positive = improving) */
  improvementTrend: number;
}
