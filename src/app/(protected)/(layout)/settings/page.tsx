import { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

import { CurrencySelect } from "@/components/settings/currency-select";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/supabase/utils/other";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("settings")} - Expense Tracker`,
    icons: {
      icon: (await parent).icons?.icon,
    },
  };
}

export default async function Page() {
  const t = await getTranslations();

  const supabase = createClient();

  const userId = (await supabase.auth.getUser()).data.user?.id!;

  const { settings, error: settingsError } = await getSettings(userId);
  /* const { profile } = await getProfile(); */

  if (settingsError) return "No data";

  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-4xl font-extrabold">{t("settings")}</h1>
      <div className="flex flex-col gap-8">
        <div className="grid w-full grid-cols-2 gap-20">
          <div className="space-y-1">
            <p className="font-medium">{t("currency")}</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {t("setting-currency")}
            </p>
          </div>
          <CurrencySelect currency={settings.currency} />
        </div>
        <Separator />
        <div className="grid w-full grid-cols-2 gap-20">
          <div className="space-y-1">
            <p className="font-medium">{t("categories")}</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {t("setting-categories")}
            </p>
          </div>
          <div className="my-auto ml-auto">N/A</div>
        </div>
        <Separator />
        <div className="grid w-full grid-cols-2 gap-20 rounded-lg border border-red-400 bg-red-400/20 p-4 dark:border-red-500 dark:bg-red-500/20">
          <div className="space-y-1">
            <p className="font-medium text-red-700 dark:text-red-200">
              {t("delete-account")}
            </p>
            <p className="text-sm text-red-600 dark:text-red-300">
              {t("setting-delete-account")}
            </p>
          </div>
          <div className="my-auto ml-auto">
            <Credenza>
              <CredenzaTrigger asChild>
                <Button variant="destructive">{t("delete-account")}</Button>
              </CredenzaTrigger>
              <form /* action={} */>
                <CredenzaContent>
                  <CredenzaHeader>
                    <CredenzaTitle>{t("delete-account-title")}</CredenzaTitle>
                    <CredenzaDescription>
                      {t("delete-account-description")}
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaFooter>
                    <CredenzaClose asChild>
                      <Button variant="outline">{t("cancel")}</Button>
                    </CredenzaClose>
                    <Button variant="destructive">
                      {t("delete-account-confirm")}
                    </Button>
                  </CredenzaFooter>
                </CredenzaContent>
              </form>
            </Credenza>
          </div>
        </div>
      </div>
    </div>
  );
}
