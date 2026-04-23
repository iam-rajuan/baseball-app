import { apiClient, unwrap } from '@/lib/api-client';
import type { AppSettings, LegalPages } from '@/types';

export const settingsService = {
  async getLegalPages(): Promise<LegalPages> {
    return unwrap<LegalPages>(apiClient.get('/settings/public/legal'));
  },
  async getAppSettings(): Promise<AppSettings> {
    return unwrap<AppSettings>(apiClient.get('/settings/public/app'));
  },
};
