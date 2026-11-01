/**
 * Screening service for assessing users and calculating severity
 *
 * Based on Phase 1 research findings:
 * - Dyslexia is characterized by core deficit in phonological processing
 * - Rapid automatized naming (RAN) is a key indicator
 * - Working memory and attention are secondary contributors
 * - Screening is NOT diagnosis - this is a critical distinction
 *
 * IMPORTANT DISCLAIMER:
 * This screening tool is NOT a diagnostic assessment. It provides an initial
 * risk assessment based on self-reported symptoms. A formal diagnosis of dyslexia
 * requires comprehensive evaluation by qualified professionals (psychologists,
 * educational specialists, or speech-language pathologists).
 */

import { ScreeningResult, ScreeningScores, SeverityLevel, ScreeningRequest } from '../domain/screening';
import { ScreeningResultRepository } from '../repositories/screening.repository';
import { InterventionRepository } from '../repositories/intervention.repository';
import { Intervention } from '../domain/intervention';

/**
 * Screening disclaimer - must be displayed to all users
 */
export const SCREENING_DISCLAIMER = `IMPORTANT: This screening is NOT a diagnosis. It is an initial risk assessment based on self-reported symptoms. A formal diagnosis of dyslexia requires comprehensive evaluation by qualified professionals (psychologists, educational specialists, or speech-language pathologists). If you or your child are experiencing significant reading difficulties, please consult with a healthcare or educational professional for a formal assessment.`;

/**
 * Screening question structure
 */
export interface ScreeningQuestion {
  id: string;
  domain: 'phonological' | 'rapidNaming' | 'workingMemory' | 'attention';
  text: string;
  options: { value: number; label: string }[];
  ageAppropriate: 'child' | 'adult' | 'both';
}

/**
 * Screening answers from user
 */
export interface ScreeningAnswers {
  userId: string;
  age: number;
  language: string;
  answers: Record<string, number>; // questionId -> selected value
}

/**
 * Screening service interface
 */
export interface ScreeningService {
  /**
   * Get screening questions for a specific age group
   * @param age - User age
   * @param language - User language (ISO 639-1 code)
   * @returns Array of screening questions
   */
  getQuestions(age: number, language: string): ScreeningQuestion[];

  /**
   * Calculate screening scores from user answers
   * @param answers - User's answers to screening questions
   * @returns Calculated screening scores
   */
  calculateScores(answers: ScreeningAnswers): ScreeningScores;

  /**
   * Assess a user for dyslexia risk
   * @param request - Screening request data
   * @returns Promise resolving to screening result
   */
  assessUser(request: ScreeningRequest): Promise<ScreeningResult>;

  /**
   * Calculate severity level from screening scores
   * @param scores - Screening scores
   * @returns Severity level
   */
  calculateSeverity(scores: ScreeningScores): SeverityLevel;

  /**
   * Get intervention recommendations based on severity and age
   * @param severity - Severity level
   * @param age - User age
   * @returns Promise resolving to array of recommended interventions
   */
  getRecommendations(severity: SeverityLevel, age: number): Promise<Intervention[]>;

  /**
   * Save a screening result
   * @param result - Screening result to save
   * @returns Promise resolving when save is complete
   */
  saveResult(result: ScreeningResult): Promise<void>;

  /**
   * Get screening history for a user
   * @param userId - User ID
   * @returns Promise resolving to array of screening results
   */
  getHistory(userId: string): Promise<ScreeningResult[]>;
}

/**
 * Implementation of screening service
 */
export class ScreeningServiceImpl implements ScreeningService {
  constructor(
    private screeningResultRepository: ScreeningResultRepository,
    private interventionRepository: InterventionRepository
  ) {}

