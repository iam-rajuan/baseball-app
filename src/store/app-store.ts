import { create } from 'zustand';

type AppState = {
  authEmail: string;
  isAuthenticated: boolean;
  isPremium: boolean;
  isSubscriptionReady: boolean;
  otpCode: string;
  hydrateSession: (payload: { email: string }) => void;
  clearSession: () => void;
  setAuthEmail: (email: string) => void;
  setOtpCode: (code: string) => void;
  completeAuth: () => void;
  unlockPremium: () => void;
  setPremium: (value: boolean) => void;
  setSubscriptionReady: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  authEmail: '',
  isAuthenticated: false,
  isPremium: false,
  isSubscriptionReady: false,
  otpCode: '',
  hydrateSession: ({ email }) =>
    set({
      authEmail: email,
      isAuthenticated: true,
    }),
  clearSession: () =>
    set({
      authEmail: '',
      isAuthenticated: false,
      otpCode: '',
    }),
  setAuthEmail: (authEmail) => set({ authEmail }),
  setOtpCode: (otpCode) => set({ otpCode }),
  completeAuth: () => set({ isAuthenticated: true }),
  unlockPremium: () => set({ isPremium: true }),
  setPremium: (isPremium) => set({ isPremium }),
  setSubscriptionReady: (isSubscriptionReady) => set({ isSubscriptionReady }),
}));
