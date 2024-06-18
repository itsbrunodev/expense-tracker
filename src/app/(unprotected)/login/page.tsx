import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/actions/auth";

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="max-w-80 space-y-6 text-center">
        <Link href="/">
          <Logo className="mx-auto size-12" />
        </Link>
        <div className="text-center">
          <p className="text-xl font-medium">Expense Tracker</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-200">
            {t("login-continue")}
          </p>
        </div>
        <form
          className="flex flex-col gap-6 rounded-xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
          action={signIn}
        >
          <div className="flex flex-col gap-2">
            <Button variant="default" name="github">
              {t("login-github")}
            </Button>
          </div>
        </form>
        <div className="space-y-2 rounded-xl border border-amber-500 bg-amber-500/20 p-6 text-left text-amber-700 dark:border-amber-600 dark:bg-amber-600/20 dark:text-amber-300">
          <h1 className="font-semibold">{t("warning")}</h1>
          <p className="text-sm">
            {t.rich("warning-description", {
              b: (text) => <b>{text}</b>,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
