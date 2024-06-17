import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRANSACTION_TYPES } from "@/lib/constants";
import { capitalizeFirstLetter } from "@/lib/utils";

import { TTransactionForm } from "../form-schema";

export function TransactionTypeSelectField({
  form,
}: {
  form: UseFormReturn<TTransactionForm>;
}) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name="transaction_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("type")}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select the transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TRANSACTION_TYPES.map((type, i) => (
                    <SelectItem value={type} key={i}>
                      {capitalizeFirstLetter(t(type))}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
