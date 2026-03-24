import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  username: string | null;
  email: string | null;
  userType: 'admin' | 'user' | null;
  isAuthenticated: boolean;
  setAuth: (token: string, username: string, email?: string, userType?: 'admin' | 'user') => void;
  clearAuth: () => void;
  setToken: (token: string) => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      email: null,
      userType: null,
      isAuthenticated: false,
      setAuth: (token: string, username: string, email = '', userType = 'user') => {
        set({ token, username, email, userType, isAuthenticated: true });
      },
      clearAuth: () => {
        set({ token: null, username: null, email: null, userType: null, isAuthenticated: false });
      },
      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
