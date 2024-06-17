import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

import { Balance } from "@/components/balance";
import { MonthSelect } from "@/components/month-select";
import { MonthlySummary } from "@/components/monthly-summary";
import { TransactionList } from "@/components/transaction/list";
import { NewTransaction } from "@/components/transaction/new";
import { TIMEFRAME_FORMAT, TIMEFRAME_KEY } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import {
  getProfile,
  getSettings,
  getTransactions,
} from "@/lib/supabase/utils/other";
import { getSummary, getSummaryMonths } from "@/lib/supabase/utils/summary";
import { TTransactionTypes } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("home")} - Expense Tracker`,
    icons: {
      icon: (await parent).icons?.icon,
    },
  };
}

/**
 * Renders the Home page.
 *
 * @param {object} searchParams - The search parameters.
 * @param {string} searchParams[TIMEFRAME_KEY] - The timeframe parameter.
 * @returns {Promise<JSX.Element>} The rendered Home page.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: { [TIMEFRAME_KEY]?: string };
}) {
  // Get the Supabase client
  const supabase = createClient();

  // Get the user ID from the session
  const userId = (await supabase.auth.getSession()).data.session?.user.id!;

  // Get the timeframe from the search parameters or the current month
  const timeframe = format(
    searchParams?.[TIMEFRAME_KEY] ||
      `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
    TIMEFRAME_FORMAT
  );

  // Get the profile, settings, summary, months, and transaction data for the user
  const [{ profile }, { settings }, { summary }, { months }, transactionData] =
    await Promise.all([
      getProfile(userId),
      getSettings(userId),
      getSummary(userId, timeframe),
      getSummaryMonths(userId),
      getTransactions(userId),
    ]);

  // Get the translations
  const t = await getTranslations();

  // Count the transactions by type for the given timeframe
  const transactionCounts: Record<TTransactionTypes, number> & {
    [key: string]: number;
  } = transactionData.transactions.reduce(
    (counts, transaction) => {
      if (
        format(transaction.transaction_date, TIMEFRAME_FORMAT) === timeframe
      ) {
        counts[transaction.transaction_type] =
          (counts[transaction.transaction_type] || 0) + 1;
      }
      return counts;
    },
    {} as Record<TTransactionTypes, number> & { [key: string]: number }
  );

  // Render the Home page
  return (
    <div className="flex flex-col gap-16">
      {/* Summary */}
      <div className="flex flex-col gap-12">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold">{t("summary")}</h1>
          <MonthSelect months={months} />
        </div>
        {/* Balance */}
        <Balance
          balance={profile.balance}
          summary={summary}
          currency={settings.currency}
        />
      </div>
      {/* Monthly summary */}
      <div className="grid w-full grid-cols-4 gap-20">
        <MonthlySummary {...summary} currency={settings.currency} />
      </div>
      {/* Transactions */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{t("transactions")}</h1>
            <p className="text-sm text-zinc-700 dark:text-zinc-100">
              {t("monthly-summary", {
                income: transactionCounts.income || 0,
                expense: transactionCounts.expense || 0,
              })}
            </p>
          </div>
          {/* New transaction button */}
          <div className="flex items-center gap-4">
            <div>
              <NewTransaction currency={settings.currency} />
            </div>
          </div>
        </div>
        <TransactionList
          timeframe={timeframe}
          transactionData={transactionData}
          currency={settings.currency}
        />
      </div>
    </div>
  );
}
