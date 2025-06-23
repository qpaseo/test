export const virtualMachines = [
  {
    id: "b1s",
    name: "B1s (1vCPU, 1GB RAM)",
    description: "가벼운 웹 애플리케이션 및 개발 환경",
    pricePerUnit: 0.0104,
  },
  {
    id: "b2s",
    name: "B2s (2vCPU, 4GB RAM)",
    description: "중소규모 웹 서버 및 개발/테스트 환경",
    pricePerUnit: 0.0416,
  },
  {
    id: "d2sv3",
    name: "D2s v3 (2vCPU, 8GB RAM)",
    description: "프로덕션 워크로드 및 애플리케이션 서버",
    pricePerUnit: 0.096,
  },
  {
    id: "d4sv3",
    name: "D4s v3 (4vCPU, 16GB RAM)",
    description: "대규모 애플리케이션 및 데이터베이스",
    pricePerUnit: 0.192,
  },
  {
    id: "e2sv3",
    name: "E2s v3 (2vCPU, 16GB RAM)",
    description: "메모리 집약적 워크로드에 최적화",
    pricePerUnit: 0.133,
  },
  {
    id: "e4sv3",
    name: "E4s v3 (4vCPU, 32GB RAM)",
    description: "대규모 인메모리 데이터베이스 및 분석",
    pricePerUnit: 0.266,
  },
];

export const storageOptions = [
  {
    id: "standard_hdd",
    name: "Standard HDD",
    description: "개발/테스트 환경을 위한 경제적인 스토리지",
    pricePerGB: 0.04,
  },
  {
    id: "standard_ssd",
    name: "Standard SSD",
    description: "일반적인 워크로드를 위한 SSD 스토리지",
    pricePerGB: 0.08,
  },
  {
    id: "premium_ssd",
    name: "Premium SSD",
    description: "프로덕션 환경을 위한 고성능 스토리지",
    pricePerGB: 0.17,
  },
  {
    id: "ultra_disk",
    name: "Ultra Disk",
    description: "최고 성능이 필요한 중요 워크로드용",
    pricePerGB: 0.24,
  },
];

export const additionalServices = [
  {
    id: "load_balancer",
    name: "Load Balancer",
    description: "트래픽 분산 및 고가용성 구성",
    price: 18.0,
  },
  {
    id: "app_insights",
    name: "Application Insights",
    description: "애플리케이션 성능 모니터링 및 분석",
    price: 12.0,
  },
  {
    id: "azure_backup",
    name: "Azure Backup",
    description: "자동화된 백업 및 복구 관리",
    price: 22.0,
  },
  {
    id: "azure_firewall",
    name: "Azure Firewall",
    description: "네트워크 보안 및 위협 방지",
    price: 32.0,
  },
  {
    id: "key_vault",
    name: "Key Vault",
    description: "암호화 키 및 비밀 관리",
    price: 15.0,
  },
  {
    id: "ddos_protection",
    name: "DDoS Protection",
    description: "DDoS 공격 방어 및 네트워크 보호",
    price: 28.0,
  },
];
