import { apiClient, unwrap } from '@/lib/api-client';
import { readCachedValue, writeCachedValue } from '@/lib/offline-cache';
import type { AppSettings, LegalPages } from '@/types';

const cacheKeys = {
  appSettings: 'settings:app',
  legalPages: 'settings:legal',
};

const htmlToText = (value: string) =>
  value
    .replace(/<\/(p|li|h[1-6]|blockquote)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n\n');

const normalizeLegalPages = (pages: LegalPages): LegalPages => ({
  ...pages,
  aboutUs: {
    ...pages.aboutUs,
    body: htmlToText(pages.aboutUs.body),
  },
});

export const settingsService = {
  async getLegalPages(): Promise<LegalPages | null> {
    try {
      const result = normalizeLegalPages(
        await unwrap<LegalPages>(apiClient.get('/settings/public/legal')),
      );
      await writeCachedValue(cacheKeys.legalPages, result);
      return result ?? null;
    } catch {
      const cached = await readCachedValue<LegalPages>(cacheKeys.legalPages);
      return cached ?? null;
    }
  },
  async getAppSettings(): Promise<AppSettings | null> {
    try {
      const result = await unwrap<AppSettings>(apiClient.get('/settings/public/app'));
      await writeCachedValue(cacheKeys.appSettings, result);
      return result ?? null;
    } catch {
      const cached = await readCachedValue<AppSettings>(cacheKeys.appSettings);
      return cached ?? null;
    }
  },
};
