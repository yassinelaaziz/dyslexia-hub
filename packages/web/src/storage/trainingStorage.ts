/**
 * Training Storage for Training Records and Progress
 *
 * Extends the existing IndexedDB storage to handle training-specific data
 * Uses the same database with additional object stores
 */

import {
  TrainingRecord,
  UserTrainingProgress,
  Achievement
} from '@dyslexia-hub/core';

const DB_NAME = 'DyslexiaHubDB';
const DB_VERSION = 2; // Must match indexedDB.ts
const TRAINING_RECORDS_STORE = 'trainingRecords';
const USER_PROGRESS_STORE = 'userProgress';
const ACHIEVEMENTS_STORE = 'achievements';

interface StoredTrainingRecord {
  id: string;
  userId: string;
  trainingModule: string;
  level: number;
  score: number;
  completed: boolean;
  timeSpent: number;
  date: string; // ISO string
  metrics?: Record<string, number>;
}

interface StoredUserProgress {
  userId: string;
  overallProgress: number;
  streak: number;
  lastTrainingDate: string | null;
  totalSessions: number;
  totalTimeSpent: number;
  averageScore: number;
  achievements: string[];
  recommendedModules: string[];
  moduleProgress: any[];
}

interface StoredAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  rarity: string;
  unlocked: boolean;
  unlockedDate?: string;
}

/**
 * Training Storage Manager
 */
export class TrainingStorage {
  private db: IDBDatabase | null = null;
  private initialized = false;

