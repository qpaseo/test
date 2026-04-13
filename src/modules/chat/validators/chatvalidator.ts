import { z } from "zod";

export const ChatRoomListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Number.parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1)),
  pageSize: z
    .string()
    .optional()
    .transform((v) => (v ? Number.parseInt(v, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
});

export const ChatMessageBodySchema = z.object({
  message: z.string().min(1).max(5000),
  roomId: z.string().uuid().optional(), // 없으면 서버에서 신규 생성
});

export type ChatRoomListQuery = z.infer<typeof ChatRoomListQuerySchema>;
export type ChatMessageBody = z.infer<typeof ChatMessageBodySchema>;
