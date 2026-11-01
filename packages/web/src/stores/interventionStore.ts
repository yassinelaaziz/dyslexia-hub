import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InterventionProgress {
  interventionId: string;
  userId: string;
  sessions: number;
  lastSessionDate: Date;
  progress: number; // 0-100
  notes: string[];
}

interface InterventionStore {
  activeInterventions: InterventionProgress[];
  setActiveIntervention: (progress: InterventionProgress) => void;
  updateProgress: (interventionId: string, progress: number) => void;
  addSession: (interventionId: string) => void;
  removeIntervention: (interventionId: string) => void;
}

export const useInterventionStore = create<InterventionStore>()(
  persist(
    (set) => ({
      activeInterventions: [],
      setActiveIntervention: (progress) =>
        set((state) => {
          const existing = state.activeInterventions.find(
            (i) => i.interventionId === progress.interventionId
          );
          if (existing) {
            return state;
          }
          return { activeInterventions: [...state.activeInterventions, progress] };
        }),
      updateProgress: (interventionId, progress) =>
        set((state) => ({
          activeInterventions: state.activeInterventions.map((i) =>
            i.interventionId === interventionId ? { ...i, progress } : i
          ),
        })),
      addSession: (interventionId) =>
        set((state) => ({
          activeInterventions: state.activeInterventions.map((i) =>
            i.interventionId === interventionId
              ? { ...i, sessions: i.sessions + 1, lastSessionDate: new Date() }
              : i
          ),
        })),
      removeIntervention: (interventionId) =>
        set((state) => ({
          activeInterventions: state.activeInterventions.filter(
            (i) => i.interventionId !== interventionId
          ),
        })),
    }),
    {
      name: 'intervention-storage',
    }
  )
);
