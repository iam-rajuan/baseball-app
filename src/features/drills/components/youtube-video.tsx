import { useState } from 'react';
import type { ComponentType } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { WebViewProps } from 'react-native-webview';

import { colors } from '@/constants/theme';
import { extractYouTubeVideoId } from '@/features/drills/youtube';

type YouTubeVideoProps = {
  url?: string | null;
};

let cachedWebView: ComponentType<WebViewProps> | null | undefined;

export const getYouTubeWebView = () => {
  if (cachedWebView !== undefined) return cachedWebView;

  try {
    cachedWebView = require('react-native-webview').WebView as ComponentType<WebViewProps>;
  } catch {
    cachedWebView = null;
  }

  return cachedWebView;
};

export const YouTubeVideo = ({ url }: YouTubeVideoProps) => {
  const videoId = extractYouTubeVideoId(url);
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedBlocked, setEmbedBlocked] = useState(false);
  const WebView = getYouTubeWebView();

  if (!videoId || !WebView || hasError) return null;

  const videoWidth = Math.max(width - 40, 0);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    '?playsinline=1&rel=0&modestbranding=1' +
    '&origin=https%3A%2F%2Fwww.youtube-nocookie.com' +
    '&widget_referrer=https%3A%2F%2Fwww.youtube-nocookie.com%2F';
  const detectYouTubeErrorScript = `
    (function detectYouTubeError() {
      var text = document.body && document.body.innerText ? document.body.innerText : '';
      if (/Error code:\\s*(15|150|152|153)|This video is unavailable|Video player configuration error/i.test(text)) {
        window.ReactNativeWebView.postMessage('youtube-embed-blocked');
      }
      setTimeout(detectYouTubeError, 1000);
    })();
    true;
  `;

  if (embedBlocked) {
    return (
      <Pressable
        accessibilityRole="button"
        className="overflow-hidden rounded-[18px] bg-black"
        onPress={() => {
          void Linking.openURL(watchUrl);
        }}
        style={{ width: videoWidth, height: videoWidth * 0.5625 }}
      >
        <ImageBackground
          resizeMode="cover"
          source={{ uri: thumbnailUrl }}
          className="h-full w-full items-center justify-center"
        >
          <View className="absolute inset-0 bg-black/45" />
          <View className="h-14 w-14 items-center justify-center rounded-full bg-white/90">
            <View className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-[#0C1F4A]" />
          </View>
          <Text className="mt-3 text-sm font-bold text-white">Watch on YouTube</Text>
        </ImageBackground>
      </Pressable>
    );
  }

  return (
    <View
      className="overflow-hidden rounded-[18px] bg-black"
      style={{ width: videoWidth, height: videoWidth * 0.5625 }}
    >
      <WebView
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        androidLayerType="hardware"
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction
        injectedJavaScript={detectYouTubeErrorScript}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'youtube-embed-blocked') {
            setEmbedBlocked(true);
          }
        }}
        onError={() => setHasError(true)}
        onHttpError={() => setHasError(true)}
        onLoadEnd={() => setIsLoading(false)}
        originWhitelist={['https://*']}
        scrollEnabled={false}
        source={{
          uri: embedUrl,
          headers: {
            Referer: 'https://www.youtube-nocookie.com/',
          },
        }}
        style={{ backgroundColor: 'black' }}
        userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      />
      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center bg-black">
          <ActivityIndicator color={colors.orange} />
        </View>
      ) : null}
    </View>
  );
};
