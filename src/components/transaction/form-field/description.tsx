import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { CharacterCounter } from "@/components/character-count";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DESCRIPTION_CHAR_LIMIT } from "@/lib/constants";

import { TTransactionForm } from "../form-schema";

export function DescriptionField({
  form,
}: {
  form: UseFormReturn<TTransactionForm>;
}) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("description")}</FormLabel>
          <FormControl /* className="relative" */>
            <Textarea
              className="max-h-28"
              placeholder={t("description-placeholder")}
              maxLength={DESCRIPTION_CHAR_LIMIT}
              {...field}
            />
            {/* <CharacterCounter
              currentLength={field.value?.length}
              maxLength={DESCRIPTION_CHAR_LIMIT}
            /> */}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
