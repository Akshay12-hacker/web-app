'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStorage } from '../services/authStorage';

interface AuthContextType {
  user: any | null;
  activeProfile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  updateActiveProfile: (profile: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

declare global {
  interface Window {
    HomeOrbitNative?: {
      initialData: any;
      isNative: boolean;
      platform: string;
    };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [activeProfile, setActiveProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check for native data injection
        const nativeData = typeof window !== 'undefined' ? window.HomeOrbitNative?.initialData : null;
        
        if (nativeData?.session) {
          const sessionUser = {
            ...nativeData.user,
            ...nativeData.session.user,
          };
          const data = {
            accessToken: nativeData.session.accessToken,
            refreshToken: nativeData.session.refreshToken,
            user: sessionUser,
            selectedProfile: nativeData.session.selectedProfile,
            ownerProfiles: nativeData.session.ownerProfiles,
          };
          await authStorage.saveAuthData(data);
          setUser(sessionUser);
          setActiveProfile(data.selectedProfile || null);
          setIsLoading(false);
          return;
        }

        // 2. Fallback to storage
        const storedUser = await authStorage.getUser();
        if (storedUser) {
          setUser(storedUser);
          setActiveProfile(storedUser.selectedProfile || storedUser.ownerProfiles?.[0] || null);
        }
      } catch (error) {
        console.error('Failed to init auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: any) => {
    await authStorage.saveAuthData(data);
    setUser(data.user);
    setActiveProfile(data.selectedProfile || data.ownerProfiles?.[0] || null);
  };

  const updateActiveProfile = async (profile: any) => {
    setActiveProfile(profile);
    if (user) {
      const updatedUser = { ...user, selectedProfile: profile };
      setUser(updatedUser);
      await authStorage.saveAuthData({ user: updatedUser });
    }
  };

  const logout = async () => {
    await authStorage.clearAuthData();
    setUser(null);
    setActiveProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeProfile,
        isLoading,
        isAuthenticated: !!user,
        login,
        updateActiveProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