  /**
   * Get screening questions for a specific age group
   * @param age - User age
   * @param language - User language (ISO 639-1 code)
   * @returns Array of screening questions
   */
  getQuestions(age: number, _language: string): ScreeningQuestion[] {
    const isChild = age < 13;
    const isAdult = age >= 13;

    const questions: ScreeningQuestion[] = [];

    // Phonological processing questions (primary indicator per research)
    if (isChild) {
      questions.push(
        {
          id: 'phon_1',
          domain: 'phonological',
          text: 'How easy is it for you to break words into sounds? (Like cat = c-a-t)',
          options: [
            { value: 4, label: 'Very easy' },
            { value: 3, label: 'Easy' },
            { value: 2, label: 'A little hard' },
            { value: 1, label: 'Very hard' }
          ],
          ageAppropriate: 'child'
        },
        {
          id: 'phon_2',
          domain: 'phonological',
          text: 'When you learn a new word, can you say it correctly the first time?',
          options: [
            { value: 4, label: 'Yes, always' },
            { value: 3, label: 'Yes, most of the time' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'No, hardly ever' }
          ],
          ageAppropriate: 'child'
        },
        {
          id: 'phon_3',
          domain: 'phonological',
          text: 'Do you mix up sounds in words? (Like saying "beddy tear" instead of "teddy bear")',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Often' }
          ],
          ageAppropriate: 'child'
        }
      );
    }

