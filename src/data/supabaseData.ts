export interface SupabasePlan {
  id: string;
  name: string;
  description: string;
  pricePerUnit: number;
}

export interface SupabaseStorage {
  id: string;
  name: string;
  description: string;
  pricePerGB: number;
}

export interface SupabaseFeature {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const supabasePlans: SupabasePlan[] = [
  {
    id: "pro",
    name: "Pro Plan",
    description: "프로덕션 환경을 위한 유료 요금제 (8$/project/month 기준)",
    pricePerUnit: 8.0,
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "맞춤형 요구사항에 따른 엔터프라이즈 요금제 (예상-상담필요)",
    pricePerUnit: 100.0,
  },
];

export const supabaseStorageOptions: SupabaseStorage[] = [
  {
    id: "standard",
    name: "Standard Storage",
    description: "기본 파일 저장소",
    pricePerGB: 0.021,
  },
  {
    id: "redundant",
    name: "Redundant Storage",
    description: "내구성이 더 높은 고가용성 스토리지",
    pricePerGB: 0.03,
  },
];

export const supabaseFeatures: SupabaseFeature[] = [
  {
    id: "auth",
    name: "Supabase Auth",
    description: "JWT 기반 사용자 인증 및 권한 관리",
    price: 10.0,
  },
  {
    id: "realtime",
    name: "Realtime",
    description: "웹소켓 기반의 실시간 데이터 스트리밍",
    price: 12.0,
  },
  {
    id: "edge-functions",
    name: "Edge Functions",
    description: "V8 런타임 기반의 서버리스 함수",
    price: 15.0,
  },
  {
    id: "storage",
    name: "Advanced Storage",
    description: "스토리지 보안 정책 및 접근 제어 포함",
    price: 7.0,
  },
  {
    id: "dashboard-role",
    name: "Custom Dashboard Roles",
    description: "사용자 정의 역할 및 권한 설정",
    price: 5.0,
  },
];
