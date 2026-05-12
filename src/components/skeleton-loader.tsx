import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type SkeletonLoaderProps = {
  message?: string;
};

export function SkeletonLoader({ message = 'Loading data...' }: SkeletonLoaderProps) {
  const shimmer = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, {
        duration: 1450,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      false,
    );

    pulse.value = withRepeat(
      withTiming(1, {
        duration: 1150,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );
  }, [pulse, shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-180, 360]) }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.72, 1]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.995, 1]) }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.messagePill, pulseStyle]}>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
      <SkeletonBlock style={styles.smallTitle} shimmerStyle={shimmerStyle} />
      <SkeletonBlock style={styles.mediumTitle} shimmerStyle={shimmerStyle} />
      <SkeletonBlock style={styles.heroCard} shimmerStyle={shimmerStyle} />
      <SkeletonBlock style={styles.listCard} shimmerStyle={shimmerStyle} />
      <SkeletonBlock style={styles.listCard} shimmerStyle={shimmerStyle} />
      <SkeletonBlock style={styles.bottomCard} shimmerStyle={shimmerStyle} />
    </View>
  );
}

type SkeletonBlockProps = {
  style: object;
  shimmerStyle: object;
};

function SkeletonBlock({ style, shimmerStyle }: SkeletonBlockProps) {
  return (
    <Animated.View style={[styles.block, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.72)', 'rgba(255,255,255,0)']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  messagePill: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFF7ED',
    shadowColor: '#F46A12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 2,
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#5A4B3D',
  },
  block: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  smallTitle: {
    height: 26,
    width: '45%',
    borderRadius: 999,
    backgroundColor: '#E7D8C4',
  },
  mediumTitle: {
    height: 42,
    width: '78%',
    borderRadius: 14,
    backgroundColor: '#E0CDB5',
  },
  heroCard: {
    height: 160,
    borderRadius: 24,
  },
  listCard: {
    height: 92,
    borderRadius: 20,
  },
  bottomCard: {
    height: 132,
    borderRadius: 24,
  },
});
