import { format } from "date-fns";
import { v4 as uuid } from "uuid";

import { MonthYear } from "@/components/month-select";
import { TTransactionTypes } from "@/lib/types";
import { IResponse } from "@/lib/types/response";
import { Database } from "@/lib/types/supabase";
import { getCurrentMonth } from "@/lib/utils";

import { createClient } from "../server";
import { TChangedBalance } from "./balance";
import { TTransaction } from "./other";

export type TSummary = Database["public"]["Tables"]["summary"]["Row"];
export interface ISummaryMonth {
  balance: number;
  expense: number;
  income: number;
  investment: number;
  savings: number;
  date: string;
  previousMonth: {
    balance: number;
    expense: number;
    income: number;
    investment: number;
    savings: number;
    date: string;
  };
}
/**
 * @param date - YYYY-MM-DD (DD is always set to 01)
 */
export async function getSummary(userId: string, date = getCurrentMonth()) {
  date = `${format(date, "yyyy-MM")}-01`;

  const supabase = createClient();

  /* const userId = (await supabase.auth.getUser()).data.user?.id!; */

  const { data: summary, error } = await supabase
    .from("summary")
    .select()
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  /* if (error) throw { type: "summary-select", ...error }; */

  const previousMonthDate = new Date(date);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonthString = `${previousMonthDate.toISOString().slice(0, 7)}-01`;

  const { data: previousMonth, error: previousMonthError } = await supabase
    .from("summary")
    .select()
    .eq("user_id", userId)
    .eq("date", previousMonthString)
    .single();

  const data: ISummaryMonth = {
    balance: summary?.balance ?? 0,
    income: summary?.income ?? 0,
    expense: summary?.expense ?? 0,
    investment: summary?.investment ?? 0,
    savings: summary?.savings ?? 0,
    date: summary?.date ?? date,
    previousMonth: {
      balance: previousMonth?.balance ?? 0,
      income: previousMonth?.income ?? 0,
      expense: previousMonth?.expense ?? 0,
      investment: previousMonth?.investment ?? 0,
      savings: previousMonth?.savings ?? 0,
      date: previousMonth?.date ?? previousMonthString,
    },
  };

  return { summary: data, error } as IResponse<"summary", ISummaryMonth>;
}

export async function getSummaries(userId: string) {
  const supabase = createClient();

  const { data: summaries, error } = await supabase
    .from("summary")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });

  return { summaries, error } as IResponse<"summaries", TSummary[]>;
}

export async function getSummaryMonths(userId: string) {
  const supabase = createClient();

  /* const userId = (await supabase.auth.getUser()).data.user?.id!; */

  const { data: months, error } = await supabase
    .from("summary")
    .select("date")
    .eq("user_id", userId);

  /* if (!summary) return { summary: [], error } as IResponse<"summary", string[]>; */

  return {
    months:
      months?.map((x) => ({
        month: new Intl.DateTimeFormat("default", {
          month: "long",
        }).format(new Date(x.date)),
        year: x.date.slice(0, 4),
      })) ?? [],
    error,
  } as IResponse<"months", MonthYear[]>;
}

/**
 * This function adjusts the summary by the given amount for the given transaction type.
 * If isReversal is true, then it subtracts the amount from the summary, otherwise it adds the amount.
 *
 * @param summary - The summary object to adjust
 * @param amount - The amount to adjust the summary by
 * @param transactionType - The type of the transaction to adjust the summary for
 * @param isReversal - Whether this adjustment is a reversal of a previous transaction
 */
async function adjustSummary(
  summary: TSummary,
  amount: number,
  transactionType: TTransactionTypes,
  isReversal: boolean = false
) {
  // Determine whether the adjustment should be positive or negative
  const adjustment = isReversal ? -amount : amount;

  // Adjust the summary based on the transaction type
  switch (transactionType) {
    case "income":
      // Add or subtract the amount from the income field
      summary.income += adjustment;
      break;
    case "expense":
      // Add or subtract the amount from the expenses field
      summary.expense += adjustment;
      break;
    case "investment":
      // Add or subtract the amount from the investments field
      summary.investment += adjustment;
      break;
    case "savings":
      // Add or subtract the amount from the savings field
      summary.savings += adjustment;
      break;
    default:
      throw new Error("Unknown transaction type");
  }
}

/**
 * Updates the summary table in Supabase. This function should be called
 * when a transaction is created, updated, or deleted.
 * @param data - Data containing the action, userId, changedBalance, currentTransaction, and oldTransaction
 * @throws {type: "update-summary", ...updateError} if there's an error updating the summary
 */
