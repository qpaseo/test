import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import {
  User,
  Settings,
  Moon,
  Sun,
  Instagram,
  Shield,
  LogOut,
  Bell,
  CircleHelp as HelpCircle,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [instagramAutoShare, setInstagramAutoShare] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => {
          // 실제 구현에서는 Firebase Auth 로그아웃 처리
          console.log('로그아웃 처리');
        },
      },
    ]);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    rightComponent,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={32} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>사용자</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>검색 완료</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>남은 검색</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>평균 점수</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Settings */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>앱 설정</Text>

        <View style={styles.settingsGroup}>
          <SettingItem
            icon={
              isDarkMode ? (
                <Moon size={20} color="#3B82F6" />
              ) : (
                <Sun size={20} color="#3B82F6" />
              )
            }
            title="다크 모드"
            subtitle={isDarkMode ? '어두운 테마 사용 중' : '밝은 테마 사용 중'}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />

          <SettingItem
            icon={<Instagram size={20} color="#3B82F6" />}
            title="Instagram 자동 공유"
            subtitle="점수 80점 이상 시 자동으로 스토리에 공유"
            rightComponent={
              <Switch
                value={instagramAutoShare}
                onValueChange={setInstagramAutoShare}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={instagramAutoShare ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />

          <SettingItem
            icon={<Bell size={20} color="#3B82F6" />}
            title="푸시 알림"
            subtitle="검색 결과 및 중요 알림 받기"
            rightComponent={
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={pushNotifications ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
        </View>

        <Text style={styles.sectionTitle}>개인정보 보호</Text>

        <View style={styles.settingsGroup}>
          <SettingItem
            icon={<Shield size={20} color="#3B82F6" />}
            title="개인정보 처리방침"
            subtitle="데이터 처리 및 보호 정책 확인"
            onPress={() =>
              Alert.alert(
                '개인정보 처리방침',
                '개인정보 처리방침 페이지로 이동합니다.'
              )
            }
          />

          <SettingItem
            icon={<Settings size={20} color="#3B82F6" />}
            title="데이터 관리"
            subtitle="저장된 데이터 확인 및 삭제"
            onPress={() =>
              Alert.alert('데이터 관리', '데이터 관리 페이지로 이동합니다.')
            }
          />
        </View>

        <Text style={styles.sectionTitle}>지원</Text>

        <View style={styles.settingsGroup}>
          <SettingItem
            icon={<HelpCircle size={20} color="#3B82F6" />}
            title="도움말"
            subtitle="앱 사용법 및 FAQ"
            onPress={() => Alert.alert('도움말', '도움말 페이지로 이동합니다.')}
          />

          <SettingItem
            icon={<Star size={20} color="#3B82F6" />}
            title="앱 평가하기"
            subtitle="앱스토어에서 평가 남기기"
            onPress={() => Alert.alert('앱 평가', '앱스토어로 이동합니다.')}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>SnapGuard v1.0.0</Text>
        <Text style={styles.appDescription}>
          개인정보를 안전하게 보호하는 이미지 검색 앱
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#BFDBFE',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#BFDBFE',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  settingsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 24,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
