import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isDarkMode: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isDarkMode: false,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => {
        document.documentElement.classList.remove('dark');
        return set({ isAuthenticated: false, user: null, token: null });
      },
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { isDarkMode: newMode };
      }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) document.documentElement.classList.add('dark');
      }
    }
  )
);
