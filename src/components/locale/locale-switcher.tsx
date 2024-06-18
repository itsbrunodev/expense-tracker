import { useLocale, useTranslations } from "next-intl";
import { CircleFlag } from "react-circle-flags";

import { LOCALES as localesWithoutName } from "@/lib/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LocaleRadioGroup } from "./locale-radio-group";

export default function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale();

  const locales = localesWithoutName.map((l) => ({
    ...l,
    name: t("locale", { locale: l.locale }),
  }));

  const currentLocaleObj = locales.find((l) => l.locale === locale)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full"
        title={currentLocaleObj.name}
      >
        <CircleFlag className="size-5" countryCode={currentLocaleObj.flag} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40" align="end">
        <LocaleRadioGroup
          currentLocale={currentLocaleObj.locale}
          locales={locales}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
