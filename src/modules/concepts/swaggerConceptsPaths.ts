export const userSchemas = {
  UserInfoResponse: {
    type: "object",
    properties: {
      userId: { type: "string", example: "uuid" },
      email: { type: "string", example: "test@test.com" },
      name: { type: "string", example: "홍길동" },
      hasLoan: { type: "boolean", example: true },
      hasStock: { type: "boolean", example: false },
      recentPlanDate: { type: ["string", "null"], format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  GoalProgressItem: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      description: { type: ["string", "null"] },
      targetAmount: { type: "number" },
      currentAmount: { type: "number" },
      progressPercentage: { type: "number" },
      monthlyContribution: { type: "number" },
      startDate: { type: ["string", "null"] },
      endDate: { type: ["string", "null"] },
    },
  },

  MonthlyFinanceItem: {
    type: "object",
    properties: {
      year: { type: "integer" },
      month: { type: "integer" },
      income: { type: "number" },
      expense: { type: "number" },
    },
  },

  FinancialStatementChatRoom: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      description: { type: ["string", "null"] },
      lastMessage: { type: ["string", "null"] },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  RagChatRoom: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      description: { type: ["string", "null"] },
      lastMessage: { type: ["string", "null"] },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: ["string", "null"], format: "date-time" },
    },
  },

  UserDashboardResponse: {
    type: "object",
    properties: {
      onboardingGoals: {
        type: "array",
        items: { $ref: "#/components/schemas/GoalProgressItem" },
      },
      financialPlansGoals: {
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
            type: "array",
            items: { $ref: "#/components/schemas/FinancialStatementChatRoom" },
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
