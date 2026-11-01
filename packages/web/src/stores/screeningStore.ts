import { create } from 'zustand';
import { ScreeningResult, ScreeningScores, SeverityLevel } from '@dyslexia-hub/core';
import { getStorage } from '../storage/indexedDB';

interface ScreeningAnswers {
  userId: string;
  age: number;
  language: string;
  answers: Record<string, number>;
}

interface ScreeningStore {
  // Current screening state
  currentScreening: {
    userId: string;
    age: number;
    language: string;
    answers: Record<string, number>;
    currentQuestionIndex: number;
    isChild: boolean;
  } | null;

  // Screening history
  history: ScreeningResult[];

  // Actions
  startScreening: (userId: string, age: number, language: string, isChild: boolean) => void;
  setAnswer: (questionId: string, value: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  completeScreening: (scores: ScreeningScores, severity: SeverityLevel, recommendations: string[]) => Promise<void>;
  cancelScreening: () => void;

  // History management
  loadHistory: (userId: string) => Promise<void>;
  addResult: (result: ScreeningResult) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  clearHistory: () => void;

  // Helpers
  getCurrentProgress: () => { current: number; total: number };
  isScreeningComplete: () => boolean;
}

export const useScreeningStore = create<ScreeningStore>((set, get) => ({
  currentScreening: null,
  history: [],

  startScreening: (userId, age, language, isChild) => {
    set({
      currentScreening: {
        userId,
        age,
        language,
        answers: {},
        currentQuestionIndex: 0,
        isChild,
      },
    });
  },

  setAnswer: (questionId, value) => {
    const { currentScreening } = get();
    if (currentScreening) {
      set({
        currentScreening: {
          ...currentScreening,
          answers: {
            ...currentScreening.answers,
            [questionId]: value,
          },
        },
      });
    }
  },

  nextQuestion: () => {
    const { currentScreening } = get();
    if (currentScreening) {
      set({
        currentScreening: {
          ...currentScreening,
          currentQuestionIndex: currentScreening.currentQuestionIndex + 1,
        },
      });
    }
  },

  previousQuestion: () => {
    const { currentScreening } = get();
    if (currentScreening && currentScreening.currentQuestionIndex > 0) {
      set({
        currentScreening: {
          ...currentScreening,
          currentQuestionIndex: currentScreening.currentQuestionIndex - 1,
        },
      });
    }
  },

  goToQuestion: (index) => {
    const { currentScreening } = get();
    if (currentScreening) {
      set({
        currentScreening: {
          ...currentScreening,
          currentQuestionIndex: index,
        },
      });
    }
  },

  completeScreening: async (scores, severity, recommendations) => {
    const { currentScreening } = get();
    if (!currentScreening) return;

    const result: ScreeningResult = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentScreening.userId,
      date: new Date(),
      age: currentScreening.age,
      version: '1.0',
      scores,
      severity,
      recommendations,
    };

    // Save to IndexedDB
    const storage = getStorage();
    await storage.saveResult(result, currentScreening.answers);

    // Update store
    set((state) => ({
      history: [result, ...state.history],
      currentScreening: null,
    }));
  },

  cancelScreening: () => {
    set({ currentScreening: null });
  },

  loadHistory: async (userId) => {
    const storage = getStorage();
    const history = await storage.getUserResults(userId);
    set({ history });
  },

  addResult: async (result) => {
    const storage = getStorage();
    await storage.saveResult(result);
    set((state) => ({
      history: [result, ...state.history],
    }));
  },

  deleteResult: async (id) => {
    const storage = getStorage();
    await storage.deleteResult(id);
    set((state) => ({
      history: state.history.filter((r) => r.id !== id),
    }));
  },

  clearHistory: () => {
    set({ history: [] });
  },

  getCurrentProgress: () => {
    const { currentScreening } = get();
    if (!currentScreening) return { current: 0, total: 0 };

    // Total questions depends on age group
    const totalQuestions = currentScreening.isChild ? 9 : 9; // Adjust based on actual question count
    return {
      current: currentScreening.currentQuestionIndex + 1,
      total: totalQuestions,
    };
  },

  isScreeningComplete: () => {
    const { currentScreening } = get();
    if (!currentScreening) return false;

    const totalQuestions = currentScreening.isChild ? 9 : 9;
    return currentScreening.currentQuestionIndex >= totalQuestions - 1;
  },
}));
