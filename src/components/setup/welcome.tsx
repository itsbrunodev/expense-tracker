import { useTranslations } from "next-intl";

import { Button } from "../ui/button";

export function Welcome({
  onClickSetup,
  onClickSkip,
}: {
  onClickSetup: () => void;
  onClickSkip: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex max-w-96 flex-col items-center gap-6">
      {/* <Logo className="mb-6 size-12" /> */}
      <div className="space-y-4 text-center">
        <p className="text-xl font-medium">{t("setup-title")}</p>
        <div className="space-y-2 text-zinc-600 dark:text-zinc-200">
          <p>{t("welcome-description")}</p>
          <p>{t("setup-footer")}</p>
        </div>
      </div>
      <div className="flex w-8/12 flex-col gap-2">
        <Button className="w-full" onClick={onClickSetup}>
          {t("setup-continue")}
        </Button>
        <Button className="w-full" variant="outline" onClick={onClickSkip}>
          {t("skip")}
        </Button>
      </div>
    </div>
  );
}
