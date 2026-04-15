export const conceptPaths = {
  "/concepts": {
    get: {
      tags: ["Concepts"],
      summary: "컨셉 리스트 조회",
      description: "컨셉 리스트를 페이지네이션으로 조회합니다.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
          },
          description: "페이지 번호 (1부터 시작)",
        },
      ],
      responses: {
        200: {
          description: "컨셉 리스트 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: {
                    type: "string",
                    example: "Concepts retrieved successfully",
                  },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/ConceptListResponse",
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
      },
    },
  },

  "/concepts/{id}": {
    get: {
      tags: ["Concepts"],
      summary: "컨셉 상세 조회",
      description: "특정 컨셉의 상세 정보를 조회합니다.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "컨셉 UUID",
        },
      ],
      responses: {
        200: {
          description: "컨셉 상세 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  code: {
                    type: "string",
                    example: "Concept retrieved successfully",
                  },
                  message: { type: "string" },
                  data: {
                    $ref: "#/components/schemas/ConceptDetailResponse",
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
        400: { description: "유효하지 않은 UUID" },
        401: { description: "인증 실패" },
        404: { description: "컨셉 없음" },
      },
    },
  },
};

export const conceptSchemas = {
  ConceptListItemResponse: {
    type: "object",
    properties: {
      conceptId: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string", nullable: true },
      category: {
        type: "array",
        items: { type: "string" },
        nullable: true,
      },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  ConceptListResponse: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ConceptListItemResponse",
        },
      },
      total: { type: "number" },
      page: { type: "number" },
      totalPages: { type: "number" },
    },
  },

  ConceptDetailResponse: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      description: { type: "string", nullable: true },
      content: { type: "string" },
      category: {
        type: "array",
        items: { type: "string" },
        nullable: true,
      },
      documentUrl: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
    },
  },
};
