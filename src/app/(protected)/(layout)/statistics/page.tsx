import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import colors from "tailwindcss/colors";

import { BalanceStatistic } from "@/components/statistics/balance";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/supabase/utils/other";
import { getSummaries } from "@/lib/supabase/utils/summary";
import { formatNumber } from "@/lib/utils";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("statistics")} - Expense Tracker`,
    icons: {
      icon: (await parent).icons?.icon,
    },
  };
}

export default async function Statistics() {
  const t = await getTranslations();

  const supabase = createClient();

  const userId = (await supabase.auth.getSession()).data.session?.user.id!;

  const { summaries } = await getSummaries(userId);
  const { settings } = await getSettings(userId);

  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-4xl font-extrabold">{t("statistics")}</h1>
      <BalanceStatistic
        className="!h-72 !w-full"
        data={summaries.map((summary) => ({
          Date: format(new Date(summary.date), "MMMM, yyyy"),
          Balance: summary.balance,
          Currency: settings.currency,
          Income: summary.income,
          Expense: summary.expense,
          Investment: summary.investment,
          Savings: summary.savings,
        }))}
        keys={[
          /* {
            name: "Balance",
            dataKey: "Balance",
            stackId: "b",
            color: [colors.zinc[600], colors.zinc[500]],
          }, */
          {
            name: "Expense",
            dataKey: "Expense",
            stackId: "a",
            color: [colors.red[600], colors.red[500]],
          },
          {
            name: "Income",
            dataKey: "Income",
            stackId: "a",
            color: [colors.green[600], colors.green[500]],
          },
          /* {
            name: "Investment",
            dataKey: "Investment",
            stackId: "e",
            color: [colors.indigo[600], colors.indigo[500]],
          },
          {
            name: "Savings",
            dataKey: "Savings",
            stackId: "a",
            color: [colors.yellow[600], colors.yellow[500]],
          }, */
        ]}
        xAxisLabel="Date"
      />
    </div>
  );
}
