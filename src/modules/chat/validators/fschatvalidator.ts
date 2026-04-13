import { z } from "zod";

export const FsChatRoomListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1)),
  pageSize: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
});

export const FsChatMessageBodySchema = z.object({
  message: z.string().min(1).max(5000),
  roomId: z.string().uuid().optional(),
});

export type FsChatRoomListQuery = z.infer<typeof FsChatRoomListQuerySchema>;
export type FsChatMessageBody = z.infer<typeof FsChatMessageBodySchema>;
