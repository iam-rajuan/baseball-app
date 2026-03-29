import { useMutation, useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { Input } from '@/components/form/input';
import { LogoMark } from '@/components/logo-mark';
import { Screen } from '@/components/layout/screen';
import { SituationArtwork } from '@/components/situation-artwork';
import { queryClient } from '@/lib/query-client';
import { settingsService } from '@/services';
import { useAppStore } from '@/store/app-store';

const menuItems = [
  { label: 'Help & support', route: '/support' as const },
  { label: 'Terms & Conditions', route: '/legal/terms' as const },
  { label: 'Privacy Policy', route: '/legal/privacy' as const },
  { label: 'About Us', route: '/about' as const },
];

export default function ProfileScreen() {
  const authEmail = useAppStore((state) => state.authEmail);
  const isPremium = useAppStore((state) => state.isPremium);
  const { data: appSettings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: settingsService.getAppSettings,
  });
  const [homeEyebrow, setHomeEyebrow] = useState('');
  const [homeTitle, setHomeTitle] = useState('');
  const [homePrimaryCta, setHomePrimaryCta] = useState('');
  const [homeSecondaryCta, setHomeSecondaryCta] = useState('');

  useEffect(() => {
    if (!appSettings) {
      return;
    }

    setHomeEyebrow(appSettings.homeEyebrow);
    setHomeTitle(appSettings.homeTitle);
    setHomePrimaryCta(appSettings.homePrimaryCta);
    setHomeSecondaryCta(appSettings.homeSecondaryCta);
  }, [appSettings]);

  const refreshSettings = async () => {
    await queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    await queryClient.invalidateQueries({ queryKey: ['situations'] });
  };

  const saveCopyMutation = useMutation({
    mutationFn: () =>
      settingsService.updateAppSettings({
        homeEyebrow,
        homeTitle,
        homePrimaryCta,
        homeSecondaryCta,
      }),
    onSuccess: refreshSettings,
  });

  const clearImageMutation = useMutation({
    mutationFn: () => settingsService.clearSituationImage(),
    onSuccess: refreshSettings,
  });

  const uploadImageMutation = useMutation({
    mutationFn: async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        throw new Error('Media library permission was denied.');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled || !result.assets[0]?.uri) {
        return null;
      }

      return settingsService.saveSituationImage(result.assets[0].uri);
    },
    onSuccess: async (result) => {
      if (result) {
        await refreshSettings();
      }
    },
  });

  return (
    <Screen contentClassName="pt-4">
      <View className="flex-row items-center gap-4">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-orange">
          <LogoMark height={58} width={58} />
        </View>
        <View className="flex-1">
          <Text className="text-[42px] font-bold text-orange">Settings</Text>
          <Text className="text-base text-navyMuted">Marietta Baseball Academy</Text>
          <Text className="mt-1 text-sm text-navyMuted">{authEmail || 'guest@academy.com'}</Text>
        </View>
      </View>

      <View className="mt-5">
        <Card>
          <Text className="text-center text-sm uppercase tracking-[1.6px] text-[#A08E73]">Version 0.0.0</Text>
          <Text className="mt-2 text-center text-2xl font-bold text-navy">
            {isPremium ? 'Elite Access Enabled' : 'Free Access'}
          </Text>
        </Card>
      </View>

      <View className="mt-5 gap-3">
        {menuItems.map((item) => (
          <Pressable key={item.label} onPress={() => router.push(item.route)}>
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-navy">{item.label}</Text>
                <Ionicons color="#7A859E" name="chevron-forward" size={22} />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <View className="mt-6">
        <Text className="text-[11px] font-bold uppercase tracking-[1.6px] text-[#A08E73]">
          Admin Dashboard
        </Text>
        <Card>
          <Text className="text-2xl font-bold text-navy">Homepage Content</Text>
          <View className="mt-4 gap-4">
            <Input
              label="Hero Eyebrow"
              onChangeText={setHomeEyebrow}
              placeholder="EVERY PLAYER HAS A ROLE ON EVERY PLAY"
              value={homeEyebrow}
            />
            <Input
              label="Hero Title"
              onChangeText={setHomeTitle}
              placeholder="DEFENSIVE SITUATIONS"
              value={homeTitle}
            />
            <Input
              label="Primary Button"
              onChangeText={setHomePrimaryCta}
              placeholder="FEATURED SITUATIONS"
              value={homePrimaryCta}
            />
            <Input
              label="Secondary Button"
              onChangeText={setHomeSecondaryCta}
              placeholder="SPECIFIC SITUATIONS"
              value={homeSecondaryCta}
            />
            <Button
              label="Save Homepage Copy"
              loading={saveCopyMutation.isPending}
              onPress={() => saveCopyMutation.mutate()}
            />
          </View>
        </Card>
      </View>

      <View className="mt-4">
        <Card>
          <Text className="text-2xl font-bold text-navy">Situation Image</Text>
          <Text className="mt-2 text-sm leading-6 text-navyMuted">
            Upload one situation image from the admin dashboard and it will be used across the home
            page, situations list, and detail screens.
          </Text>
          <View className="mt-4">
            <SituationArtwork
              diagramVariant="infield"
              imageUri={appSettings?.situationImageUri}
              roundedClassName="rounded-[22px]"
            />
          </View>
          <View className="mt-4 gap-3">
            <Button
              label="Upload Situation Image"
              loading={uploadImageMutation.isPending}
              onPress={() => uploadImageMutation.mutate()}
            />
            <Button
              label="Remove Uploaded Image"
              variant="secondary"
              loading={clearImageMutation.isPending}
              onPress={() => clearImageMutation.mutate()}
            />
          </View>
          {uploadImageMutation.error ? (
            <Text className="mt-3 text-sm text-[#C24F33]">
              {uploadImageMutation.error instanceof Error
                ? uploadImageMutation.error.message
                : 'Could not upload image.'}
            </Text>
          ) : null}
        </Card>
      </View>
    </Screen>
  );
}
