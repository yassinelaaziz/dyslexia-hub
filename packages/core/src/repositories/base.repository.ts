/**
 * Base repository interface defining common CRUD operations
 * This interface is framework-agnostic and can be implemented
 * for various storage backends (IndexedDB, SQLite, PostgreSQL, etc.)
 */

/**
 * Result of a synchronization operation
 */
export interface SyncResult {
  /** Whether sync was successful */
  success: boolean;
  /** Number of records synced */
  recordsSynced: number;
  /** Number of conflicts encountered */
  conflicts: number;
  /** Error message if sync failed */
  error?: string;
  /** Timestamp of sync completion */
  timestamp: Date;
}

/**
 * Filter options for repository queries
 */
export interface FilterOptions {
  /** Key-value pairs for filtering */
  [key: string]: any;
  /** Limit number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Generic repository interface for CRUD operations
 */
export interface Repository<T> {
  /**
   * Find an entity by its ID
   * @param id - Unique identifier of the entity
   * @returns Promise resolving to the entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities, optionally with filters
   * @param filters - Optional filter options
   * @returns Promise resolving to array of entities
   */
  findAll(filters?: FilterOptions): Promise<T[]>;

  /**
   * Create a new entity
   * @param entity - The entity to create
   * @returns Promise resolving to the created entity
   */
  create(entity: T): Promise<T>;

  /**
   * Update an existing entity
   * @param id - Unique identifier of the entity to update
   * @param updates - Partial updates to apply
   * @returns Promise resolving to the updated entity
   */
  update(id: string, updates: Partial<T>): Promise<T>;

  /**
   * Delete an entity by its ID
   * @param id - Unique identifier of the entity to delete
   * @returns Promise resolving when deletion is complete
   */
  delete(id: string): Promise<void>;

  /**
   * Synchronize local data with remote storage
   * @returns Promise resolving to sync result
   */
  sync(): Promise<SyncResult>;

  /**
   * Count total number of entities
   * @param filters - Optional filter options
   * @returns Promise resolving to count
   */
  count(filters?: FilterOptions): Promise<number>;
}