  /**
   * Initialize the IndexedDB database with training stores
   */
  async initialize(): Promise<void> {
    if (this.initialized && this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Training stores are created in indexedDB.ts
        // This handler is kept for compatibility but stores are already created
      };
    });
  }

  /**
   * Save a training record
   */
  async saveTrainingRecord(record: TrainingRecord): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stored: StoredTrainingRecord = {
      id: record.id,
      userId: record.userId,
      trainingModule: record.trainingModule,
      level: record.level,
      score: record.score,
      completed: record.completed,
      timeSpent: record.timeSpent,
      date: record.date.toISOString(),
      metrics: record.metrics
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TRAINING_RECORDS_STORE], 'readwrite');
      const store = transaction.objectStore(TRAINING_RECORDS_STORE);
      const request = store.put(stored);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get training history for a user
   */
  async getTrainingHistory(userId: string, limit?: number): Promise<TrainingRecord[]> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TRAINING_RECORDS_STORE], 'readonly');
      const store = transaction.objectStore(TRAINING_RECORDS_STORE);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const stored = request.result;
        const records = stored.map((s: StoredTrainingRecord) => this.convertStoredToRecord(s));
        // Sort by date descending (most recent first)
        records.sort((a, b) => b.date.getTime() - a.date.getTime());
        resolve(limit ? records.slice(0, limit) : records);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get training record by ID
   */
  async getTrainingRecord(id: string): Promise<TrainingRecord | null> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TRAINING_RECORDS_STORE], 'readonly');
      const store = transaction.objectStore(TRAINING_RECORDS_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const stored = request.result;
        resolve(stored ? this.convertStoredToRecord(stored) : null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a training record
   */
  async deleteTrainingRecord(id: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TRAINING_RECORDS_STORE], 'readwrite');
      const store = transaction.objectStore(TRAINING_RECORDS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete all training records for a user
   */
  async deleteUserTrainingRecords(userId: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TRAINING_RECORDS_STORE], 'readwrite');
      const store = transaction.objectStore(TRAINING_RECORDS_STORE);
      const index = store.index('userId');
      const request = index.openCursor(IDBKeyRange.only(userId));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save user training progress
   */
  async saveUserProgress(progress: UserTrainingProgress): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const stored: StoredUserProgress = {
      userId: progress.userId,
      overallProgress: progress.overallProgress,
      streak: progress.streak,
      lastTrainingDate: progress.lastTrainingDate?.toISOString() || null,
      totalSessions: progress.totalSessions,
      totalTimeSpent: progress.totalTimeSpent,
      averageScore: progress.averageScore,
      achievements: progress.achievements,
      recommendedModules: progress.recommendedModules,
      moduleProgress: progress.moduleProgress
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USER_PROGRESS_STORE], 'readwrite');
      const store = transaction.objectStore(USER_PROGRESS_STORE);
      const request = store.put(stored);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get user training progress
   */
  async getUserProgress(userId: string): Promise<UserTrainingProgress | null> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USER_PROGRESS_STORE], 'readonly');
      const store = transaction.objectStore(USER_PROGRESS_STORE);
      const request = store.get(userId);

      request.onsuccess = () => {
        const stored = request.result;
        if (stored) {
          resolve(this.convertStoredToProgress(stored));
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Reset user training progress
   */
  async resetUserProgress(userId: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USER_PROGRESS_STORE], 'readwrite');
      const store = transaction.objectStore(USER_PROGRESS_STORE);
      const request = store.delete(userId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get achievements for a user
   */
  async getAchievements(userId: string): Promise<Achievement[]> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ACHIEVEMENTS_STORE], 'readonly');
      const store = transaction.objectStore(ACHIEVEMENTS_STORE);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const stored = request.result;
        const achievements = stored.map((s: StoredAchievement) => this.convertStoredToAchievement(s));
        resolve(achievements);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Unlock an achievement for a user
   */
  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Load achievement definitions from data file
    const achievementDefs = await this.loadAchievementDefinitions();
    const def = achievementDefs[achievementId];

    if (!def) {
      throw new Error(`Achievement ${achievementId} not found`);
    }

    const stored: StoredAchievement = {
      id: achievementId,
      name: def.name,
      description: def.description,
      icon: def.icon,
      category: def.category,
      points: def.points,
      rarity: def.rarity,
      unlocked: true,
      unlockedDate: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ACHIEVEMENTS_STORE], 'readwrite');
      const store = transaction.objectStore(ACHIEVEMENTS_STORE);
      const request = store.put(stored);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Load achievement definitions from data file
   */
  private async loadAchievementDefinitions(): Promise<Record<string, any>> {
    try {
      const response = await fetch('/data/training-achievements.json');
      const data = await response.json();
      return data.achievements;
    } catch (error) {
      console.error('Failed to load achievement definitions:', error);
      return {};
    }
  }

  /**
   * Convert stored record to TrainingRecord
   */
  private convertStoredToRecord(stored: StoredTrainingRecord): TrainingRecord {
    return {
      id: stored.id,
      userId: stored.userId,
      trainingModule: stored.trainingModule,
      level: stored.level,
      score: stored.score,
      completed: stored.completed,
      timeSpent: stored.timeSpent,
      date: new Date(stored.date),
      metrics: stored.metrics
    };
  }

  /**
   * Convert stored progress to UserTrainingProgress
   */
  private convertStoredToProgress(stored: StoredUserProgress): UserTrainingProgress {
    return {
      userId: stored.userId,
      overallProgress: stored.overallProgress,
      streak: stored.streak,
      lastTrainingDate: stored.lastTrainingDate ? new Date(stored.lastTrainingDate) : null,
      totalSessions: stored.totalSessions,
      totalTimeSpent: stored.totalTimeSpent,
      averageScore: stored.averageScore,
      achievements: stored.achievements,
      recommendedModules: stored.recommendedModules,
      moduleProgress: stored.moduleProgress
    };
  }

  /**
   * Convert stored achievement to Achievement
   */
  private convertStoredToAchievement(stored: StoredAchievement): Achievement {
    return {
      id: stored.id,
      name: stored.name,
      description: stored.description,
      icon: stored.icon,
      category: stored.category,
      points: stored.points,
      rarity: stored.rarity as any,
      unlocked: stored.unlocked,
      unlockedDate: stored.unlockedDate ? new Date(stored.unlockedDate) : undefined
    };
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}

// Singleton instance
let trainingStorageInstance: TrainingStorage | null = null;

/**
 * Get the singleton training storage instance
 */
export function getTrainingStorage(): TrainingStorage {
  if (!trainingStorageInstance) {
    trainingStorageInstance = new TrainingStorage();
  }
  return trainingStorageInstance;
}
