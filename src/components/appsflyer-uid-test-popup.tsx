import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SHOW_APPSFLYER_UID_TEST_POPUP } from '@/config/temporary-testing';
import { getAppsFlyerUidAfterInit } from '@/services/appsflyer-service';

type RetrievalState = 'loading' | 'success' | 'error';

const formatError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

// TEMPORARY APPSFLYER TESTFLIGHT UID POPUP
export function AppsFlyerUidTestPopup() {
  const [state, setState] = useState<RetrievalState>('loading');
  const [uid, setUid] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const shouldShow = Platform.OS === 'ios' && SHOW_APPSFLYER_UID_TEST_POPUP;

  const retrieveUid = useCallback(async () => {
    if (!shouldShow) {
      return;
    }

    setState('loading');
    setErrorMessage('');
    setCopyMessage('');

    try {
      const nextUid = await getAppsFlyerUidAfterInit();
      setUid(nextUid);
      setState('success');
    } catch (error) {
      setErrorMessage(formatError(error));
      setState('error');
    }
  }, [shouldShow]);

  useEffect(() => {
    void retrieveUid();
  }, [retrieveUid]);

  const copyUid = useCallback(async () => {
    if (!uid) {
      return;
    }

    await Clipboard.setStringAsync(uid);
    setCopyMessage('UID copied');
  }, [uid]);

  if (!shouldShow) {
    return null;
  }

  const message =
    state === 'success'
      ? uid
      : state === 'error'
        ? 'AppsFlyer UID retrieval failed.'
        : 'Retrieving AppsFlyer UID...';

  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible
      onRequestClose={() => null}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>AppsFlyer Test UID</Text>

          {state === 'loading' && <ActivityIndicator color="#F46A12" style={styles.spinner} />}

          <Text selectable={state === 'success'} style={styles.message}>
            {message}
          </Text>

          {state === 'success' && (
            <>
              <Text style={styles.helper}>Copy this UID and send it to the developer.</Text>
              <Pressable accessibilityRole="button" onPress={copyUid} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Copy UID</Text>
              </Pressable>
              {!!copyMessage && <Text style={styles.confirmation}>{copyMessage}</Text>}
            </>
          )}

          {state === 'error' && (
            <>
              {!!errorMessage && (
                <Text selectable style={styles.errorDetails}>
                  {errorMessage}
                </Text>
              )}
              <Pressable accessibilityRole="button" onPress={retrieveUid} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Retry</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(12, 31, 74, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxWidth: 420,
    paddingHorizontal: 22,
    paddingVertical: 24,
    width: '100%',
  },
  confirmation: {
    color: '#1C9C5C',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  errorDetails: {
    backgroundColor: '#F2EEE6',
    borderRadius: 8,
    color: '#5A6987',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
    padding: 12,
  },
  helper: {
    color: '#5A6987',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
    textAlign: 'center',
  },
  message: {
    color: '#0C1F4A',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: 16,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#F46A12',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  spinner: {
    marginTop: 18,
  },
  title: {
    color: '#0C1F4A',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    textAlign: 'center',
  },
});
