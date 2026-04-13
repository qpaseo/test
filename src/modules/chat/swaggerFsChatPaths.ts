export const fsChatPaths = {
  "/api/fs-chat/rooms": {
    get: {
      tags: ["FsChat"],
      summary: "재무재표 채팅방 리스트 조회",
      description: "재무재표 채팅방 목록을 페이징하여 조회합니다.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "pageSize",
          schema: { type: "integer", default: 20 },
        },
      ],
      responses: {
        200: {
          description: "채팅방 리스트 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: {
                    type: "string",
                    example: "FS_CHAT_ROOMS_RETRIEVED",
                  },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/FsChatRoomListResponse",
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
  },

  "/api/fs-chat/rooms/{roomId}": {
    get: {
      tags: ["FsChat"],
      summary: "재무재표 채팅방 상세 조회",
      description: "채팅방 정보 및 메시지를 조회합니다.",
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
  },

  "/api/fs-chat/stream": {
    post: {
      tags: ["FsChat"],
      summary: "재무재표 채팅 SSE 스트리밍",
      description: `SSE 이벤트:
- event: message → 일반 텍스트 { chunk }
- event: statement → 재무재표 업데이트
- data: [DONE] → 종료`,
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
                example: "event: message\\ndata: {...}\\n\\n",
              },
            },
          },
        },
      },
    },
  },

  "/api/fs-chat/rooms/{roomId}/complete": {
    post: {
      tags: ["FsChat"],
      summary: "재무재표 채팅 완료 및 재무재표 생성",
      description:
        "대화를 종료하고 재무재표를 생성하며, 기존 메시지는 삭제됩니다.",
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
          description: "재무재표 생성 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: {
                    type: "string",
                    example: "FS_STATEMENT_CREATED",
                  },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/FsChatCompleteResponse",
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
  },
};

export const fsChatSchemas = {
  FsChatRoomSummaryResponse: {
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
      messages: {
        type: "array",
        items: {
          $ref: "#/components/schemas/FsChatMessageResponse",
        },
      },
    },
  },

  FsChatRoomListResponse: {
    type: "object",
    properties: {
      rooms: {
        type: "array",
        items: {
          $ref: "#/components/schemas/FsChatRoomSummaryResponse",
        },
      },
      total: { type: "number" },
      page: { type: "number" },
      pageSize: { type: "number" },
    },
  },

  FsChatMessageRequest: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        example: "재무 상황을 분석해줘",
      },
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
        type: "object",
        description: "생성된 재무재표",
      },
    },
  },
};
