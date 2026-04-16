export const fsChatPaths = {
  "/fs-chat/rooms/{roomId}": {
    get: {
      tags: ["FsChat"],
      summary: "재무재표 채팅방 상세 조회",
      description:
        "채팅방 정보, 메시지, 현재 재무재표, 변경 제안(proposal)을 조회합니다.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "roomId",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "채팅방 상세 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: {
                    type: "string",
                    example: "FS_CHAT_ROOM_RETRIEVED",
                  },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/FsChatRoomDetailResponse",
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
      },
    },

    patch: {
      tags: ["FsChat"],
      summary: "채팅방 수정",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "roomId",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string" },
                description: { type: "string", nullable: true },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "수정 성공",
        },
      },
    },
  },

  "/fs-chat/stream": {
    post: {
      tags: ["FsChat"],
      summary: "재무재표 채팅 SSE",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/FsChatMessageRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "SSE 스트림",
          content: {
            "text/event-stream": {
              schema: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },

  "/fs-chat/rooms/{roomId}/complete": {
    post: {
      tags: ["FsChat"],
      summary: "재무재표 생성 (유저 입력 반영)",
      description:
        "유저가 입력한 필드는 반드시 유지하고, 나머지는 AI가 보완하여 재무재표를 생성합니다.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "roomId",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/FinancialStatementPartialInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "생성 성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FsChatCompleteResponse",
              },
            },
          },
        },
      },
    },
  },

  "/fs-chat/financial-statements/latest": {
    patch: {
      tags: ["FsChat"],
      summary: "최신 재무재표 직접 수정",
      description:
        "유저가 최신 재무재표를 직접 수정합니다. 입력된 필드만 업데이트됩니다.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/FinancialStatementPartialInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "수정 성공",
        },
      },
    },
  },
};

export const fsChatSchemas = {
  ExpenseItem: {
    type: "object",
    properties: {
      name: { type: "string" },
      money: { type: "number" },
    },
  },

  FinancialStatement: {
    type: "object",
    properties: {
      netMonthlyIncome: { type: "number" },
      monthlyFixedExpenses: {
        type: "array",
        items: { $ref: "#/components/schemas/ExpenseItem" },
      },
      monthlySavingsInvestment: {
        type: "array",
        items: { $ref: "#/components/schemas/ExpenseItem" },
      },
    },
  },

  FinancialStatementPartialInput: {
    type: "object",
    description: "유저가 수정할 필드만 전달 (모든 필드는 optional)",
    properties: {
      net_monthly_income: { type: "number", nullable: true },
      monthly_fixed_expenses: {
        type: "array",
        nullable: true,
        items: { $ref: "#/components/schemas/ExpenseItem" },
      },
      monthly_savings_investment: {
        type: "array",
        nullable: true,
        items: { $ref: "#/components/schemas/ExpenseItem" },
      },
    },
    additionalProperties: false,
  },

  FinancialDraftProposal: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      fieldName: { type: "string" },
      oldValue: {
        $ref: "#/components/schemas/FinancialStatement",
      },
      newValue: {
        $ref: "#/components/schemas/FinancialStatement",
      },
      reason: { type: "string", nullable: true },
      status: {
        type: "string",
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
      },
    },
  },

  FsChatMessageResponse: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      financialStatementChatRoomId: {
        type: "string",
        format: "uuid",
      },
      sender: {
        type: "string",
        enum: ["USER", "AI"],
      },
      content: { type: "string" },
      messageIndex: { type: "number" },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  FsChatRoomDetailResponse: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      currentStatement: {
        $ref: "#/components/schemas/FinancialStatement",
      },

      proposal: {
        $ref: "#/components/schemas/FinancialDraftProposal",
      },

      messages: {
        type: "array",
        items: {
          $ref: "#/components/schemas/FsChatMessageResponse",
        },
      },
    },
  },

  FsChatMessageRequest: {
    type: "object",
    required: ["message"],
    properties: {
      message: { type: "string" },
      roomId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },
    },
  },

  FsChatCompleteResponse: {
    type: "object",
    properties: {
      statement: {
        $ref: "#/components/schemas/FinancialStatement",
      },
    },
  },
};
