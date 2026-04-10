export const conceptsPaths = {
  "/concepts": {
    get: {
      summary: "컨셉 리스트 조회",
      tags: ["Concepts"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
          description: "페이지 번호 (1부터 시작)",
        },
      ],
      responses: {
        "200": {
          description: "컨셉 리스트 조회 성공",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ConceptListResponse" },
            },
          },
        },
        "400": { description: "입력값 검증 실패" },
        "401": { description: "인증 필요" },
      },
    },
  },
  "/concepts/{id}": {
    get: {
      summary: "컨셉 상세 조회",
      tags: ["Concepts"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "컨셉 UUID",
        },
      ],
      responses: {
        "200": {
          description: "컨셉 상세 조회 성공",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ConceptDetailResponse" },
            },
          },
        },
        "400": { description: "유효하지 않은 UUID" },
        "401": { description: "인증 필요" },
        "404": { description: "컨셉 없음" },
      },
    },
  },
};

export const conceptsSchemas = {
  ConceptListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      code: { type: "string" },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
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
          },
          total: { type: "integer" },
          page: { type: "integer" },
          totalPages: { type: "integer" },
        },
      },
      timestamp: { type: "string" },
    },
  },
  ConceptDetailResponse: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      code: { type: "string" },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
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
      timestamp: { type: "string" },
    },
  },
};