export async function updateSummary(data: {
  action: "create" | "update" | "delete";
  userId: string;
  changedBalance: TChangedBalance;
  currentTransaction: Pick<
    TTransaction,
    "amount" | "transaction_type" | "transaction_date"
  >;
  oldTransaction?: Pick<
    TTransaction,
    "amount" | "transaction_type" | "transaction_date"
  >;
}) {
  // Destructure the data
  const { action, userId, changedBalance, currentTransaction, oldTransaction } =
    data;

  // Create a new instance of the supabase client
  const supabase = createClient();

  // Get the date of the currentTransaction and set it to the start of the next month
  const date = new Date(currentTransaction.transaction_date);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const startOfMonthISO = `${startOfMonth.toISOString().slice(0, 7)}-01`;

  // Get the summary for the start of the month
  const { data: summaries, error: summarySelectError } = await supabase
    .from("summary")
    .select()
    .eq("user_id", userId)
    .eq("date", startOfMonthISO);

  // If there was an error getting the summary, throw an error
  if (summarySelectError)
    throw { type: "summary-select", ...summarySelectError };

  // If there's a summary for the month, use that, otherwise create a new one
  const summary: TSummary = summaries.length
    ? summaries[0]
    : {
        balance: 0,
        date: startOfMonthISO,
        expense: 0,
        income: 0,
        investment: 0,
        savings: 0,
        summary_id: uuid(),
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
        user_id: userId,
      };

  if (action === "create") {
    adjustSummary(
      summary,
      currentTransaction.amount,
      currentTransaction.transaction_type as TTransactionTypes
    );
    summary.balance +=
      currentTransaction.transaction_type === "income"
        ? currentTransaction.amount
        : -currentTransaction.amount;
  } else if (action === "update") {
    if (oldTransaction) {
      const oldDate = new Date(oldTransaction.transaction_date);
      const oldStartOfMonth = new Date(
        oldDate.getFullYear(),
        oldDate.getMonth() + 1,
        1
      );
      const oldStartOfMonthISO = `${oldStartOfMonth.toISOString().slice(0, 7)}-01`;

      if (oldStartOfMonthISO === startOfMonthISO) {
        // Same month, simple update
        adjustSummary(
          summary,
          oldTransaction.amount,
          oldTransaction.transaction_type as TTransactionTypes,
          true
        );
        summary.balance -=
          oldTransaction.transaction_type === "income"
            ? oldTransaction.amount
            : -oldTransaction.amount;
      } else {
        // Different months, adjust both old and new summaries
        const { data: oldSummaries, error: oldSummarySelectError } =
          await supabase
            .from("summary")
            .select()
            .eq("user_id", userId)
            .eq("date", oldStartOfMonthISO);

        if (oldSummarySelectError)
          throw { type: "old-summary-select", ...oldSummarySelectError };

        const oldSummary: TSummary = oldSummaries.length
          ? oldSummaries[0]
          : {
              balance: 0,
              date: oldStartOfMonthISO,
              expense: 0,
              income: 0,
              investment: 0,
              savings: 0,
              summary_id: uuid(),
              created_at: new Date().toUTCString(),
              updated_at: new Date().toUTCString(),
              user_id: userId,
            };

        adjustSummary(
          oldSummary,
          oldTransaction.amount,
          oldTransaction.transaction_type as TTransactionTypes,
          true
        );
        oldSummary.balance -=
          oldTransaction.transaction_type === "income"
            ? oldTransaction.amount
            : -oldTransaction.amount;

        // Update the old summary's updated_at date to the current date and time
        oldSummary.updated_at = new Date().toUTCString();

        // Upsert the old summary (insert or update) and throw an error if there's one
        const { error: oldUpdateError } = await supabase
          .from("summary")
          .upsert(oldSummary, {
            onConflict: "summary_id",
            ignoreDuplicates: false,
            count: "exact",
          });

        if (oldUpdateError)
          throw { type: "old-update-summary", ...oldUpdateError };
      }
    }
    adjustSummary(
      summary,
      currentTransaction.amount,
      currentTransaction.transaction_type as TTransactionTypes
    );
    summary.balance +=
      currentTransaction.transaction_type === "income"
        ? currentTransaction.amount
        : -currentTransaction.amount;
  } else if (action === "delete" && currentTransaction) {
    adjustSummary(
      summary,
      currentTransaction.amount,
      currentTransaction.transaction_type as TTransactionTypes,
      true
    );
    summary.balance -=
      currentTransaction.transaction_type === "income"
        ? currentTransaction.amount
        : -currentTransaction.amount;
  }

  // Update the summary's updated_at date to the current date and time
  summary.updated_at = new Date().toUTCString();

  // Upsert the summary (insert or update) and throw an error if there's one
  const { error: updateError } = await supabase
    .from("summary")
    .upsert(summary, {
      onConflict: "summary_id",
      ignoreDuplicates: false,
      count: "exact",
    });

  if (updateError) throw { type: "update-summary", ...updateError };
}
