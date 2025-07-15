import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, Image as ImageIcon, Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnalysisResult {
  score: number;
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
}

export default function ScanScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 실제 구현에서는 Firebase Functions를 통해 AI 분석 API 호출
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        score: Math.floor(Math.random() * 40) + 60, // 60-100 점수
        issues: [
          {
            type: '얼굴 인식',
            severity: 'high',
            description: '사진에서 얼굴이 감지되었습니다.',
          },
          {
            type: '텍스트 정보',
            severity: 'medium',
            description: '이미지에 텍스트가 포함되어 있습니다.',
          },
          {
            type: '위치 메타데이터',
            severity: 'low',
            description: 'GPS 위치 정보가 포함되어 있을 수 있습니다.',
          },
        ],
      };

      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      setShowResult(true);
      
      // 결과에 따른 햅틱 피드백
      if (mockResult.score >= 80) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (mockResult.score >= 60) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle size={16} color="#EF4444" />;
      case 'medium': return <AlertTriangle size={16} color="#F59E0B" />;
      case 'low': return <CheckCircle size={16} color="#10B981" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Shield size={32} color="#3B82F6" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>이미지 개인정보 검색</Text>
          <Text style={styles.headerSubtitle}>사진의 개인정보를 안전하게 확인하세요</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Selection */}
        {!selectedImage ? (
          <View style={styles.imageSelectionContainer}>
            <View style={styles.placeholderContainer}>
              <ImageIcon size={64} color="#9CA3AF" />
              <Text style={styles.placeholderText}>이미지를 선택하거나 촬영하세요</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                <ImageIcon size={24} color="#3B82F6" />
                <Text style={styles.actionButtonText}>갤러리에서 선택</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
                <Camera size={24} color="#3B82F6" />
                <Text style={styles.actionButtonText}>카메라로 촬영</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            
            <View style={styles.imageActions}>
              <TouchableOpacity 
                style={styles.changeImageButton} 
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.changeImageText}>다른 이미지 선택</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
                onPress={analyzeImage}
                disabled={isAnalyzing}
              >
                <LinearGradient
                  colors={isAnalyzing ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1D4ED8']}
                  style={styles.analyzeButtonGradient}
                >
                  <Text style={styles.analyzeButtonText}>
                    {isAnalyzing ? '분석 중...' : '개인정보 검색 시작'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Analysis Result Modal */}
        <Modal
          visible={showResult}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowResult(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>분석 결과</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowResult(false)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>

            {analysisResult && (
              <ScrollView style={styles.modalContent}>
                {/* Score */}
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>개인정보 보호 점수</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(analysisResult.score) }]}>
                    {analysisResult.score}/100
                  </Text>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreBarFill, 
                        { 
                          width: `${analysisResult.score}%`,
                          backgroundColor: getScoreColor(analysisResult.score)
                        }
                      ]} 
                    />
                  </View>
                </View>

                {/* Issues */}
                <View style={styles.issuesContainer}>
                  <Text style={styles.issuesTitle}>발견된 개인정보 항목</Text>
                  {analysisResult.issues.map((issue, index) => (
                    <View key={index} style={styles.issueItem}>
                      <View style={styles.issueHeader}>
                        {getSeverityIcon(issue.severity)}
                        <Text style={styles.issueType}>{issue.type}</Text>
                        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(issue.severity) }]}>
                          <Text style={styles.severityText}>
                            {issue.severity === 'high' ? '높음' : 
                             issue.severity === 'medium' ? '보통' : '낮음'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.issueDescription}>{issue.description}</Text>
                    </View>
                  ))}
                </View>

                {/* Recommendations */}
                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>권장사항</Text>
                  <View style={styles.recommendationItem}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.recommendationText}>
                      {analysisResult.score >= 80 
                        ? '안전한 이미지입니다. 공유해도 좋습니다.'
                        : '개인정보를 제거한 후 공유하는 것을 권장합니다.'}
                    </Text>
                  </View>
                </View>

                {/* Share Button */}
                {analysisResult.score >= 80 && (
                  <TouchableOpacity style={styles.shareButton}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.shareButtonGradient}
                    >
                      <Text style={styles.shareButtonText}>Instagram 스토리에 공유</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageSelectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  placeholderContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  selectedImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  imageActions: {
    gap: 12,
  },
  changeImageButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeImageText: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  analyzeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  analyzeButtonDisabled: {
    opacity: 0.7,
  },
  analyzeButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  scoreContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  issuesContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  issuesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  issueItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  issueType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  issueDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recommendationsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  shareButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});