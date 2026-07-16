import { apiClient, unwrap } from '@/lib/api-client';
import { getCachedImageUri, warmRemoteImages } from '@/lib/image-cache';
import { cachedOrMock, writeCachedValue } from '@/lib/offline-cache';
import { defaultAppSettings, legalPages } from '@/mock/data';
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

const withCachedAppSettingImages = async (settings: AppSettings): Promise<AppSettings> => ({
  ...settings,
  situationImageUri: (await getCachedImageUri(settings.situationImageUri)) || null,
  situationImageUrl: await getCachedImageUri(settings.situationImageUrl),
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
      return cachedOrMock(cacheKeys.legalPages, legalPages);
    }
  },
  async getAppSettings(): Promise<AppSettings | null> {
    try {
      const result = await unwrap<AppSettings>(apiClient.get('/settings/public/app'));
      const cachedResult = await withCachedAppSettingImages(result);
      await writeCachedValue(cacheKeys.appSettings, cachedResult);
      void warmRemoteImages([result.situationImageUri, result.situationImageUrl], {
        forceRefresh: true,
      }).then(async () => {
        const hydratedSettings = await withCachedAppSettingImages(result);
        await writeCachedValue(cacheKeys.appSettings, hydratedSettings);
      });
      return cachedResult ?? null;
    } catch {
      return cachedOrMock(cacheKeys.appSettings, defaultAppSettings);
    }
  },
};
