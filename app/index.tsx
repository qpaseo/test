import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield } from 'lucide-react-native';

export default function SplashScreen() {
  useEffect(() => {
    // 실제 구현에서는 Firebase Auth 상태 확인
    const timer = setTimeout(() => {
      // 로그인 상태에 따라 분기
      const isLoggedIn = false; // Firebase Auth 상태 확인
      
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#3B82F6', '#1D4ED8']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Shield size={80} color="#FFFFFF" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});