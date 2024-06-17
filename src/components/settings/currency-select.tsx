"use client";

import { useLocale, useTranslations } from "next-intl";
import { revalidatePath } from "next/cache";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSettings } from "@/lib/actions/settings";
import { DEFAULT_TOAST_OPTIONS } from "@/lib/constants";
import { capitalizeFirstLetter } from "@/lib/utils";

function getCurrencyNames(locale: string) {
  function name(currencyCode: string) {
    /* const locale = "en-US"; */
    const options = {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "name",
    };
    return Intl.NumberFormat(locale, options).format(0);
  }

  const supportedCurrencies = Intl.supportedValuesOf("currency");

  const rx = /(?<= ).+/;

  return supportedCurrencies.map((cur) => {
    let output = name(cur).trim();
    return {
      code: cur,
      name: output
        .match(rx)![0]
        .split(" ")
        .map((x) => capitalizeFirstLetter(x))
        .join(" "),
    };
  });
}

export function CurrencySelect({ currency }: { currency: string }) {
  const locale = useLocale();
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();

  function updateCurrency(newCurrency: string) {
    startTransition(async () => {
      const toastId = toast.loading(t("settings-updating"), {
        ...DEFAULT_TOAST_OPTIONS,
      });
      await updateSettings({ currency: newCurrency }).then(() => {
        toast.success(t("settings-updating-success"), {
          id: toastId,
          ...DEFAULT_TOAST_OPTIONS,
        });
      });
    });
  }

  return (
    <form action="">
      <Select onValueChange={updateCurrency} defaultValue={currency}>
        <SelectTrigger className="my-auto ml-auto w-48 overflow-hidden text-left [&>span]:text-clip">
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectGroup>
            {getCurrencyNames(locale).map((currency, i) => (
              <SelectItem value={currency.code} key={i}>
                <p className="font-medium">{currency.code}</p>
                <p className="text-xs text-zinc-700 dark:text-zinc-200">
                  {currency.name}
                </p>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}
