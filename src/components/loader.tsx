import { ActivityIndicator, View } from 'react-native';

export function Loader() {
  return (
    <View className="items-center justify-center py-10">
      <ActivityIndicator color="#F46A12" size="large" />
    </View>
  );
}
