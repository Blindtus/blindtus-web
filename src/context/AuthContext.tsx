'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { askLogout, askMe, askRefreshToken } from '@/lib/api/auth';
import { User } from '@/types/user.type';

export const INITIAL_USER = {
  _id: '',
  username: '',
  email: '',
  avatar: '',
  avatarSettings: {},
  roles: [],
  confirmed: false,
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  logout: () => {},
};

type ContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<ContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthUser = useCallback(async () => {
    try {
      const response = await askMe(); // Automatically sends cookies

      if ('data' in response) {
        const me = response.data;
        setIsAuthenticated(true);
        setIsAdmin(me?.roles.includes('admin') || false);
        setUser(me || INITIAL_USER);
        return true;
      }

      return false;
    } catch {
      try {
        const refreshResponse = await askRefreshToken();

        if ('data' in refreshResponse) {
          return checkAuthUser(); // Retry authentication
        }
        return false;
      } catch {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(INITIAL_USER);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthUser();
  }, [checkAuthUser]);

  const logout = useCallback(async () => {
    await askLogout();
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push('/');
  }, [router]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
