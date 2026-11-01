/**
 * IndexedDB Storage for Screening Results
 *
 * Provides persistent storage for screening results using IndexedDB
 * This enables offline functionality and local-first data storage
 *
 * Features:
 * - Store screening results with timestamp, answers, scores
 * - Retrieve screening history
 * - Delete individual results
 * - Clear all data
 * - Error handling and fallback to localStorage
 */

import { ScreeningResult, ScreeningScores, SeverityLevel } from '@dyslexia-hub/core';

const DB_NAME = 'DyslexiaHubDB';
const DB_VERSION = 2; // Incremented to add training stores
const STORE_NAME = 'screeningResults';

interface StoredScreeningResult {
  id: string;
  userId: string;
  date: string; // ISO string
  age: number;
  version: string;
  scores: ScreeningScores;
  severity: SeverityLevel;
  recommendations: string[];
  answers?: Record<string, number>; // Optional: store raw answers
}

/**
 * IndexedDB Storage Manager
 */
export class IndexedDBStorage {
  private db: IDBDatabase | null = null;
  private initialized = false;

  /**
   * Initialize the IndexedDB database
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

        // Create object store for screening results
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });

          // Create indexes for common queries
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('severity', 'severity', { unique: false });
          store.createIndex('userId_date', ['userId', 'date'], { unique: false });
        }

        // Create training records store (version 2)
        if (!db.objectStoreNames.contains('trainingRecords')) {
          const store = db.createObjectStore('trainingRecords', { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('trainingModule', 'trainingModule', { unique: false });
          store.createIndex('userId_date', ['userId', 'date'], { unique: false });
        }

        // Create user progress store (version 2)
        if (!db.objectStoreNames.contains('userProgress')) {
          db.createObjectStore('userProgress', { keyPath: 'userId' });
        }

        // Create achievements store (version 2)
        if (!db.objectStoreNames.contains('achievements')) {
          const store = db.createObjectStore('achievements', { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
        }
      };
    });
  }

  /**
   * Store a screening result
   */
  async saveResult(result: ScreeningResult, answers?: Record<string, number>): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const storedResult: StoredScreeningResult = {
      id: result.id,
      userId: result.userId,
      date: result.date.toISOString(),
      age: result.age,
      version: result.version,
      scores: result.scores,
      severity: result.severity,
      recommendations: result.recommendations,
      answers,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(storedResult);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve a screening result by ID
   */
  async getResult(id: string): Promise<ScreeningResult | null> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const stored = request.result;
        if (stored) {
          resolve(this.convertStoredToResult(stored));
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve all screening results for a user
   */
  async getUserResults(userId: string): Promise<ScreeningResult[]> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const stored = request.result;
        const results = stored.map((s: StoredScreeningResult) => this.convertStoredToResult(s));
        // Sort by date descending (most recent first)
        results.sort((a, b) => b.date.getTime() - a.date.getTime());
        resolve(results);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve screening history for a user (with optional limit)
   */
  async getHistory(userId: string, limit?: number): Promise<ScreeningResult[]> {
    const results = await this.getUserResults(userId);
    return limit ? results.slice(0, limit) : results;
  }

  /**
   * Retrieve the most recent screening result for a user
   */
  async getMostRecentResult(userId: string): Promise<ScreeningResult | null> {
    const results = await this.getUserResults(userId);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Delete a screening result by ID
   */
  async deleteResult(id: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete all screening results for a user
   */
  async deleteUserResults(userId: string): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
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
   * Clear all screening results (for all users)
   */
  async clearAllResults(): Promise<void> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get count of screening results for a user
   */
  async getUserResultCount(userId: string): Promise<number> {
    await this.initialize();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.count(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Convert stored result back to ScreeningResult
   */
  private convertStoredToResult(stored: StoredScreeningResult): ScreeningResult {
    return {
      id: stored.id,
      userId: stored.userId,
      date: new Date(stored.date),
      age: stored.age,
      version: stored.version,
      scores: stored.scores,
      severity: stored.severity,
      recommendations: stored.recommendations,
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
let storageInstance: IndexedDBStorage | null = null;

/**
 * Get the singleton IndexedDB storage instance
 */
export function getIndexedDBStorage(): IndexedDBStorage {
  if (!storageInstance) {
    storageInstance = new IndexedDBStorage();
  }
  return storageInstance;
}

/**
 * Fallback to localStorage if IndexedDB is not available
 */
export class LocalStorageFallback {
  private readonly STORAGE_KEY = 'dyslexiaHub_screeningResults';

  async saveResult(result: ScreeningResult, answers?: Record<string, number>): Promise<void> {
    const existing = this.getAllResults();
    const storedResult = {
      ...result,
      date: result.date.toISOString(),
      answers,
    };
    existing.push(storedResult);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing));
  }

  async getResult(id: string): Promise<ScreeningResult | null> {
    const results = this.getAllResults();
    const found = results.find((r: any) => r.id === id);
    return found ? this.convertToResult(found) : null;
  }

  async getUserResults(userId: string): Promise<ScreeningResult[]> {
    const results = this.getAllResults();
    const userResults = results.filter((r: any) => r.userId === userId);
    return userResults.map((r: any) => this.convertToResult(r)).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getHistory(userId: string, limit?: number): Promise<ScreeningResult[]> {
    const results = await this.getUserResults(userId);
    return limit ? results.slice(0, limit) : results;
  }

  async getMostRecentResult(userId: string): Promise<ScreeningResult | null> {
    const results = await this.getUserResults(userId);
    return results.length > 0 ? results[0] : null;
  }

  async deleteResult(id: string): Promise<void> {
    const results = this.getAllResults();
    const filtered = results.filter((r: any) => r.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  async deleteUserResults(userId: string): Promise<void> {
    const results = this.getAllResults();
    const filtered = results.filter((r: any) => r.userId !== userId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  async clearAllResults(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async getUserResultCount(userId: string): Promise<number> {
    const results = this.getAllResults();
    return results.filter((r: any) => r.userId === userId).length;
  }

  private getAllResults(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private convertToResult(stored: any): ScreeningResult {
    return {
      id: stored.id,
      userId: stored.userId,
      date: new Date(stored.date),
      age: stored.age,
      version: stored.version,
      scores: stored.scores,
      severity: stored.severity,
      recommendations: stored.recommendations,
    };
  }
}

/**
 * Get storage instance (IndexedDB with localStorage fallback)
 */
export function getStorage(): IndexedDBStorage | LocalStorageFallback {
  if (typeof indexedDB !== 'undefined') {
    return getIndexedDBStorage();
  }
  return new LocalStorageFallback();
}
