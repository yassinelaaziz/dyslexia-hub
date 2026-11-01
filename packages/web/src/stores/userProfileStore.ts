import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  language: string;
  preferences: {
    theme: 'default' | 'dyslexia' | 'high-contrast';
    fontSize: 'normal' | 'large' | 'extra-large';
    dyslexiaFont: boolean;
  };
}

interface UserProfileStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updatePreferences: (preferences) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, preferences: { ...state.profile.preferences, ...preferences } }
            : null,
        })),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
