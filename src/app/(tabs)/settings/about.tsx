import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/components/layout/page-header';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FAF4EA' }}>
      <PageHeader title="About Us" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Logo + Name + Version */}
        <View style={{ alignItems: 'center', paddingTop: 28 }}>
          <View
            style={{
              height: 72,
              width: 72,
              borderRadius: 18,
              backgroundColor: '#0C1F4A',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="baseball" size={36} color="#FFFFFF" />
          </View>

          <Text
            style={{
              marginTop: 16,
              fontSize: 20,
              fontWeight: '800',
              color: '#0C1F4A',
              textAlign: 'center',
            }}
          >
            Marietta Baseball Academy
          </Text>

          <View
            style={{
              marginTop: 10,
              backgroundColor: '#F0ECE4',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: '#6B6050',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Version 2.4.0 Elite
            </Text>
          </View>
        </View>

        {/* Description Card */}
        <View
          style={{
            marginTop: 28,
            marginHorizontal: 20,
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#F0E8DB',
            paddingHorizontal: 24,
            paddingVertical: 28,
          }}
        >
          <Text
            style={{
              fontSize: 15.5,
              lineHeight: 24,
              color: '#3A3F50',
              textAlign: 'center',
              fontWeight: '400',
            }}
          >
            Master the diamond with the most comprehensive tactical simulator designed for elite
            athletes. Baseball Defensive Situations bridges the gap between raw talent and strategic
            mastery, providing real-time positioning feedback for every possible play.
          </Text>
        </View>

        {/* Company Card */}
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 20,
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#F0E8DB',
            paddingHorizontal: 24,
            paddingTop: 22,
            paddingBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '700',
              letterSpacing: 1.5,
              color: '#9CAAC0',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Company
          </Text>
          <Text
            style={{
              fontSize: 19,
              fontWeight: '800',
              color: '#0C1F4A',
              marginBottom: 6,
            }}
          >
            Marietta Baseball Academy, LLC
          </Text>
          <Text style={{ fontSize: 14, color: '#9CAAC0', lineHeight: 20 }}>
            8735 Dunwoody Place #4622
          </Text>
          <Text style={{ fontSize: 14, color: '#9CAAC0', lineHeight: 20 }}>
            Atlanta, GA 30350
          </Text>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#EDE6D9', marginTop: 20, marginBottom: 18 }} />

          {/* Website */}
          <Pressable
            onPress={() => Linking.openURL('https://www.mbaseballacademy.com')}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}
          >
            <Ionicons name="globe-outline" size={18} color="#0C1F4A" />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 14.5,
                fontWeight: '600',
                color: '#0C1F4A',
              }}
            >
              www.mbaseballacademy.com
            </Text>
          </Pressable>

          {/* Email */}
          <Pressable
            onPress={() => Linking.openURL('mailto:support@mbaseballacademy.com')}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="mail-outline" size={18} color="#0C1F4A" />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 14.5,
                fontWeight: '600',
                color: '#0C1F4A',
              }}
            >
              support@mbaseballacademy.com
            </Text>
          </Pressable>
        </View>

        {/* Contact Us Button */}
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <Pressable
            onPress={() => Linking.openURL('mailto:support@mbaseballacademy.com')}
            style={{
              backgroundColor: '#E35D21',
              borderRadius: 28,
              paddingHorizontal: 40,
              paddingVertical: 14,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Contact Us
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: 28 }}>
          <Text
            style={{
              fontSize: 11,
              color: '#B0B8C5',
              textAlign: 'center',
            }}
          >
            © 2024 Marietta Baseball Academy. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
