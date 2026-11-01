import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'default' | 'dyslexia' | 'high-contrast';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'default',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const themes: Theme[] = ['default', 'dyslexia', 'high-contrast'];
        const currentIndex = themes.indexOf(get().theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        set({ theme: themes[nextIndex] });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
