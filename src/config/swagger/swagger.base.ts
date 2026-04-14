export const swaggerBase = {
  openapi: "3.0.0",
  info: {
    title: "PATH API Documentation",
    version: "1.0.0",
    description: "청소년 경제 교육 AI 플랫폼 - PATH API 문서",
    contact: {
      name: "PATH Team",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: 'JWT 토큰을 입력해주세요. "Bearer <token>" 형식입니다.',
      },
    },
    schemas: {},
  },
  security: [{ bearerAuth: [] }],
  paths: {},
};
