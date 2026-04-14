export const chatPaths = {
  "/api/chat/rooms": {
    get: {
      tags: ["Chat"],
      summary: "일반 채팅방 리스트 조회",
      description: "사용자의 채팅방 목록을 페이징하여 조회합니다.",
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
                    example: "CHAT_ROOMS_RETRIEVED",
                  },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/ChatRoomListResponse",
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
        401: { description: "인증 실패" },
        500: { description: "서버 오류" },
      },
    },
  },

  "/api/chat/rooms/{roomId}": {
    get: {
      tags: ["Chat"],
      summary: "채팅방 상세 조회",
      description: "채팅방 정보 및 메시지, 메모리를 조회합니다.",
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
                    example: "CHAT_ROOM_RETRIEVED",
                  },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/ChatRoomDetailResponse",
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

    delete: {
      tags: ["Chat"],
      summary: "채팅방 삭제",
      description: "채팅방과 관련된 메시지 및 메모리를 삭제합니다.",
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
          description: "삭제 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: {
                    type: "string",
                    example: "CHAT_ROOM_DELETED",
                  },
                  message: { type: "string" },
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

  "/api/chat/stream": {
    post: {
      tags: ["Chat"],
      summary: "채팅 SSE 스트리밍",
      description: "유저 메시지를 기반으로 AI 응답을 SSE로 스트리밍합니다.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ChatMessageRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "SSE 스트림 응답",
          content: {
            "text/event-stream": {
              schema: {
                type: "string",
                example: "data: {...}\\n\\n",
              },
            },
          },
        },
      },
    },
  },
};

export const chatSchemas = {
  ChatRoomSummaryResponse: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string", nullable: true },
      memoryCount: { type: "number" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
    },
  },

  ChatRoomDetailResponse: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string", nullable: true },
      memoryCount: { type: "number" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      messages: {
        type: "array",
        items: { type: "object" }, // 상세 필요
      },
      memories: {
        type: "array",
        items: { type: "object" }, // 상세 필요
      },
    },
  },

  ChatRoomListResponse: {
    type: "object",
    properties: {
      rooms: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ChatRoomSummaryResponse",
        },
      },
      total: { type: "number" },
      page: { type: "number" },
      pageSize: { type: "number" },
    },
  },

  ChatMessageRequest: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "string",
        example: "안녕하세요",
      },
      roomId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },
    },
  },
};
