import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';

import { defaultAppSettings, legalPages } from '@/mock/data';
import { delay } from '@/utils/delay';

const SETTINGS_KEY = 'mba-app-settings';
const IMAGE_DIRECTORY = `${FileSystem.documentDirectory ?? ''}admin-settings/`;

async function writeSettings(settings: typeof defaultAppSettings) {
  await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
}

export const settingsService = {
  async getLegalPages() {
    await delay();
    return legalPages;
  },
  async getAppSettings() {
    await delay(150);
    const stored = await SecureStore.getItemAsync(SETTINGS_KEY);

    if (!stored) {
      return defaultAppSettings;
    }

    try {
      return {
        ...defaultAppSettings,
        ...JSON.parse(stored),
      };
    } catch {
      return defaultAppSettings;
    }
  },
  async updateAppSettings(updates: Partial<typeof defaultAppSettings>) {
    const current = await this.getAppSettings();
    const next = { ...current, ...updates };
    await writeSettings(next);
    return next;
  },
  async saveSituationImage(sourceUri: string) {
    if (!FileSystem.documentDirectory) {
      return this.updateAppSettings({ situationImageUri: sourceUri });
    }

    const extension = sourceUri.split('.').pop()?.split('?')[0] || 'jpg';
    const destination = `${IMAGE_DIRECTORY}situation-image.${extension}`;

    await FileSystem.makeDirectoryAsync(IMAGE_DIRECTORY, { intermediates: true }).catch(() => null);
    await FileSystem.deleteAsync(destination, { idempotent: true }).catch(() => null);
    await FileSystem.copyAsync({ from: sourceUri, to: destination });

    return this.updateAppSettings({ situationImageUri: destination });
  },
  async clearSituationImage() {
    const current = await this.getAppSettings();

    if (current.situationImageUri?.startsWith(IMAGE_DIRECTORY)) {
      await FileSystem.deleteAsync(current.situationImageUri, { idempotent: true }).catch(() => null);
    }

    return this.updateAppSettings({ situationImageUri: null });
  },
};
