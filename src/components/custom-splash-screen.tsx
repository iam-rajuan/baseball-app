import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { LogoMark } from './logo-mark';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH * 0.55;
const BAR_HEIGHT = 4;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const splashBg = require('../../assets/images/splash-bg.png');

type CustomSplashScreenProps = {
  onFinish?: () => void;
};

export function CustomSplashScreen({ onFinish }: CustomSplashScreenProps) {
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.85);
  const barProgress = useSharedValue(0);
  const barOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.back(1.2)),
    });

    // Bar fade-in
    barOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));

    // Bar fill animation: 0→100% over 2.5s
    barProgress.value = withDelay(
      500,
      withTiming(1, {
        duration: 2500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    );
  }, [barOpacity, barProgress, logoOpacity, logoScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const barTrackAnimatedStyle = useAnimatedStyle(() => ({
    opacity: barOpacity.value,
  }));

  const barFillAnimatedStyle = useAnimatedStyle(() => ({
    width: `${barProgress.value * 100}%`,
  }));

  return (
    <View style={styles.root}>
      {/* Background image with baseball seam watermark */}
      <Image source={splashBg} style={styles.bgImage} resizeMode="cover" />

      {/* Logo */}
      <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
        <LogoMark width={160} height={155} />
      </Animated.View>

      {/* Animated loading bar */}
      <Animated.View style={[styles.barTrack, barTrackAnimatedStyle]}>
        <Animated.View style={[styles.barFill, barFillAnimatedStyle]}>
          <LinearGradient
            colors={['#FF914D', '#FFB347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A1B40',
    zIndex: 999,
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  barTrack: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.18,
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
});
