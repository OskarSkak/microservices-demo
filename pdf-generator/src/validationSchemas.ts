import { z } from "zod";

export const transactionSchema = z.object({
  user_email: z.string().email(),
  date_of_transaction: z.string().refine(
    (value) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(value); // Accepts dates in the format "2022-01-20"
    },
    { message: "Invalid date format. Use YYYY-MM-DD." }
  ),
  amount: z.number(),
});

export const generateStatementRequestSchema = z.object({
  date1: z.string().refine(
    (value) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(value); // Accepts dates in the format "2022-01-20"
    },
    { message: "Invalid date format. Use YYYY-MM-DD." }
  ),
  date2: z.string().refine(
    (value) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(value); // Accepts dates in the format "2022-01-20"
    },
    { message: "Invalid date format. Use YYYY-MM-DD." }
  ),
  user_email: z.string().email(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type GenerateStatementRequest = z.infer<
  typeof generateStatementRequestSchema
>;