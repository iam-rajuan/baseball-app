import * as SecureStore from 'expo-secure-store';

import { apiClient, unwrap } from '@/lib/api-client';
import type { UserProfile } from '@/types';

const TOKEN_KEY = 'mba-auth-token';

type SendCodeResponse = {
  email: string;
  maskedEmail: string;
  expiresInMinutes: number;
};

type VerifyCodeResponse = {
  token: string;
  user: UserProfile;
};

export const authService = {
  async sendCode(email: string): Promise<SendCodeResponse> {
    return unwrap<SendCodeResponse>(
      apiClient.post('/auth/app/send-otp', {
        email,
      }),
    );
  },
  async verifyCode(email: string, code: string): Promise<VerifyCodeResponse> {
    const result = await unwrap<VerifyCodeResponse>(
      apiClient.post('/auth/app/verify-otp', {
        email,
        code,
      }),
    );

    await SecureStore.setItemAsync(TOKEN_KEY, result.token);
    return result;
  },
  async getStoredToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async clearStoredToken() {
    return SecureStore.deleteItemAsync(TOKEN_KEY);
  },
  async getProfile(): Promise<UserProfile> {
    return unwrap<UserProfile>(apiClient.get('/auth/app/me'));
  },
};
