'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Address } from '@/types';
import {
  getAccessToken,
  setAccessToken as setBridgeAccessToken,
  refreshAccessTokenSingleFlight,
} from '@/lib/auth/tokenBridge';

interface LoginResult {
  success: boolean;
  error?: string;
  locked?: boolean;
  remainingMinutes?: number;
  requires2FA?: boolean;
  userId?: string;
}

interface RegisterData {
  fullName?: string;
  name?: string;
  phone?: string;
  mobile?: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
  acceptedTerms: boolean;
}

export interface UserSessionInfo {
  id: string;
  device: string;
  browser: string;
  operatingSystem: string;
  approximateLocation: string;
  ipAddress: string;
  lastUsedAt: string;
  createdAt: string;
  isCurrentSession: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  profileCompletionPercent: number;
  isProfileComplete: boolean;
  login: (phone: string, name?: string, email?: string, isFirstTime?: boolean) => void;
  loginWithCredentials: (credential: string, password: string, rememberMe?: boolean) => Promise<LoginResult>;
  registerUser: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: (logoutAll?: boolean | unknown) => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  refreshSession: () => Promise<boolean>;
  listSessions: () => Promise<UserSessionInfo[]>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  revokeAllOtherSessions: () => Promise<boolean>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  defaultAddress: Address | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function calculateProfileCompletion(u: User | null): number {
  if (!u) return 0;
  let score = 0;

  // 1. Mobile Verified (20%)
  if (u.isMobileVerified || u.phoneVerified || u.hasCompletedFirstTimeOtp) score += 20;

  // 2. Full Name Provided (20%)
  if (u.name && u.name.trim().length > 2 && u.name !== 'SELBAR Member') score += 20;

  // 3. Registered Primary Email Added (20%)
  if (u.email && u.email.includes('@') && u.email.trim().length > 5) score += 20;

  // 4. Delivery Address Saved (20%)
  if (u.addresses && u.addresses.length > 0) score += 20;

  // 5. Payout Preference (UPI ID for buyback/returns) (20%)
  if (u.payoutUpi && u.payoutUpi.includes('@')) score += 20;

  return Math.min(100, score);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const updateAccessToken = useCallback((token: string | null) => {
    setBridgeAccessToken(token);
    setAccessTokenState(token);
  }, []);

  /**
   * Silent Session Restoration on App Boot
   * Uses HttpOnly refresh token cookie to obtain a fresh access token without exposing secrets to JS
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    // If user is a guest (no profile cached and no session indicator), skip futile network call
    if (typeof window !== 'undefined') {
      const hasSavedProfile = Boolean(localStorage.getItem('selbar_user_profile'));
      const hasSessionCookie = document.cookie.includes('selbar_has_session');
      if (!hasSavedProfile && !hasSessionCookie) {
        setIsLoading(false);
        return false;
      }
    }

    try {
      const newToken = await refreshAccessTokenSingleFlight();
      if (newToken) {
        updateAccessToken(newToken);

        // Restore cached user profile metadata
        const saved = localStorage.getItem('selbar_user_profile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const percent = calculateProfileCompletion(parsed);
            setUser({
              ...parsed,
              profileCompletionPercent: percent,
              isProfileComplete: percent === 100,
            });
          } catch {
            // invalid JSON
          }
        }
        return true;
      } else {
        updateAccessToken(null);
        setUser(null);
        localStorage.removeItem('selbar_user_profile');
        return false;
      }
    } catch {
      updateAccessToken(null);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateAccessToken]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  /**
   * Multi-Identifier Secure Login
   */
  const loginWithCredentials = async (
    credential: string,
    password: string,
    rememberMe = true
  ): Promise<LoginResult> => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential, password, rememberMe }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Failed to sign in. Please verify your credentials.',
          locked: data.locked,
          remainingMinutes: data.remainingMinutes,
        };
      }

      if (data.requires2FA) {
        return {
          success: true,
          requires2FA: true,
          userId: data.userId,
        };
      }

      updateAccessToken(data.accessToken);

      const incomingUser = data.user;
      const percent = calculateProfileCompletion(incomingUser);
      const completeUser: User = {
        id: incomingUser.id || incomingUser._id,
        phone: incomingUser.phone,
        name: incomingUser.name || 'SELBAR Member',
        email: incomingUser.email,
        username: incomingUser.username,
        role: incomingUser.role || 'customer',
        phoneVerified: incomingUser.phoneVerified,
        emailVerified: incomingUser.emailVerified,
        isMobileVerified: incomingUser.phoneVerified,
        hasCompletedFirstTimeOtp: true,
        addresses: incomingUser.addresses || [],
        profileCompletionPercent: percent,
        isProfileComplete: percent === 100,
      };

      setUser(completeUser);
      localStorage.setItem('selbar_user_profile', JSON.stringify(completeUser));
      setIsAuthModalOpen(false);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during sign in.' };
    }
  };

  /**
   * Complete User Registration
   */
  const registerUser = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: data.fullName || data.name,
          mobile: data.mobile || data.phone,
          email: data.email,
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword,
          acceptedTerms: data.acceptedTerms,
        }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        return {
          success: false,
          error: result.error || 'Registration failed. Please check your information.',
        };
      }

      updateAccessToken(result.accessToken);

      const incomingUser = result.user;
      const percent = calculateProfileCompletion(incomingUser);
      const completeUser: User = {
        id: incomingUser.id || incomingUser._id,
        phone: incomingUser.phone,
        name: incomingUser.name,
        email: incomingUser.email,
        username: incomingUser.username,
        role: incomingUser.role || 'customer',
        phoneVerified: incomingUser.phoneVerified,
        emailVerified: incomingUser.emailVerified,
        isMobileVerified: incomingUser.phoneVerified,
        hasCompletedFirstTimeOtp: true,
        addresses: [],
        profileCompletionPercent: percent,
        isProfileComplete: percent === 100,
      };

      setUser(completeUser);
      localStorage.setItem('selbar_user_profile', JSON.stringify(completeUser));
      setIsAuthModalOpen(false);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration.' };
    }
  };

  /**
   * Compatibility quick login
   */
  const login = (phone: string, name?: string, email?: string, isFirstTime = false) => {
    const baseUser: User = {
      id: user?.id || `usr_${Date.now()}`,
      phone,
      name: name || user?.name || (isFirstTime ? 'SELBAR Member' : 'Verified Member'),
      email: email || user?.email,
      isMobileVerified: true,
      hasCompletedFirstTimeOtp: true,
      addresses: user?.addresses || [],
    };
    const percent = calculateProfileCompletion(baseUser);
    const completeUser: User = {
      ...baseUser,
      profileCompletionPercent: percent,
      isProfileComplete: percent === 100,
    };
    setUser(completeUser);
    localStorage.setItem('selbar_user_profile', JSON.stringify(completeUser));
    setIsAuthModalOpen(false);
  };

  /**
   * Secure Logout
   */
  const logout = async (logoutAll?: boolean | unknown) => {
    const isAll = typeof logoutAll === 'boolean' ? logoutAll : false;
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ logoutAll: isAll }),
      });
    } catch {
      // continue cleanup
    }
    updateAccessToken(null);
    setUser(null);
    localStorage.removeItem('selbar_user_profile');
    localStorage.removeItem('selbar_user');
  };

  /**
   * List Active Sessions for Security Center
   */
  const listSessions = async (): Promise<UserSessionInfo[]> => {
    try {
      const res = await fetch('/api/v1/auth/sessions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        return data.sessions;
      }
      return [];
    } catch {
      return [];
    }
  };

  /**
   * Revoke a single session
   */
  const revokeSession = async (sessionId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/v1/auth/sessions?id=${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        credentials: 'include',
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  };

  /**
   * Revoke all other device sessions
   */
  const revokeAllOtherSessions = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/v1/auth/sessions?allOthers=true', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
        credentials: 'include',
      });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const prevScore = calculateProfileCompletion(user);
    const updatedUser: User = {
      ...user,
      ...updates,
    };

    const newScore = calculateProfileCompletion(updatedUser);
    updatedUser.profileCompletionPercent = newScore;
    updatedUser.isProfileComplete = newScore === 100;

    setUser(updatedUser);
    localStorage.setItem('selbar_user_profile', JSON.stringify(updatedUser));
  };

  const addAddress = (addr: Omit<Address, 'id'>): Address => {
    const newAddress: Address = {
      ...addr,
      id: `addr_${Date.now()}`,
      isDefault: user?.addresses.length === 0 ? true : addr.isDefault,
    };

    if (user) {
      const updatedAddresses: Address[] = addr.isDefault
        ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), newAddress]
        : [...user.addresses, newAddress];

      updateProfile({ addresses: updatedAddresses });
    }
    return newAddress;
  };

  const profileCompletionPercent = calculateProfileCompletion(user);
  const isProfileComplete = profileCompletionPercent === 100;
  const defaultAddress = user?.addresses.find((a) => a.isDefault) || user?.addresses[0] || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn: !!user,
        isLoading,
        profileCompletionPercent,
        isProfileComplete,
        login,
        loginWithCredentials,
        registerUser,
        logout,
        updateProfile,
        refreshSession,
        listSessions,
        revokeSession,
        revokeAllOtherSessions,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        addAddress,
        defaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
