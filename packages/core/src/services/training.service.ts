/**
 * Training service for managing training sessions and progress
 *
 * This service:
 * - Maps assessment results to training recommendations
 * - Tracks training progress over time
 * - Manages training sessions
 * - Calculates achievements and streaks
 *
 * IMPORTANT: This is NOT a clinical intervention. It provides
 * evidence-based training exercises based on screening results.
 */

import {
  TrainingRecord,
  UserTrainingProgress,
  ModuleProgress,
  TrainingSessionRequest,
  TrainingSessionResult,
  TrainingPlan,
  RecommendedModule,
  TrainingProgram,
  Achievement,
  TrainingStatistics
} from '../domain/training';
import { ScreeningResult, ScreeningScores } from '../domain/screening';
import { TrainingRepository } from '../repositories/training.repository';

/**
 * Training service interface
 */
export interface TrainingService {
  /**
   * Generate a training plan based on assessment results
   * @param assessment - Screening result
   * @returns Training plan with recommended modules
   */
  generateTrainingPlan(assessment: ScreeningResult): TrainingPlan;

  /**
   * Start a training session
   * @param request - Training session request
   * @returns Session ID
   */
  startSession(request: TrainingSessionRequest): string;

  /**
   * Complete a training session
   * @param result - Training session result
   * @returns Promise resolving when session is saved
   */
  completeSession(result: TrainingSessionResult): Promise<void>;

  /**
   * Get user training progress
   * @param userId - User ID
   * @returns User training progress
   */
  getUserProgress(userId: string): Promise<UserTrainingProgress>;

  /**
   * Get training history for a user
   * @param userId - User ID
   * @param limit - Optional limit on number of records
   * @returns Array of training records
   */
  getTrainingHistory(userId: string, limit?: number): Promise<TrainingRecord[]>;

  /**
   * Get training statistics for a user
   * @param userId - User ID
   * @returns Training statistics
   */
  getTrainingStatistics(userId: string): Promise<TrainingStatistics>;

  /**
   * Get achievements for a user
   * @param userId - User ID
   * @returns Array of achievements
   */
  getAchievements(userId: string): Promise<Achievement[]>;

  /**
   * Get recommended next training module
   * @param userId - User ID
   * @returns Recommended module ID or null
   */
  getRecommendedNextModule(userId: string): Promise<string | null>;

  /**
   * Reset training progress for a user
   * @param userId - User ID
   * @returns Promise resolving when reset is complete
   */
  resetProgress(userId: string): Promise<void>;
}

/**
 * Implementation of training service
 */
export class TrainingServiceImpl implements TrainingService {
  constructor(private trainingRepository: TrainingRepository) {}

  /**
   * Generate a training plan based on assessment results
   * @param assessment - Screening result
   * @returns Training plan with recommended modules
   */
  generateTrainingPlan(assessment: ScreeningResult): TrainingPlan {
    const scores = assessment.scores;
    const severity = assessment.severity;

    // Map domain scores to training modules
    const recommendedModules = this.mapScoresToModules(scores);

    // Determine training program based on severity
    const program = this.getProgramForSeverity(severity);

    // Calculate estimated completion date
    const estimatedCompletionDate = new Date();
    estimatedCompletionDate.setDate(
      estimatedCompletionDate.getDate() + (program.durationWeeks * 7)
    );

    return {
      userId: assessment.userId,
      assessmentId: assessment.id,
      createdDate: new Date(),
      severity: severity as 'mild' | 'moderate' | 'severe' | 'normal',
      recommendedModules,
      program,
      estimatedCompletionDate
    };
  }

  /**
   * Start a training session
   * @param _request - Training session request
   * @returns Session ID
   */
  startSession(_request: TrainingSessionRequest): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Complete a training session
   * @param result - Training session result
   * @returns Promise resolving when session is saved
   */
  async completeSession(result: TrainingSessionResult): Promise<void> {
    const record: TrainingRecord = {
      id: result.id,
      userId: result.userId,
      trainingModule: result.trainingModule,
      level: result.level,
      score: result.score,
      completed: result.completed,
      timeSpent: result.timeSpent,
      date: result.date,
      metrics: result.metrics
    };

    await this.trainingRepository.saveTrainingRecord(record);

    // Update user progress
    await this.updateUserProgress(result.userId);
  }

