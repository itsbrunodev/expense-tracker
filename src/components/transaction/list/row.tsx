import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";

import { CATEGORIES_VALUES } from "@/lib/constants";
import { TTransaction } from "@/lib/supabase/utils/other";
import { cn, formatNumber } from "@/lib/utils";

import { CategorySliced } from "../category-sliced";
import { TransactionDetails } from "../details";

export function TransactionListRow({
  transaction,
  currency,
}: {
  transaction: TTransaction;
  currency: string;
}) {
  const { resolvedTheme } = useTheme();

  const locale = useLocale();

  return (
    <TransactionDetails transaction={transaction} currency={currency}>
      <tr
        className="bg-zinc grid cursor-pointer grid-cols-12 border-t border-zinc-50 py-3.5 last:border-b dark:border-zinc-800"
        tabIndex={
          0
        } /* border-t border-zinc-50 py-3.5 last:border-b dark:border-zinc-800 */
      >
        <td className="col-span-3 flex items-center gap-2">
          <div className="[&>svg]:size-4">
            {transaction.transaction_type === "expense" && (
              <ArrowDownLeftIcon
                className="text-red-600 dark:text-red-500"
                strokeWidth={3}
              />
            )}
            {transaction.transaction_type === "income" && (
              <ArrowUpRightIcon
                className="text-green-600 dark:text-green-500"
                strokeWidth={3}
              />
            )}
            {transaction.transaction_type === "investment" && (
              <TrendingUpIcon
                className="text-indigo-600 dark:text-indigo-500"
                strokeWidth={2}
              />
            )}
          </div>
          {/* <div
            className="flex size-10 items-center justify-center rounded-md border border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
            style={{
              color: getContrastingColor(
                resolvedTheme as "dark" | "light",
                SiSpotifyHex
              ),
            }}
          >
            <SiSpotify className="size-5" />
          </div> */}
          <span className="font-medium">{transaction.title}</span>
        </td>
        <td className="col-span-7">
          <CategorySliced
            categories={transaction.categories as typeof CATEGORIES_VALUES}
            maxCategories={4}
            badgeVariant="outline"
          />
        </td>
        <td
          className={cn(
            "col-span-2 text-right font-medium",
            transaction.transaction_type === "income" &&
              "text-green-600 dark:text-green-500",
            transaction.transaction_type === "expense" &&
              "text-red-600 dark:text-red-500"
          )}
        >
          {
            formatNumber({
              value:
                transaction.transaction_type === "expense"
                  ? -transaction.amount
                  : transaction.amount,
              showSign: true,
              locale,
            }).formattedValue
          }{" "}
          {currency}
        </td>
      </tr>
    </TransactionDetails>
  );
}
