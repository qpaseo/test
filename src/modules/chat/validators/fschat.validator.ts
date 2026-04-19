import { z } from "zod";

export const FsChatRoomListQuerySchema = z.object({
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

export const FsChatMessageBodySchema = z.object({
  message: z.string().min(1).max(5000),
  roomId: z.string().uuid().optional(),
});

export const FsChatRoomParamsSchema = z.object({
  roomId: z.string().uuid(),
});

export const FinancialStatementInputSchema = z.object({
  net_monthly_income: z.number().optional(),
  monthly_fixed_expenses: z
    .array(
      z.object({
        name: z.string(),
        money: z.number(),
      }),
    )
    .nullable()
    .optional(),
  monthly_savings_investment: z
    .array(
      z.object({
        name: z.string(),
        money: z.number(),
      }),
    )
    .nullable()
    .optional(),
});

export const FsChatRoomUpdateParamsSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(255).nullable().optional(),
});

export const FsProposalParamsSchema = z.object({
  proposalId: z.string().uuid(),
});

export const FsDraftParamsSchema = z.object({
  draftId: z.string().uuid(),
});

export type FsChatRoomListQuery = z.infer<typeof FsChatRoomListQuerySchema>;
export type FsChatMessageBody = z.infer<typeof FsChatMessageBodySchema>;
export type FsChatRoomUpdateParams = z.infer<
  typeof FsChatRoomUpdateParamsSchema
>;
export type FsChatRoomParams = z.infer<typeof FsChatRoomParamsSchema>;
