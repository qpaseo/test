export const authPaths = {
  "/auth/sign-up": {
    post: {
      summary: "회원가입",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                password: { type: "string" },
                name: { type: "string" },
                targetAmount: { type: "number" },
                netMonthlyIncome: { type: "number" },
                monthlyFixedExpenses: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      money: { type: "string" }, // 숫자 형식 문자열
                    },
                    required: ["name", "money"],
                  },
                  minItems: 1,
                },
                hasLoan: { type: "boolean" },
                hasStock: { type: "boolean" },
              },
              required: [
                "email",
                "password",
                "name",
                "targetAmount",
                "netMonthlyIncome",
                "monthlyFixedExpenses",
                "hasLoan",
                "hasStock",
              ],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "회원가입 성공",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignUpResponse" },
            },
          },
        },
        "400": { description: "입력값 검증 실패" },
      },
    },
  },
  "/auth/login": {
    post: {
      summary: "로그인",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "로그인 성공",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginResponse" },
            },
          },
        },
        "400": { description: "입력값 검증 실패" },
        "401": { description: "인증 실패" },
      },
    },
  },
  "/auth/refresh": {
    post: {
      summary: "액세스 토큰 갱신",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { refreshToken: { type: "string" } },
              required: ["refreshToken"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "토큰 갱신 성공",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenResponse" },
            },
          },
        },
        "401": { description: "리프레시 토큰 검증 실패" },
      },
    },
  },
  "/auth/logout": {
    post: {
      summary: "로그아웃",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { refreshToken: { type: "string" } },
              required: ["refreshToken"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "로그아웃 성공",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LogoutResponse" },
            },
          },
        },
        "401": { description: "리프레시 토큰 검증 실패" },
      },
    },
  },
};

export const authSchemas = {
  SignUpResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      code: { type: "string" },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          userId: { type: "string" },
          email: { type: "string" },
          name: { type: "string" },
          createdAt: { type: "string" },
        },
      },
      timestamp: { type: "string" },
    },
  },
  LoginResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      code: { type: "string" },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          userId: { type: "string" },
          email: { type: "string" },
          name: { type: "string" },
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
          accessTokenExpiresIn: { type: "string" },
          refreshTokenExpiresIn: { type: "string" },
        },
      },
      timestamp: { type: "string" },
    },
  },
  RefreshTokenResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      code: { type: "string" },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
          accessTokenExpiresIn: { type: "string" },
        },
      },
      timestamp: { type: "string" },
    },
  },
  LogoutResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      code: { type: "string" },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          message: { type: "string" },
          timestamp: { type: "string" },
        },
      },
      timestamp: { type: "string" },
    },
  },
};
