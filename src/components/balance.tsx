"use client";

import { useAtom } from "jotai";
import { useLocale, useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { hoveredStatisticAtom } from "@/lib/store";
import { ISummaryMonth } from "@/lib/supabase/utils/summary";
import { TTransactionTypes } from "@/lib/types";
import { cn, formatNumber, percentageDifference } from "@/lib/utils";

import { Counter } from "./counter";

/**
 * Component for displaying the balance and its distribution.
 *
 * @param {Object} props - The component props.
 * @param {string} props.currency - The currency code.
 * @param {number} props.balance - The total balance.
 * @param {ISummaryMonth} props.summary - The monthly summary.
 * @return {JSX.Element} The rendered component.
 */
export function Balance({
  currency,
  balance,
  summary,
}: {
  currency: string;
  balance: number;
  summary: ISummaryMonth;
}) {
  const locale = useLocale();
  const t = useTranslations();

  // Atom for tracking the hovered statistic.
  const [hoveredStatistic, setHoveredStatistic] = useAtom(hoveredStatisticAtom);

  // Calculate the total amount of income, expenses, investments and savings.
  const total =
    summary.expense + summary.income + summary.investment + summary.savings;

  // Calculate the percentage of income, expenses, investments and savings.
  const incomesPercentage = (summary.income / total) * 100;
  const expensesPercentage = (summary.expense / total) * 100;
  const investmentsPercentage = (summary.investment / total) * 100;
  const savingsPercentage = (summary.savings / total) * 100;

  // Format options for number formatting.
  const formatOptions: Parameters<typeof formatNumber>["0"]["formatOptions"] = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  };

  /**
   * Render a single statistic.
   *
   * @param {TTransactionTypes} statistic - The type of statistic.
   * @param {string} color - The color of the statistic.
   * @param {string} label - The label of the statistic.
   * @return {JSX.Element} The rendered statistic.
   */
  const renderStatistic = (statistic: TTransactionTypes, label: string) => {
    const percentage = {
      income: incomesPercentage,
      expense: expensesPercentage,
      investment: investmentsPercentage,
      savings: savingsPercentage,
    }[statistic];

    return (
      <Tooltip open={hoveredStatistic === statistic}>
        <TooltipTrigger
          asChild
          onMouseEnter={() => setHoveredStatistic(statistic)}
          onMouseLeave={() => setHoveredStatistic(null)}
        >
          <div
            className={cn(
              `h-full transition-opacity`,
              statistic === "income" && "bg-green-600 dark:bg-green-500",
              statistic === "expense" && "bg-red-600 dark:bg-red-500",
              statistic === "investment" && "bg-indigo-600 dark:bg-indigo-500",
              statistic === "savings" && "bg-yellow-600 dark:bg-yellow-500",
              hoveredStatistic !== null &&
                (hoveredStatistic === statistic ? "" : "opacity-20")
            )}
            style={{
              width: `${percentage}%`,
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs text-zinc-900 dark:text-zinc-100">{label}</p>
          <p className="text-base">
            {
              formatNumber({
                value: percentage,
                locale,
                formatOptions,
              }).formattedValue
            }
            %
          </p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="flex sm:flex-row flex-col sm:gap-0 gap-4 sm:items-center items-start justify-between">
      <div className="flex flex-col">
        <p className="text-zinc-900 dark:text-zinc-50">{t("net-total")}</p>
        <p
          className={cn(
            "text-2xl font-semibold",
            balance < 0 && "text-red-600 dark:text-red-500"
          )}
        >
          <Counter value={balance || 0} locale={locale} />
          <span className="ml-0.5 text-sm font-normal text-zinc-900 dark:text-zinc-100">
            <span>{currency}</span>
            {/* Display the percentage difference with the previous month. */}
            <sup className="text-xs">
              {t("vs-last-month", {
                value: formatNumber({
                  value: percentageDifference(
                    summary.previousMonth.balance,
                    balance
                  ),
                  showSign: true,
                  locale,
                  formatOptions,
                }).formattedValue,
              })}
            </sup>
          </span>
        </p>
      </div>
      <div className="flex h-2 sm:w-1/2 w-full gap-0.5 overflow-hidden rounded-full">
        {total === 0 ? (
          <span className="w-full bg-zinc-100 dark:bg-zinc-800" />
        ) : (
          <TooltipProvider>
            {incomesPercentage > 0 && renderStatistic("income", t("income"))}
            {expensesPercentage > 0 &&
              renderStatistic("expense", t("expenses"))}
            {investmentsPercentage > 0 &&
              renderStatistic("investment", t("investment"))}
            {savingsPercentage > 0 && renderStatistic("savings", t("savings"))}
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
