import { create } from 'zustand';

type AppState = {
  authEmail: string;
  isAuthenticated: boolean;
  isPremium: boolean;
  isSubscriptionReady: boolean;
  otpCode: string;
  isServerReachable: boolean;
  shouldShowServerDownNotice: boolean;
  hydrateSession: (payload: { email: string }) => void;
  clearSession: () => void;
  setAuthEmail: (email: string) => void;
  setOtpCode: (code: string) => void;
  completeAuth: () => void;
  setPremium: (value: boolean) => void;
  setSubscriptionReady: (value: boolean) => void;
  markServerDown: () => void;
  markServerUp: () => void;
  acknowledgeServerDownNotice: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  authEmail: '',
  isAuthenticated: false,
  isPremium: false,
  isSubscriptionReady: false,
  otpCode: '',
  isServerReachable: true,
  shouldShowServerDownNotice: false,
  hydrateSession: ({ email }) =>
    set({
      authEmail: email,
      isAuthenticated: true,
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
  setPremium: (isPremium) => set({ isPremium }),
  setSubscriptionReady: (isSubscriptionReady) => set({ isSubscriptionReady }),
  markServerDown: () =>
    set((state) => ({
      isServerReachable: false,
      shouldShowServerDownNotice: state.isServerReachable ? true : state.shouldShowServerDownNotice,
    })),
  markServerUp: () =>
    set({
      isServerReachable: true,
      shouldShowServerDownNotice: false,
    }),
  acknowledgeServerDownNotice: () => set({ shouldShowServerDownNotice: false }),
}));
