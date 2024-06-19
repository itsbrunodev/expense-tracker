import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { CATEGORIES_VALUES } from "@/lib/constants";
import { TTransaction } from "@/lib/supabase/utils/other";
import { TTransactionTypes } from "@/lib/types";
import { capitalizeFirstLetter, cn, formatNumber } from "@/lib/utils";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";
import { DeleteTransaction } from "./delete";
import { EditTransaction } from "./edit";

export function TransactionDetails({
  transaction,
  currency,
  children,
}: {
  transaction: TTransaction;
  currency: string;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const localeFormatter = useFormatter();

  return (
    <Credenza>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent className="flex flex-col px-8 pb-8 pt-2">
        <CredenzaHeader>
          <CredenzaTitle className="text-center text-lg font-medium text-black dark:text-white">
            {t("transaction-details")}
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="flex flex-col gap-4">
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("title")}
            </span>
            <p className="max-h-fit select-all overflow-y-auto rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
              {transaction.title}
            </p>
          </div>
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("description")}
            </span>
            <p className="max-h-[4.5rem] min-h-[4.5rem] select-all overflow-y-auto break-all rounded-md bg-zinc-50 px-3 py-2 dark:bg-zinc-800 md:max-h-full">
              {t("description-not-found")}
            </p>
          </div>
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("type")}
            </span>
            <p>
              <span className="mr-1.5 inline-block align-middle [&>svg]:size-4">
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
              </span>
              {capitalizeFirstLetter(
                t(transaction.transaction_type as TTransactionTypes)
              )}
            </p>
          </div>
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("amount")}
            </span>
            <p
              className={cn(
                "font-medium",
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
            </p>
          </div>
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("transaction-date")}
            </span>
            <p>
              {localeFormatter.dateTime(new Date(transaction.transaction_date), {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              ({localeFormatter.relativeTime(new Date(transaction.transaction_date))})
            </p>
          </div>
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("categories")}
            </span>
            <div className="flex flex-wrap gap-1">
              {transaction.categories.length === 0
                ? t("categories-not-found")
                : (transaction.categories as typeof CATEGORIES_VALUES).map(
                    (category, i) => (
                      <Badge variant="secondary" key={i}>
                        {t(`category.value.${category}`)}
                      </Badge>
                    )
                  )}
            </div>
          </div>
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("created-at")}
            </span>
            <p>
              {localeFormatter.dateTime(new Date(transaction.created_at), {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              ({localeFormatter.relativeTime(new Date(transaction.created_at))})
            </p>
          </div>
          <div>
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {t("updated-at")}
            </span>
            <p>
              {localeFormatter.dateTime(new Date(transaction.updated_at), {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              ({localeFormatter.relativeTime(new Date(transaction.updated_at))})
            </p>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <EditTransaction currency={currency} transaction={transaction} />
          <DeleteTransaction transaction={transaction} />
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
