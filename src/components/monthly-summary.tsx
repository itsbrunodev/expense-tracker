"use client";

import { useAtom } from "jotai";
import { ArrowDownLeftIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { hoveredStatisticAtom } from "@/lib/store";
import { ISummaryMonth } from "@/lib/supabase/utils/summary";
import { TTransactionTypes } from "@/lib/types";
import { cn, formatNumber, percentageDifference } from "@/lib/utils";

import { Counter } from "./counter";

export function MonthlySummary({
  currency = "USD",
  income,
  expense,
  investment,
  savings,
  previousMonth,
}: {
  currency: string;
  income: ISummaryMonth["income"];
  expense: ISummaryMonth["expense"];
  investment: ISummaryMonth["investment"];
  savings: ISummaryMonth["savings"];
  previousMonth: ISummaryMonth["previousMonth"] | null;
}) {
  const locale = useLocale();
  const t = useTranslations();

  const [hoveredStatistic, setHoveredStatistic] = useAtom(hoveredStatisticAtom);

  const formatOptions: Parameters<typeof formatNumber>["0"]["formatOptions"] = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  };

  const renderIncreaseDecreaseIcon = (
    key: TTransactionTypes,
    value: number,
    inverseColors: boolean
  ) => {
    const percentage = percentageDifference(
      previousMonth ? previousMonth[key] : 0,
      value
    );

    return (
      <>
        <IncreaseDecreaseIcon
          value={percentage}
          inverseColors={inverseColors}
        />
        {t("vs-last-month", {
          value: formatNumber({
            value: percentage,
            showSign: true,
            locale,
            formatOptions,
          }).formattedValue,
        })}
      </>
    );
  };

  return (
    <>
      <div
        className="flex flex-col gap-2"
        onMouseEnter={() => setHoveredStatistic("income")}
        onMouseLeave={() => setHoveredStatistic(null)}
      >
        <div>
          <span className="text-green-600 dark:text-green-500">
            {t("income")}
          </span>
          <p className="text-xl font-semibold">
            <Counter value={income} locale={locale} />
            <span className="ml-0.5 text-sm font-normal text-zinc-900 dark:text-zinc-100">
              {currency}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-800 dark:text-zinc-100">
          {previousMonth ? (
            renderIncreaseDecreaseIcon("income", income, false)
          ) : (
            <>N/A</>
          )}
        </div>
      </div>
      <div
        className="flex flex-col gap-2"
        onMouseEnter={() => setHoveredStatistic("expense")}
        onMouseLeave={() => setHoveredStatistic(null)}
      >
        <div>
          <div className="flex items-center justify-between text-red-600 dark:text-red-500">
            <span>{t("expenses")}</span>
          </div>
          <p className="text-xl font-semibold">
            <Counter value={expense} locale={locale} />
            <span className="ml-0.5 text-sm font-normal text-zinc-900 dark:text-zinc-100">
              {currency}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-800 dark:text-zinc-100">
          {previousMonth ? (
            renderIncreaseDecreaseIcon("expense", expense, true)
          ) : (
            <>N/A</>
          )}
        </div>
      </div>
      <div
        className="flex flex-col gap-2"
        onMouseEnter={() => setHoveredStatistic("investment")}
        onMouseLeave={() => setHoveredStatistic(null)}
      >
        <div>
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-500">
            <span>{t("investment")}</span>
          </div>
          <p className="text-xl font-semibold">
            <Counter value={investment} locale={locale} />
            <span className="ml-0.5 text-sm font-normal text-zinc-900 dark:text-zinc-100">
              {currency}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-800 dark:text-zinc-100">
          {previousMonth ? (
            renderIncreaseDecreaseIcon("investment", investment, false)
          ) : (
            <>N/A</>
          )}
        </div>
      </div>
      <div
        className="flex flex-col gap-2"
        onMouseEnter={() => setHoveredStatistic("savings")}
        onMouseLeave={() => setHoveredStatistic(null)}
      >
        <div>
          <div className="flex items-center justify-between text-yellow-600 dark:text-yellow-500">
            <span>{t("savings")}</span>
          </div>
          <p className="text-xl font-semibold">
            <Counter value={savings} locale={locale} />
            <span className="ml-0.5 text-sm font-normal text-zinc-900 dark:text-zinc-100">
              {currency}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-800 dark:text-zinc-100">
          {previousMonth ? (
            renderIncreaseDecreaseIcon("savings", savings, false)
          ) : (
            <>N/A</>
          )}
        </div>
      </div>
    </>
  );
}

function IncreaseDecreaseIcon({
  inverseColors,
  value,
}: {
  inverseColors: boolean;
  value: number;
}) {
  if (value > 0)
    return (
      <ArrowUpRightIcon
        className={cn(
          "size-4",
          inverseColors
            ? "text-red-600 dark:text-red-500"
            : "text-green-600 dark:text-green-500"
        )}
        strokeWidth={3}
      />
    );
  else if (value < 0)
    return (
      <ArrowDownLeftIcon
        className={cn(
          "size-4",
          inverseColors
            ? "text-green-600 dark:text-green-500"
            : "text-red-600 dark:text-red-500"
        )}
        strokeWidth={3}
      />
    );
  else
    return (
      <MinusIcon
        className="size-4 text-zinc-400 dark:text-zinc-500"
        strokeWidth={3}
      />
    );
}
