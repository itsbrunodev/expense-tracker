import { z } from "zod";

import { DESCRIPTION_CHAR_LIMIT, TITLE_CHAR_LIMIT } from "@/lib/constants";
import { TTransactionTypes } from "@/lib/types";

export const transactionFormSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required.",
    })
    .min(0, {
      message: "Amount must be greater than zero.",
    })
    .max(1_000_000_000, {
      message: "Amount must be less than a billion.",
    }),
  transaction_type: z.enum(["expense", "income", "investment"] as [
    TTransactionTypes,
    TTransactionTypes,
    TTransactionTypes,
  ]),
  transaction_date: z.date({
    required_error: "Date is required.",
  }),
  title: z
    .string({ required_error: "Title is required." })
    .min(1, {
      message: "Title must be at least 1 character.",
    })
    .max(TITLE_CHAR_LIMIT, {
      message: "Title must be less than 25 characters.",
    }),
  categories: z.string().array().max(6).optional().default([]),
  description: z
    .string({
      /* required_error: "Description is required." */
    })
    .min(1, {
      message: "Description must be at least 1 character.",
    })
    .max(DESCRIPTION_CHAR_LIMIT, {
      message: "Description must be less than 100 characters.",
    })
    .optional()
    .or(z.literal("")),
});

export type TTransactionForm = z.infer<typeof transactionFormSchema>;
