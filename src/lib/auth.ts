import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'admin' | 'user';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isAdmin: user.role === 'admin' && user.is_active === true 
      }),
      
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isAdmin: user.role === 'admin' && user.is_active === true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isAdmin: false 
      }),
      
      setUser: (user) => set({ 
        user, 
        isAdmin: user.role === 'admin' && user.is_active === true 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' && user?.is_active === true;
};