import { z } from "zod";

export const insightPromptSchema = z
  .string()
  .trim()
  .superRefine((value, context) => {
    if (!/[a-zA-Z]{3,}/.test(value)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use a natural-language analytics question.",
      });
    }

    if (value.length < 5) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use at least five characters.",
      });
    }
  });
