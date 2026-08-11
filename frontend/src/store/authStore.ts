import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  profile?: { firstName: string; lastName: string; avatarUrl?: string };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginTime: number | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      loginTime: null,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await authApi.login({ email, password });
          const user = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            profile: data.user.profile,
          };
          const token = data.accessToken;
          localStorage.setItem('aura_token', token);
          set({ user, token, isAuthenticated: true, loginTime: Date.now() });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const data = await authApi.register(formData);
          const user = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            profile: data.user.profile,
          };
          const token = data.accessToken;
          localStorage.setItem('aura_token', token);
          set({ user, token, isAuthenticated: true, loginTime: Date.now() });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('aura_token');
        localStorage.removeItem('lumora_require_onboarding');
        set({ user: null, token: null, isAuthenticated: false, loginTime: null });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'aura-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated, loginTime: state.loginTime }),
    }
  )
);
