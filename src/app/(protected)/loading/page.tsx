import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/logo";
import { LOADING_TIPS } from "@/lib/constants";

export default async function Loading() {
  const t = await getTranslations();

  const randomTip =
    LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-10 text-center">
        <Logo
          className="size-12"
          animate={{ rotate: 360 }}
          whileHover={undefined}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <div className="flex max-w-96 flex-col gap-2 md:px-0 px-4">
          <h1 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
            {t(randomTip.type).toUpperCase()}
          </h1>
          <p className="text-zinc-800 dark:text-zinc-50">{t(randomTip.text)}</p>
        </div>
      </div>
    </div>
  );
}