    if (isAdult) {
      questions.push(
        {
          id: 'phon_1',
          domain: 'phonological',
          text: 'How difficult do you find it to break words into individual sounds or syllables?',
          options: [
            { value: 4, label: 'Not difficult at all' },
            { value: 3, label: 'Slightly difficult' },
            { value: 2, label: 'Moderately difficult' },
            { value: 1, label: 'Very difficult' }
          ],
          ageAppropriate: 'adult'
        },
        {
          id: 'phon_2',
          domain: 'phonological',
          text: 'When you encounter an unfamiliar word, how easily can you sound it out?',
          options: [
            { value: 4, label: 'Very easily' },
            { value: 3, label: 'Easily' },
            { value: 2, label: 'With some difficulty' },
            { value: 1, label: 'With great difficulty' }
          ],
          ageAppropriate: 'adult'
        },
        {
          id: 'phon_3',
          domain: 'phonological',
          text: 'How often do you have trouble remembering how to pronounce new words?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Often' }
          ],
          ageAppropriate: 'adult'
        }
      );
    }

    // Rapid Automatized Naming (RAN) questions (key indicator per research)
    if (isChild) {
      questions.push(
        {
          id: 'ran_1',
          domain: 'rapidNaming',
          text: 'How fast can you name colors, numbers, or letters?',
          options: [
            { value: 4, label: 'Very fast' },
            { value: 3, label: 'Fast' },
            { value: 2, label: 'A little slow' },
            { value: 1, label: 'Very slow' }
          ],
          ageAppropriate: 'child'
        },
        {
          id: 'ran_2',
          domain: 'rapidNaming',
          text: 'When you read, do you sometimes pause on words you know?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Often' }
          ],
          ageAppropriate: 'child'
        }
      );
    }

    if (isAdult) {
      questions.push(
        {
          id: 'ran_1',
          domain: 'rapidNaming',
          text: 'How would you rate your speed in naming familiar items (colors, objects, symbols)?',
          options: [
            { value: 4, label: 'Very fast' },
            { value: 3, label: 'Fast' },
            { value: 2, label: 'Slow' },
            { value: 1, label: 'Very slow' }
          ],
          ageAppropriate: 'adult'
        },
        {
          id: 'ran_2',
          domain: 'rapidNaming',
          text: 'When reading familiar words, do you ever hesitate or pause unexpectedly?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Frequently' }
          ],
          ageAppropriate: 'adult'
        }
      );
    }

    // Working memory questions (secondary indicator)
    if (isChild) {
      questions.push(
        {
          id: 'wm_1',
          domain: 'workingMemory',
          text: 'Can you remember 3-4 things at once? (Like 3 items from a shopping list)',
          options: [
            { value: 4, label: 'Yes, easily' },
            { value: 3, label: 'Yes, most of the time' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'No, hardly ever' }
          ],
          ageAppropriate: 'child'
        },
        {
          id: 'wm_2',
          domain: 'workingMemory',
          text: 'When someone gives you instructions, do you remember all the steps?',
          options: [
            { value: 4, label: 'Yes, always' },
            { value: 3, label: 'Yes, most of the time' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'No, often forget' }
          ],
          ageAppropriate: 'child'
        }
      );
    }

    if (isAdult) {
      questions.push(
        {
          id: 'wm_1',
          domain: 'workingMemory',
          text: 'How well can you hold and manipulate information in your mind (e.g., mental math)?',
          options: [
            { value: 4, label: 'Very well' },
            { value: 3, label: 'Well' },
            { value: 2, label: 'With some difficulty' },
            { value: 1, label: 'With great difficulty' }
          ],
          ageAppropriate: 'adult'
        },
        {
          id: 'wm_2',
          domain: 'workingMemory',
          text: 'When given multi-step instructions, how often do you forget steps?',
          options: [
            { value: 4, label: 'Never' },
            { value: 3, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'Often' }
          ],
          ageAppropriate: 'adult'
        }
      );
    }

    // Attention questions (secondary indicator)
    if (isChild) {
      questions.push(
        {
          id: 'att_1',
          domain: 'attention',
          text: 'Can you focus on reading for 10-15 minutes without getting distracted?',
          options: [
            { value: 4, label: 'Yes, easily' },
            { value: 3, label: 'Yes, most of the time' },
            { value: 2, label: 'Sometimes' },
            { value: 1, label: 'No, get distracted easily' }
          ],
          ageAppropriate: 'child'
        }
      );
    }

    if (isAdult) {
      questions.push(
        {
          id: 'att_1',
          domain: 'attention',
          text: 'How difficult do you find it to maintain focus during reading tasks?',
          options: [
            { value: 4, label: 'Not difficult' },
            { value: 3, label: 'Slightly difficult' },
            { value: 2, label: 'Moderately difficult' },
            { value: 1, label: 'Very difficult' }
          ],
          ageAppropriate: 'adult'
        }
      );
    }

    return questions;
  }

  /**
   * Calculate screening scores from user answers
   * @param answers - User's answers to screening questions
   * @returns Calculated screening scores
   */
  calculateScores(answers: ScreeningAnswers): ScreeningScores {
    const questions = this.getQuestions(answers.age, answers.language);

    // Group answers by domain
    const domainScores: Record<string, number[]> = {
      phonological: [],
      rapidNaming: [],
      workingMemory: [],
      attention: []
    };

    questions.forEach(question => {
      const answer = answers.answers[question.id];
      if (answer !== undefined) {
        domainScores[question.domain].push(answer);
      }
    });

    // Calculate average score for each domain (0-100 scale)
    const calculateAverage = (values: number[]): number => {
      if (values.length === 0) return 0;
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      // Convert from 1-4 scale to 0-100 scale
      return ((avg - 1) / 3) * 100;
    };

    const phonological = calculateAverage(domainScores.phonological);
    const rapidNaming = calculateAverage(domainScores.rapidNaming);
    const workingMemory = calculateAverage(domainScores.workingMemory);
    const attention = calculateAverage(domainScores.attention);

    // Calculate overall score with weighted average
    // Phonological and RAN are primary indicators (higher weight)
    // Working memory and attention are secondary (lower weight)
    const overall = (
      phonological * 0.35 +
      rapidNaming * 0.35 +
      workingMemory * 0.15 +
      attention * 0.15
    );

    return {
      phonological,
      rapidNaming,
      visual: 0, // Not currently assessed in screening
      workingMemory,
      overall
    };
  }

  /**
   * Assess a user for dyslexia risk
   * @param request - Screening request data
   * @returns Promise resolving to screening result
   */
  async assessUser(request: ScreeningRequest): Promise<ScreeningResult> {
    // This method is used when screening has already been completed
    // For now, return a placeholder - actual assessment should use calculateScores
    const scores: ScreeningScores = {
      phonological: 0,
      rapidNaming: 0,
      visual: 0,
      workingMemory: 0,
      overall: 0
    };

    const severity = this.calculateSeverity(scores);
    const recommendations = await this.getRecommendations(severity, request.age);

    const result: ScreeningResult = {
      id: this.generateId(),
      userId: request.userId,
      date: new Date(),
      age: request.age,
      version: request.version,
      scores,
      severity,
      recommendations: recommendations.map(i => i.id)
    };

    return result;
  }

  /**
   * Calculate severity level from screening scores
   * Based on research showing dyslexia as a continuum (no clear cut-off)
   * @param scores - Screening scores
   * @returns Severity level
   */
  calculateSeverity(scores: ScreeningScores): SeverityLevel {
    const { overall, phonological, rapidNaming } = scores;

    // Thresholds based on research continuum view
    // These are screening thresholds, NOT diagnostic thresholds
    // High scores indicate LOW risk (better performance)
    // Low scores indicate HIGH risk (poorer performance)

    if (overall >= 80 && phonological >= 75 && rapidNaming >= 75) {
      return 'none'; // No dyslexia risk indicators
    } else if (overall >= 60 && phonological >= 55 && rapidNaming >= 55) {
      return 'mild'; // Mild risk indicators
    } else if (overall >= 40 && phonological >= 35 && rapidNaming >= 35) {
      return 'moderate'; // Moderate risk indicators
    } else {
      return 'severe'; // Strong risk indicators
    }
  }

  /**
   * Get intervention recommendations based on severity and age
   * @param severity - Severity level
   * @param age - User age
   * @returns Promise resolving to array of recommended interventions
   */
  async getRecommendations(severity: SeverityLevel, age: number): Promise<Intervention[]> {
    // If no dyslexia risk, return empty array
    if (severity === 'none') {
      return [];
    }

    // Find interventions appropriate for the user's age
    const ageAppropriate = await this.interventionRepository.findByAge(age);

    // Filter based on severity
    // Higher severity may require more intensive interventions
    const severityFilters = this.getSeverityFilters(severity);
    const recommended = ageAppropriate.filter(intervention => {
      // Minimum efficacy based on severity
      if (intervention.efficacyRating < severityFilters.minEfficacy) {
        return false;
      }

      // Target specific deficits based on severity
      if (severityFilters.targetDeficits.length > 0) {
        const hasTargetDeficit = intervention.targetDeficit.some(deficit =>
          severityFilters.targetDeficits.includes(deficit)
        );
        if (!hasTargetDeficit) {
          return false;
        }
      }

      return true;
    });

    // Sort by efficacy rating (highest first)
    recommended.sort((a, b) => b.efficacyRating - a.efficacyRating);

    // Return top recommendations (limit to 5)
    return recommended.slice(0, 5);
  }

  /**
   * Save a screening result
   * @param result - Screening result to save
   * @returns Promise resolving when save is complete
   */
  async saveResult(result: ScreeningResult): Promise<void> {
    await this.screeningResultRepository.create(result);
  }

  /**
   * Get screening history for a user
   * @param userId - User ID
   * @returns Promise resolving to array of screening results
   */
  async getHistory(userId: string): Promise<ScreeningResult[]> {
    return await this.screeningResultRepository.getHistory(userId);
  }

  /**
   * Get severity-specific filters for recommendations
   * @param severity - Severity level
   * @returns Filter criteria
   */
  private getSeverityFilters(severity: SeverityLevel): {
    minEfficacy: number;
    targetDeficits: string[];
  } {
    switch (severity) {
      case 'mild':
        return {
          minEfficacy: 5,
          targetDeficits: ['phonological', 'rapidNaming']
        };
      case 'moderate':
        return {
          minEfficacy: 6,
          targetDeficits: ['phonological', 'rapidNaming', 'workingMemory']
        };
      case 'severe':
        return {
          minEfficacy: 7,
          targetDeficits: ['phonological', 'rapidNaming', 'workingMemory', 'visual']
        };
      default:
        return {
          minEfficacy: 0,
          targetDeficits: []
        };
    }
  }

  /**
   * Generate a unique ID
   * @returns Unique ID string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
