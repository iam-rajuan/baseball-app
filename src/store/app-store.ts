import { create } from 'zustand';

type AppState = {
  authEmail: string;
  isAuthenticated: boolean;
  isPremium: boolean;
  otpCode: string;
  hydrateSession: (payload: { email: string; isPremium: boolean }) => void;
  clearSession: () => void;
  setAuthEmail: (email: string) => void;
  setOtpCode: (code: string) => void;
  completeAuth: () => void;
  unlockPremium: () => void;
  setPremium: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  authEmail: '',
  isAuthenticated: false,
  isPremium: false,
  otpCode: '',
  hydrateSession: ({ email, isPremium }) =>
    set({
      authEmail: email,
      isAuthenticated: true,
      isPremium,
    }),
  clearSession: () =>
    set({
      authEmail: '',
      isAuthenticated: false,
      isPremium: false,
      otpCode: '',
    }),
  setAuthEmail: (authEmail) => set({ authEmail }),
  setOtpCode: (otpCode) => set({ otpCode }),
  completeAuth: () => set({ isAuthenticated: true }),
  unlockPremium: () => set({ isPremium: true }),
  setPremium: (isPremium) => set({ isPremium }),
}));