  /**
   * Get user training progress
   * @param userId - User ID
   * @returns User training progress
   */
  async getUserProgress(userId: string): Promise<UserTrainingProgress> {
    const history = await this.trainingRepository.getTrainingHistory(userId);
    const achievements = await this.trainingRepository.getAchievements(userId);

    // Calculate module progress
    const moduleProgress = this.calculateModuleProgress(history);

    // Calculate overall progress
    const overallProgress = this.calculateOverallProgress(moduleProgress);

    // Calculate streak
    const streak = this.calculateStreak(history);

    // Get last training date
    const lastTrainingDate = history.length > 0 ? history[0].date : null;

    // Calculate total time and average score
    const totalTimeSpent = history.reduce((sum, record) => sum + record.timeSpent, 0);
    const averageScore = history.length > 0
      ? history.reduce((sum, record) => sum + record.score, 0) / history.length
      : 0;

    // Get recommended modules based on progress
    const recommendedModules = this.getRecommendedModulesFromProgress(moduleProgress);

    return {
      userId,
      overallProgress,
      streak,
      lastTrainingDate,
      totalSessions: history.length,
      totalTimeSpent,
      averageScore,
      achievements: achievements.map(a => a.id),
      recommendedModules,
      moduleProgress
    };
  }

  /**
   * Get training history for a user
   * @param userId - User ID
   * @param limit - Optional limit on number of records
   * @returns Array of training records
   */
  async getTrainingHistory(userId: string, limit?: number): Promise<TrainingRecord[]> {
    return await this.trainingRepository.getTrainingHistory(userId, limit);
  }

