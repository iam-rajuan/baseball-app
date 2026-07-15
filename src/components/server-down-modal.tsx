import React from 'react';
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type ServerDownModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ServerDownModal({ visible, onClose }: ServerDownModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={StyleSheet.absoluteFill}>
        {/* Blurred background backdrop */}
        <BlurView
          intensity={30}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        
        {/* Semi-transparent overlay color over the blur for better text readability */}
        <View className="flex-1 items-center justify-center bg-navy/40 px-6">
          <View className="w-full max-w-[340px] items-center rounded-4xl border border-border bg-surface p-6 shadow-card">
            
            {/* Soft background warning icon circle */}
            <View className="h-16 w-16 items-center justify-center rounded-full bg-orangeSoft">
              <Ionicons name="cloud-offline" size={32} color="#F46A12" />
            </View>

            {/* Title */}
            <Text className="mt-5 text-center text-xl font-bold tracking-[0.2px] text-navy">
              Server Offline
            </Text>

            {/* Description */}
            <Text className="mt-3 mb-6 text-center text-sm leading-relaxed text-navyMuted">
              The app is running with saved offline data. You can browse everything normally, but updates will not work until the server comes back.
            </Text>

            {/* Action button */}
            <Pressable
              onPress={onClose}
              className="w-full items-center justify-center rounded-full bg-orange py-3.5 px-6 active:opacity-90"
              style={({ pressed }) => pressed && { opacity: 0.9 }}
            >
              <Text className="text-base font-semibold tracking-[0.6px] text-surface">
                Continue Offline
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
