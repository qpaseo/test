export const userPaths = {
  "/user": {
    get: {
      tags: ["User"],
      summary: "사용자 기본 정보 조회",
      description: "로그인한 사용자의 기본 정보를 반환합니다.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "사용자 정보 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: { type: "string", example: "GET_USER_INFO_SUCCESS" },
                  message: {
                    type: "string",
                  },
                  data: {
                    type: "object",
                    properties: {
                      userId: { type: "string" },
                      email: { type: "string" },
                      name: { type: "string" },
                      hasLoan: { type: "boolean" },
                      hasStock: { type: "boolean" },
                      recentPlanDate: {
                        type: ["string", "null"],
                        format: "date-time",
                      },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "인증 실패",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  code: { type: "string", example: "UNAUTHORIZED" },
                  message: { type: "string", example: "인증이 필요합니다" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        500: {
          description: "서버 오류",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  code: {
                    type: "string",
                    example: "INTERNAL_SERVER_ERROR",
                  },
                  message: {
                    type: "string",
                    example: "내부 서버 오류가 발생했습니다",
                  },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },

  "/user/main": {
    get: {
      tags: ["User"],
      summary: "유저 메인 대시보드 조회",
      description:
        "유저 목표, 금융 데이터, 채팅 목록을 병렬로 조회하여 반환합니다.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "대시보드 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: {
                    type: "string",
                    example: "GET_USER_INFO_SUCCESS",
                  },
                  message: {
                    type: "string",
                    example: "사용자 정보 조회가 완료되었습니다",
                  },
                  data: {
                    type: "object",
                    properties: {
                      onboardingGoals: {
                        type: "array",
                        items: { type: "object" },
                      },
                      financialPlansGoals: {
                        type: "array",
                        items: { type: "object" },
                      },
                      monthlyFinances: {
                        type: "array",
                        items: { type: "object" },
                      },
                      chatRooms: {
                        type: "object",
                        properties: {
                          financialStatementChats: {
                            type: "array",
                            items: { type: "object" },
                          },
                          chats: {
                            type: "array",
                            items: { type: "object" },
                          },
                        },
                      },
                    },
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
};

export const userSchemas = {
  UserInfoResponse: {
    type: "object",
    properties: {
      userId: { type: "string", example: "uuid" },
      email: { type: "string", example: "test@test.com" },
      name: { type: "string", example: "홍길동" },
      hasLoan: { type: "boolean", example: true },
      hasStock: { type: "boolean", example: false },
      recentPlanDate: {
        type: ["string", "null"],
        format: "date-time",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  UserDashboardResponse: {
    type: "object",
    properties: {
      goals: {
        type: "array",
        items: { $ref: "#/components/schemas/GoalProgressItem" },
      },
      monthlyFinances: {
        type: "array",
        items: { $ref: "#/components/schemas/MonthlyFinanceItem" },
      },
      chatRooms: {
        type: "object",
        properties: {
          financialStatementChats: {
            $ref: "#/components/schemas/FinancialStatementChatRoom",
            nullable: true,
          },
          chats: {
            type: "array",
            items: { $ref: "#/components/schemas/RagChatRoom" },
          },
        },
      },
    },
  },
};
