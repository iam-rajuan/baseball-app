import { useQuery } from '@tanstack/react-query';
import { ScrollView, Text, View } from 'react-native';

import { Loader } from '@/components/loader';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { settingsService } from '@/services';

export default function PrivacyPolicyScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['legal-pages'],
    queryFn: settingsService.getLegalPages,
  });

  return (
    <Screen header={<PageHeader title="Privacy Policy" variant="section" />}>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView
          style={{ backgroundColor: '#F4E7D5' }}
          contentContainerStyle={{ padding: 20, paddingBottom: 60, backgroundColor: '#F4E7D5' }}
          showsVerticalScrollIndicator={false}
        >
          {(data?.privacyPolicy ?? []).map((item, index) => (
            <View key={`${index}-${item}`} className="mb-6 flex-row">
              <Text className="text-base leading-6 text-[#5A4B3D]">{index + 1}. </Text>
              <Text className="pr-4 text-base leading-6 text-[#5A4B3D]">
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
