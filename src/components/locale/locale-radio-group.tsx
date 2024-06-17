"use client";

import { useTransition } from "react";
import { CircleFlag } from "react-circle-flags";

import { setLocale } from "@/lib/actions/locale";
import { cn } from "@/lib/utils";

import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";

export function LocaleRadioGroup({
  locales,
  currentLocale,
}: {
  locales: {
    name: string;
    locale: string;
    flag: string;
  }[];
  currentLocale: string;
}) {
  const [isPending, startTransition] = useTransition();

  function onValueChange(str: string) {
    startTransition(() => {
      setLocale(str);
    });
  }

  return (
    <DropdownMenuRadioGroup value={currentLocale} onValueChange={onValueChange}>
      {/* <CircleFlag className="size-5" countryCode={locales.flag} /> */}
      {/* {locales.name} */}
      {locales.map((loc, i) => (
        <DropdownMenuRadioItem
          /* name={loc.name}
          locale={loc.locale}
          currentLocale={locale} */
          value={loc.locale}
          key={i}
        >
          {loc.name}
          <CircleFlag
            className="ml-auto size-4"
            countryCode={loc.flag}
            title={undefined}
          />
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  /* return (
    <DropdownMenuItem
      className={cn(
        locale === currentLocale ? "bg-zinc-100 dark:bg-zinc-800" : "opacity-50"
      )}
      disabled={isPending}
      onClick={() => onSelect(locale)}
    >
      {name}
    </DropdownMenuItem>
  ); */
}
