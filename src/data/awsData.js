export const instances = [
  {
    id: "t2.micro",
    name: "t2.micro (1vCPU, 1GB RAM)",
    description: "개발 및 테스트 환경에 적합한 저비용 인스턴스",
    pricePerUnit: 0.0116,
  },
  {
    id: "t2.small",
    name: "t2.small (1vCPU, 2GB RAM)",
    description: "소규모 웹 애플리케이션 및 개발 서버",
    pricePerUnit: 0.023,
  },
  {
    id: "t2.medium",
    name: "t2.medium (2vCPU, 4GB RAM)",
    description: "중간 규모의 웹 서버 및 개발 환경",
    pricePerUnit: 0.0464,
  },
  {
    id: "t2.large",
    name: "t2.large (2vCPU, 8GB RAM)",
    description: "데이터베이스 서버 및 프로덕션 워크로드",
    pricePerUnit: 0.0928,
  },
  {
    id: "m5.large",
    name: "m5.large (2vCPU, 8GB RAM)",
    description: "고성능 컴퓨팅이 필요한 프로덕션 환경",
    pricePerUnit: 0.096,
  },
  {
    id: "m5.xlarge",
    name: "m5.xlarge (4vCPU, 16GB RAM)",
    description: "대규모 애플리케이션 및 고성능 워크로드",
    pricePerUnit: 0.192,
  },
];

export const storageOptions = [
  {
    id: "gp2",
    name: "General Purpose SSD (gp2)",
    description: "대부분의 워크로드에 적합한 균형 잡힌 성능과 비용",
    pricePerGB: 0.1,
  },
  {
    id: "gp3",
    name: "General Purpose SSD (gp3)",
    description: "gp2보다 더 나은 성능과 비용 효율성 제공",
    pricePerGB: 0.08,
  },
  {
    id: "io1",
    name: "Provisioned IOPS SSD (io1)",
    description: "데이터베이스 등 고성능이 필요한 워크로드용",
    pricePerGB: 0.125,
  },
  {
    id: "st1",
    name: "Throughput Optimized HDD (st1)",
    description: "빅데이터, 로그 처리 등 대용량 처리에 적합",
    pricePerGB: 0.045,
  },
];

export const additionalServices = [
  {
    id: "loadBalancer",
    name: "Elastic Load Balancer",
    description: "트래픽 분산 및 고가용성 보장을 위한 로드 밸런서",
    price: 25.0,
  },
  {
    id: "natGateway",
    name: "NAT Gateway",
    description: "프라이빗 서브넷의 인터넷 접근을 위한 게이트웨이",
    price: 32.0,
  },
  {
    id: "cloudwatch",
    name: "CloudWatch 모니터링",
    description: "서버 및 애플리케이션 모니터링, 로그 관리",
    price: 15.0,
  },
  {
    id: "backup",
    name: "AWS Backup",
    description: "AWS 리소스의 자동 백업 및 복구 관리",
    price: 20.0,
  },
  {
    id: "route53",
    name: "Route 53",
    description: "DNS 서비스 및 도메인 관리",
    price: 10.0,
  },
  {
    id: "shield",
    name: "AWS Shield Standard",
    description: "DDoS 보호 및 보안 관리",
    price: 30.0,
  },
];
