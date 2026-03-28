import { create } from 'zustand';

type AppState = {
  authEmail: string;
  isAuthenticated: boolean;
  isPremium: boolean;
  otpCode: string;
  setAuthEmail: (email: string) => void;
  setOtpCode: (code: string) => void;
  completeAuth: () => void;
  unlockPremium: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  authEmail: '',
  isAuthenticated: false,
  isPremium: false,
  otpCode: '',
  setAuthEmail: (authEmail) => set({ authEmail }),
  setOtpCode: (otpCode) => set({ otpCode }),
  completeAuth: () => set({ isAuthenticated: true }),
  unlockPremium: () => set({ isPremium: true }),
}));
