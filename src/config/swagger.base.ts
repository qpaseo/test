export const swaggerBase = {
  openapi: "3.0.0",
  info: {
    title: "PATH Auth API",
    version: "1.0.0",
    description: "청소년 경제 교육 AI 플랫폼 - PATH Auth API",
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
      },
    },
    schemas: {}, // 컨트롤러에서 합칠 예정
  },
  security: [{ bearerAuth: [] }],
  paths: {}, // 컨트롤러에서 합칠 예정
};
