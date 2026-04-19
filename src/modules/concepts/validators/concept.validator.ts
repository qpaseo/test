import { z } from "zod";

export const ConceptListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1)),
});

export const ConceptIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type ConceptListQuery = z.infer<typeof ConceptListQuerySchema>;
export type ConceptIdParam = z.infer<typeof ConceptIdParamSchema>;
