export const firebasePlans = [
  {
    id: "blaze",
    name: "Blaze Plan (종량제)",
    description: "확장 가능한 프로덕션 환경을 위한 종량제 요금제",
    pricePerUnit: 25.0,
  },
];

export const firebaseStorageOptions = [
  {
    id: "standard",
    name: "Cloud Storage Standard",
    description: "일반적인 저장소 요구에 적합한 표준 스토리지",
    pricePerGB: 0.026,
  },
  {
    id: "multi-region",
    name: "Cloud Storage Multi-Region",
    description: "전 세계 어디서나 빠른 접근이 필요한 경우",
    pricePerGB: 0.05,
  },
];

export const firebaseFeatures = [
  {
    id: "auth",
    name: "Firebase Authentication",
    description: "이메일/소셜 로그인, 전화 인증 등 사용자 인증 기능",
    price: 10.0,
  },
  {
    id: "functions",
    name: "Cloud Functions",
    description: "서버리스 백엔드 로직 실행",
    price: 15.0,
  },
  {
    id: "firestore",
    name: "Cloud Firestore",
    description: "실시간 NoSQL 데이터베이스",
    price: 20.0,
  },
  {
    id: "realtime-db",
    name: "Realtime Database",
    description: "실시간 데이터 동기화 서비스",
    price: 18.0,
  },
  {
    id: "hosting",
    name: "Firebase Hosting",
    description: "정적 웹사이트 및 SPA 배포",
    price: 5.0,
  },
];
