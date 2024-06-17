import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TITLE_CHAR_LIMIT } from "@/lib/constants";

import { TTransactionForm } from "../form-schema";

export function TitleField({
  form,
}: {
  form: UseFormReturn<TTransactionForm>;
}) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("title")}</FormLabel>
          <FormControl>
            <Input
              placeholder={t("title-placeholder")}
              maxLength={TITLE_CHAR_LIMIT}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
