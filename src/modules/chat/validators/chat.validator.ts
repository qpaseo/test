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

export const ChatRoomParamsSchema = z.object({
  roomId: z.string().uuid(),
});

export const CreateChatRoomBodySchema = z.object({
  firstMessage: z.string().min(1).max(5000),
});

export const UpdateChatRoomBodySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
});

export type UpdateChatRoomBody = z.infer<typeof UpdateChatRoomBodySchema>;
export type ChatRoomListQuery = z.infer<typeof ChatRoomListQuerySchema>;
export type ChatMessageBody = z.infer<typeof ChatMessageBodySchema>;
export type CreateChatRoomBody = z.infer<typeof CreateChatRoomBodySchema>;
