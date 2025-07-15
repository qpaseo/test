import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Camera, BookOpen, Newspaper, Star } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const bannerImages = [
  'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg',
  'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg',
];

const newsData = [
  {
    id: 1,
    title: '개인정보 보호법 개정안 통과',
    summary: '더 강화된 개인정보 보호 규정이 시행됩니다.',
    time: '2시간 전',
  },
  {
    id: 2,
    title: 'SNS 사진 속 개인정보 노출 주의',
    summary: '무심코 올린 사진에서 개인정보가 노출될 수 있습니다.',
    time: '4시간 전',
  },
  {
    id: 3,
    title: '메타데이터 제거의 중요성',
    summary: '사진 메타데이터에 포함된 위치정보를 확인하세요.',
    time: '6시간 전',
  },
];

const quizData = [
  {
    id: 1,
    question: '사진에서 가장 위험한 개인정보는?',
    options: ['얼굴', '주민등록번호', '집 주소', '모든 것'],
    correct: 3,
  },
];

export default function HomeScreen() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [dailyScans, setDailyScans] = useState(2);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const bannerRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => {
        const next = (prev + 1) % bannerImages.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleScanPress = () => {
    if (dailyScans >= 5) {
      alert('일일 검색 한도에 도달했습니다. 퀴즈를 풀어 추가 검색 기회를 얻으세요!');
      return;
    }
    router.push('/scan');
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === quizData[0].correct) {
      setDailyScans(prev => Math.min(prev + 1, 5));
      setTimeout(() => {
        alert('정답입니다! 검색 횟수가 1회 추가되었습니다.');
        setShowQuiz(false);
        setSelectedAnswer(null);
      }, 1000);
    } else {
      setTimeout(() => {
        alert('틀렸습니다. 다시 시도해보세요!');
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const renderBannerItem = ({ item }: { item: string }) => (
    <View style={styles.bannerItem}>
      <Image source={{ uri: item }} style={styles.bannerImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.bannerOverlay}
      >
        <Text style={styles.bannerText}>개인정보를 안전하게 보호하세요</Text>
      </LinearGradient>
    </View>
  );

  const renderNewsItem = ({ item }: { item: typeof newsData[0] }) => (
    <TouchableOpacity 
      style={styles.newsItem}
      onPress={() => Linking.openURL('https://news.google.com/search?q=개인정보보호')}
    >
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsSummary}>{item.summary}</Text>
        <Text style={styles.newsTime}>{item.time}</Text>
      </View>
      <Newspaper size={24} color="#3B82F6" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SnapGuard</Text>
          <Text style={styles.headerSubtitle}>개인정보를 안전하게 보호하세요</Text>
        </View>
        <Shield size={32} color="#3B82F6" />
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <FlatList
          ref={bannerRef}
          data={bannerImages}
          renderItem={renderBannerItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentBanner(index);
          }}
        />
        <View style={styles.bannerIndicators}>
          {bannerImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { backgroundColor: index === currentBanner ? '#3B82F6' : '#E5E7EB' }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Daily Scan Limit */}
      <View style={styles.scanLimitCard}>
        <View style={styles.scanLimitHeader}>
          <Text style={styles.scanLimitTitle}>일일 검색 현황</Text>
          <Text style={styles.scanLimitCount}>{dailyScans}/5</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${(dailyScans / 5) * 100}%` }]} 
          />
        </View>
        <Text style={styles.scanLimitSubtext}>
          {dailyScans < 5 ? `${5 - dailyScans}회 더 검색할 수 있습니다` : '일일 한도에 도달했습니다'}
        </Text>
      </View>

      {/* Main Scan Button */}
      <TouchableOpacity style={styles.mainScanButton} onPress={handleScanPress}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.scanButtonGradient}
        >
          <Camera size={32} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>이미지 개인정보 검색</Text>
          <Text style={styles.scanButtonSubtext}>사진을 선택하거나 촬영하세요</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Quiz Section */}
      <View style={styles.quizSection}>
        <View style={styles.sectionHeader}>
          <BookOpen size={24} color="#3B82F6" />
          <Text style={styles.sectionTitle}>개인정보 퀴즈</Text>
        </View>
        
        {!showQuiz ? (
          <TouchableOpacity 
            style={styles.quizStartButton}
            onPress={() => setShowQuiz(true)}
          >
            <Text style={styles.quizStartText}>퀴즈 풀고 검색 횟수 늘리기</Text>
            <Star size={20} color="#F59E0B" />
          </TouchableOpacity>
        ) : (
          <View style={styles.quizContainer}>
            <Text style={styles.quizQuestion}>{quizData[0].question}</Text>
            {quizData[0].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quizOption,
                  selectedAnswer === index && {
                    backgroundColor: index === quizData[0].correct ? '#10B981' : '#EF4444'
                  }
                ]}
                onPress={() => handleQuizAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <Text style={[
                  styles.quizOptionText,
                  selectedAnswer === index && { color: '#FFFFFF' }
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* News Feed */}
      <View style={styles.newsSection}>
        <View style={styles.sectionHeader}>
          <Newspaper size={24} color="#3B82F6" />
          <Text style={styles.sectionTitle}>개인정보 뉴스</Text>
        </View>
        <FlatList
          data={newsData}
          renderItem={renderNewsItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.newsSeparator} />}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  bannerContainer: {
    height: 200,
    marginBottom: 20,
  },
  bannerItem: {
    width: width,
    height: 200,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scanLimitCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scanLimitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanLimitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scanLimitCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  scanLimitSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  mainScanButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  scanButtonSubtext: {
    color: '#BFDBFE',
    fontSize: 14,
    marginTop: 4,
  },
  quizSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  quizStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  quizStartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  quizContainer: {
    gap: 12,
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  quizOption: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quizOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  newsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  newsSummary: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  newsTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  newsSeparator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});