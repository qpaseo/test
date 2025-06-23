export const computeInstances = [
  {
    id: "e2-micro",
    name: "E2 Micro (2vCPU, 1GB RAM)",
    description: "소규모 웹 애플리케이션 및 개발 환경",
    pricePerUnit: 0.0076,
  },
  {
    id: "e2-small",
    name: "E2 Small (2vCPU, 2GB RAM)",
    description: "개발/테스트 서버 및 소규모 서비스",
    pricePerUnit: 0.0152,
  },
  {
    id: "e2-medium",
    name: "E2 Medium (2vCPU, 4GB RAM)",
    description: "중간 규모의 웹 서버 및 애플리케이션",
    pricePerUnit: 0.0304,
  },
  {
    id: "n2-standard-2",
    name: "N2 Standard-2 (2vCPU, 8GB RAM)",
    description: "프로덕션 워크로드 및 데이터베이스",
    pricePerUnit: 0.0971,
  },
  {
    id: "n2-standard-4",
    name: "N2 Standard-4 (4vCPU, 16GB RAM)",
    description: "고성능 애플리케이션 및 데이터 처리",
    pricePerUnit: 0.1942,
  },
  {
    id: "n2-standard-8",
    name: "N2 Standard-8 (8vCPU, 32GB RAM)",
    description: "대규모 워크로드 및 분산 처리",
    pricePerUnit: 0.3885,
  },
];

export const storageOptions = [
  {
    id: "standard",
    name: "Standard Persistent Disk",
    description: "일반적인 워크로드를 위한 기본 스토리지",
    pricePerGB: 0.04,
  },
  {
    id: "balanced",
    name: "Balanced Persistent Disk",
    description: "비용과 성능이 균형잡힌 SSD 스토리지",
    pricePerGB: 0.1,
  },
  {
    id: "ssd",
    name: "SSD Persistent Disk",
    description: "고성능 데이터베이스 및 트랜잭션 처리용",
    pricePerGB: 0.17,
  },
  {
    id: "extreme",
    name: "Extreme Persistent Disk",
    description: "최고 성능이 필요한 중요 워크로드용",
    pricePerGB: 0.25,
  },
];

export const additionalServices = [
  {
    id: "load_balancing",
    name: "Cloud Load Balancing",
    description: "글로벌 로드 밸런싱 및 트래픽 분산",
    price: 18.0,
  },
  {
    id: "cloud_monitoring",
    name: "Cloud Monitoring",
    description: "인프라 및 애플리케이션 모니터링",
    price: 12.0,
  },
  {
    id: "cloud_sql",
    name: "Cloud SQL",
    description: "관리형 MySQL, PostgreSQL 데이터베이스",
    price: 35.0,
  },
  {
    id: "vpc_network",
    name: "Premium VPC Network",
    description: "고급 네트워크 기능 및 보안",
    price: 20.0,
  },
  {
    id: "cloud_armor",
    name: "Cloud Armor",
    description: "DDoS 보호 및 웹 애플리케이션 방화벽",
    price: 25.0,
  },
  {
    id: "cloud_cdn",
    name: "Cloud CDN",
    description: "글로벌 콘텐츠 전송 네트워크",
    price: 15.0,
  },
];
