export const chatPaths = {
  "/chat/rooms": {
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

    post: {
      tags: ["Chat"],
      summary: "채팅방 생성",
      description: "첫 메시지를 기반으로 AI가 채팅방 이름과 설명을 생성합니다.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateChatRoomRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "채팅방 생성 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: { type: "string", example: "CHAT_ROOM_CREATED" },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/CreateChatRoomResponse",
                  },
                  timestamp: { type: "string", format: "date-time" },
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

  "/chat/rooms/{roomId}": {
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

    patch: {
      tags: ["Chat"],
      summary: "채팅방 수정",
      description: "채팅방 이름 또는 설명을 수정합니다.",
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
            schema: { $ref: "#/components/schemas/UpdateChatRoomRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "수정 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: { type: "string", example: "CHAT_ROOM_UPDATED" },
                  message: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        401: { description: "인증 실패" },
        403: { description: "권한 없음" },
        404: { description: "채팅방 없음" },
        500: { description: "서버 오류" },
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

  "/chat/stream": {
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
    required: ["id", "name", "memoryCount", "createdAt"],
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

  Message: {
    type: "object",
    required: ["id", "role", "content", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid" },
      role: { type: "string", enum: ["user", "assistant"] },
      content: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  Memory: {
    type: "object",
    required: ["id", "content", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid" },
      content: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  ChatRoomDetailResponse: {
    type: "object",
    required: [
      "id",
      "name",
      "memoryCount",
      "createdAt",
      "messages",
      "memories",
    ],
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
        items: {
          $ref: "#/components/schemas/Message",
        },
      },
      memories: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Memory",
        },
      },
    },
  },

  ChatRoomListResponse: {
    type: "object",
    required: ["rooms", "total", "page", "pageSize"],
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

  CreateChatRoomRequest: {
    type: "object",
    required: ["firstMessage"],
    properties: {
      firstMessage: {
        type: "string",
        example: "오늘 점심 뭐 먹을지 고민이야",
      },
    },
  },

  UpdateChatRoomRequest: {
    type: "object",
    minProperties: 1, // 중요
    properties: {
      name: {
        type: "string",
        maxLength: 50,
        example: "새 채팅방 이름",
      },
      description: {
        type: "string",
        maxLength: 200,
        example: "새 설명",
      },
    },
  },

  CreateChatRoomResponse: {
    type: "object",
    required: ["roomId"],
    properties: {
      roomId: { type: "string", format: "uuid" },
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
