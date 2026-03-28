import * as SecureStore from 'expo-secure-store';

import { delay } from '@/utils/delay';

const TOKEN_KEY = 'mba-auth-token';

export const authService = {
  async sendCode(email: string) {
    await delay(500);
    return { email, sent: true };
  },
  async verifyCode(email: string, code: string) {
    await delay(500);
    const token = `${email}:${code}:mock-token`;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    return { token };
  },
  async getStoredToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
};
