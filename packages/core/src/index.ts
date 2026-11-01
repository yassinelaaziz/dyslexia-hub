/**
 * Dyslexia Grand Hub - Core Business Logic
 *
 * This package provides the core business logic for the Dyslexia Grand Hub application.
 * It is platform-agnostic and can be used across web, mobile, and desktop platforms.
 *
 * @packageDocumentation
 */

// Domain Models
export * from './domain/user';
export * from './domain/screening';
export * from './domain/intervention';
export * from './domain/research';
export * from './domain/training';

// Repository Interfaces
export * from './repositories/base.repository';
export * from './repositories/user.repository';
export * from './repositories/screening.repository';
export * from './repositories/intervention.repository';
export * from './repositories/claim.repository';
export * from './repositories/training.repository';

// Repository Implementations
export * from './repositories/training.repository.impl';

// Services
export * from './services/screening.service';
export * from './services/intervention.service';
export * from './services/user-profile.service';
export * from './services/research.service';
export * from './services/training.service';