  /**
   * Get training statistics for a user
   * @param userId - User ID
   * @returns Training statistics
   */
  async getTrainingStatistics(userId: string): Promise<TrainingStatistics> {
    const history = await this.trainingRepository.getTrainingHistory(userId);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sessionsLast7Days = history.filter(r => r.date >= sevenDaysAgo).length;
    const sessionsLast30Days = history.filter(r => r.date >= thirtyDaysAgo).length;
    const currentStreak = this.calculateStreak(history);
    const longestStreak = this.calculateLongestStreak(history);
    const totalHours = history.reduce((sum, r) => sum + r.timeSpent, 0) / 3600;
    const averageScore = history.length > 0
      ? history.reduce((sum, r) => sum + r.score, 0) / history.length
      : 0;
    const bestScore = history.length > 0
      ? Math.max(...history.map(r => r.score))
      : 0;

    // Find most trained module
    const moduleCounts: Record<string, number> = {};
    history.forEach(r => {
      moduleCounts[r.trainingModule] = (moduleCounts[r.trainingModule] || 0) + 1;
    });
    const mostTrainedModule = Object.entries(moduleCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    // Calculate improvement trend (compare recent vs older scores)
    const improvementTrend = this.calculateImprovementTrend(history);

    return {
      userId,
      totalSessions: history.length,
      sessionsLast7Days,
      sessionsLast30Days,
      currentStreak,
      longestStreak,
      totalHours,
      averageScore,
      bestScore,
      mostTrainedModule,
      improvementTrend
    };
  }

  /**
   * Get achievements for a user
   * @param userId - User ID
   * @returns Array of achievements
   */
  async getAchievements(userId: string): Promise<Achievement[]> {
    return await this.trainingRepository.getAchievements(userId);
  }

  /**
   * Get recommended next training module
   * @param userId - User ID
   * @returns Recommended module ID or null
   */
  async getRecommendedNextModule(userId: string): Promise<string | null> {
    const progress = await this.getUserProgress(userId);
    return progress.recommendedModules[0] || null;
  }

  /**
   * Reset training progress for a user
   * @param userId - User ID
   * @returns Promise resolving when reset is complete
   */
  async resetProgress(userId: string): Promise<void> {
    await this.trainingRepository.deleteUserTrainingRecords(userId);
    await this.trainingRepository.resetUserProgress(userId);
  }

  /**
   * Map assessment scores to training modules
   * @param scores - Screening scores
   * @returns Array of recommended modules
   */
  private mapScoresToModules(scores: ScreeningScores): RecommendedModule[] {
    const recommendations: RecommendedModule[] = [];
    let priority = 1;

    // Thresholds for severity (lower score = more severe deficit)
    const thresholds = {
      severe: 50,
      moderate: 70,
      mild: 85
    };

    // Phonological deficit
    if (scores.phonological < thresholds.mild) {
      recommendations.push({
        moduleId: 'phonological-training',
        priority: priority++,
        reason: scores.phonological < thresholds.severe
          ? 'Severe phonological deficit detected'
          : scores.phonological < thresholds.moderate
          ? 'Moderate phonological deficit detected'
          : 'Mild phonological deficit detected',
        targetDeficit: 'phonological',
        difficulty: scores.phonological < thresholds.severe ? 'beginner' : 'intermediate'
      });
    }

    // RAN deficit
    if (scores.rapidNaming < thresholds.mild) {
      recommendations.push({
        moduleId: 'ran-training',
        priority: priority++,
        reason: scores.rapidNaming < thresholds.severe
          ? 'Severe rapid naming deficit detected'
          : scores.rapidNaming < thresholds.moderate
          ? 'Moderate rapid naming deficit detected'
          : 'Mild rapid naming deficit detected',
        targetDeficit: 'rapidNaming',
        difficulty: scores.rapidNaming < thresholds.severe ? 'beginner' : 'intermediate'
      });
    }

    // Working memory deficit
    if (scores.workingMemory < thresholds.mild) {
      recommendations.push({
        moduleId: 'working-memory',
        priority: priority++,
        reason: scores.workingMemory < thresholds.severe
          ? 'Severe working memory deficit detected'
          : scores.workingMemory < thresholds.moderate
          ? 'Moderate working memory deficit detected'
          : 'Mild working memory deficit detected',
        targetDeficit: 'workingMemory',
        difficulty: scores.workingMemory < thresholds.severe ? 'beginner' : 'intermediate'
      });
    }

    // If no specific deficits, recommend fluency training for general improvement
    if (recommendations.length === 0) {
      recommendations.push({
        moduleId: 'fluency-training',
        priority: 1,
        reason: 'General reading fluency improvement',
        targetDeficit: 'general',
        difficulty: 'intermediate'
      });
    }

    // Sort by priority
    recommendations.sort((a, b) => a.priority - b.priority);

    return recommendations;
  }

  /**
   * Get training program based on severity
   * @param severity - Severity level
   * @returns Training program
   */
  private getProgramForSeverity(severity: string): TrainingProgram {
    switch (severity) {
      case 'severe':
        return {
          name: 'Intensive Training Program',
          description: 'Comprehensive training for severe deficits',
          sessionsPerWeek: 5,
          minutesPerSession: 30,
          durationWeeks: 12,
          estimatedTotalHours: 30
        };
      case 'moderate':
        return {
          name: 'Regular Training Program',
          description: 'Balanced training for moderate deficits',
          sessionsPerWeek: 4,
          minutesPerSession: 25,
          durationWeeks: 10,
          estimatedTotalHours: 25
        };
      case 'mild':
        return {
          name: 'Light Training Program',
          description: 'Focused training for mild deficits',
          sessionsPerWeek: 3,
          minutesPerSession: 20,
          durationWeeks: 8,
          estimatedTotalHours: 15
        };
      default:
        return {
          name: 'Maintenance Program',
          description: 'Optional training to maintain skills',
          sessionsPerWeek: 2,
          minutesPerSession: 15,
          durationWeeks: 4,
          estimatedTotalHours: 8
        };
    }
  }

  /**
   * Calculate module progress from training history
   * @param history - Training history
   * @returns Array of module progress
   */
  private calculateModuleProgress(history: TrainingRecord[]): ModuleProgress[] {
    const moduleMap: Record<string, ModuleProgress> = {};

    history.forEach(record => {
      if (!moduleMap[record.trainingModule]) {
        moduleMap[record.trainingModule] = {
          moduleId: record.trainingModule,
          currentLevel: record.level,
          highestLevel: record.level,
          sessionsCompleted: 0,
          bestScore: record.score,
          totalTimeSpent: 0,
          completionPercentage: 0,
          isComplete: false
        };
      }

      const progress = moduleMap[record.trainingModule];
      progress.sessionsCompleted++;
      progress.totalTimeSpent += record.timeSpent;
      progress.bestScore = Math.max(progress.bestScore, record.score);
      progress.highestLevel = Math.max(progress.highestLevel, record.level);

      // Calculate completion percentage (3 levels total)
      progress.completionPercentage = (progress.highestLevel / 3) * 100;
      progress.isComplete = progress.highestLevel >= 3;
    });

    return Object.values(moduleMap);
  }

  /**
   * Calculate overall progress from module progress
   * @param moduleProgress - Array of module progress
   * @returns Overall progress percentage
   */
  private calculateOverallProgress(moduleProgress: ModuleProgress[]): number {
    if (moduleProgress.length === 0) return 0;
    const total = moduleProgress.reduce((sum, m) => sum + m.completionPercentage, 0);
    return total / moduleProgress.length;
  }

  /**
   * Calculate training streak
   * @param history - Training history
   * @returns Current streak in days
   */
  private calculateStreak(history: TrainingRecord[]): number {
    if (history.length === 0) return 0;

    const sortedHistory = [...history].sort((a, b) => b.date.getTime() - a.date.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = today;

    for (const record of sortedHistory) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0 || daysDiff === 1) {
        streak++;
        currentDate = recordDate;
      } else if (daysDiff > 1) {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate longest streak
   * @param history - Training history
   * @returns Longest streak in days
   */
  private calculateLongestStreak(history: TrainingRecord[]): number {
    if (history.length === 0) return 0;

    const sortedHistory = [...history].sort((a, b) => a.date.getTime() - b.date.getTime());
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const record of sortedHistory) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);

      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor((recordDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          currentStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, currentStreak);
      lastDate = recordDate;
    }

    return longestStreak;
  }

  /**
   * Calculate improvement trend
   * @param history - Training history
   * @returns Improvement trend (positive = improving)
   */
  private calculateImprovementTrend(history: TrainingRecord[]): number {
    if (history.length < 2) return 0;

    const sortedHistory = [...history].sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstHalf = sortedHistory.slice(0, Math.floor(sortedHistory.length / 2));
    const secondHalf = sortedHistory.slice(Math.floor(sortedHistory.length / 2));

    const firstAvg = firstHalf.reduce((sum, r) => sum + r.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.score, 0) / secondHalf.length;

    return secondAvg - firstAvg;
  }

  /**
   * Get recommended modules from progress
   * @param moduleProgress - Array of module progress
   * @returns Array of recommended module IDs
   */
  private getRecommendedModulesFromProgress(moduleProgress: ModuleProgress[]): string[] {
    // Prioritize incomplete modules
    const incomplete = moduleProgress
      .filter(m => !m.isComplete)
      .sort((a, b) => a.completionPercentage - b.completionPercentage);

    if (incomplete.length > 0) {
      return incomplete.map(m => m.moduleId);
    }

    // If all complete, recommend maintenance
    return ['fluency-training'];
  }

  /**
   * Update user progress after a session
   * @param userId - User ID
   */
  private async updateUserProgress(userId: string): Promise<void> {
    const progress = await this.getUserProgress(userId);
    await this.trainingRepository.saveUserProgress(progress);
  }
}
