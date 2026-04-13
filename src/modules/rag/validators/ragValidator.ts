import { z } from "zod";

// ============= Upload =============
export const UploadQuerySchema = z.object({
  metadata: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        throw new Error("metadata는 유효한 JSON 형식이어야 합니다.");
      }
    }),
});

export type UploadQuery = z.infer<typeof UploadQuerySchema>;

// ============= Chat =============
export const ChatRequestSchema = z.object({
  question: z
    .string()
    .min(1, "질문을 입력해주세요.")
    .max(1000, "질문은 1000자 이내여야 합니다."),
  documentId: z.string().uuid("유효한 documentId 형식이 아닙니다.").optional(),
  topK: z.number().int().min(1).max(10).default(5),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
