"use client";

import { isToday, isYesterday } from "date-fns";
import { ReceiptTextIcon } from "lucide-react";
import {
  useFormatter,
  useLocale,
  useTimeZone,
  useTranslations,
} from "next-intl";

import { TTransaction, getTransactions } from "@/lib/supabase/utils/other";
import { formatNumber } from "@/lib/utils";

import { TransactionListRow } from "./row";

function groupTransactionsByDate(
  transactions: TTransaction[],
  month: number,
  year: number,
  today: string,
  yesterday: string,
  formatter: ReturnType<typeof useFormatter>,
  timezone: ReturnType<typeof useTimeZone>
): Record<string, TTransaction[]> {
  const groupedTransactions: Record<string, TTransaction[]> = {};

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.transaction_date);
    const formattedDate = formatter.dateTime(transactionDate, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: timezone,
    });

    if (
      transactionDate.getMonth() + 1 === month &&
      transactionDate.getFullYear() === year
    ) {
      let groupName: string;

      if (isToday(transactionDate)) {
        groupName = today;
      } else if (isYesterday(transactionDate)) {
        groupName = yesterday;
      } else {
        groupName = formattedDate;
      }

      if (!groupedTransactions[groupName]) {
        groupedTransactions[groupName] = [];
      }

      groupedTransactions[groupName].push(transaction);
    }
  });

  for (const group in groupedTransactions) {
    groupedTransactions[group].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }

  return groupedTransactions;
}

export function TransactionList({
  timeframe,
  transactionData,
  currency,
}: {
  timeframe: string;
  transactionData: Awaited<ReturnType<typeof getTransactions>>;
  currency: string;
}) {
  const timezone = useTimeZone();
  const locale = useLocale();
  const t = useTranslations();

  const formatter = useFormatter();

  const { transactions, error } = transactionData;

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const groupedTransactions = groupTransactionsByDate(
    transactions,
    Number(timeframe.split("-")[1]),
    Number(timeframe.split("-")[0]),
    t("today"),
    t("yesterday"),
    formatter,
    timezone
  );

  if (Object.keys(groupedTransactions).length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex max-w-60 flex-col items-center gap-4 text-center">
          <ReceiptTextIcon className="size-16" strokeWidth={1} />
          <p>{t("transaction-list-empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.keys(groupedTransactions).map((date, i) => {
        const monthlySummary = groupedTransactions[date]
          .map((x) => (x.transaction_type === "expense" ? -x.amount : x.amount))
          .reduce((a, b) => a + b, 0);
        return (
          <table className="flex w-full flex-col gap-3" key={i}>
            <caption className="flex items-center justify-between">
              {" "}
              {/* border-b border-b-zinc-100 text-zinc-600 dark:border-b-zinc-800 dark:text-zinc-100 pb-1.5 */}
              <span>{date}</span>
              <span className="text-sm">
                {monthlySummary > 0 ? "+" : ""}
                {
                  formatNumber({
                    value: monthlySummary,
                    locale,
                  }).formattedValue
                }{" "}
                {currency}
              </span>
            </caption>
            <tbody>
              {groupedTransactions[date].map((transaction, i) => (
                <TransactionListRow
                  transaction={transaction}
                  currency={currency}
                  key={i}
                />
              ))}
            </tbody>
          </table>
        );
      })}
    </div>
  );
}
