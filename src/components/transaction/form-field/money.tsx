import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { CurrencyInput } from "../currency-input";
import { TTransactionForm } from "../form-schema";

export function MoneyField({
  currency,
  form,
}: {
  currency: string;
  form: UseFormReturn<TTransactionForm>;
}) {
  return (
    <div className="flex items-center justify-center py-12">
      <ScrollArea>
        <ScrollBar orientation="horizontal" />
        <div className="flex items-end overflow-x-auto">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="">
                <FormControl className="relative inline-block">
                  <CurrencyInput
                    rawValue={field.value}
                    onChange={(e) => {
                      field.onChange(e.rawValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="mb-2 text-lg font-medium text-zinc-800 dark:text-zinc-100">
            {currency}
          </span>
        </div>
      </ScrollArea>
    </div>
  );
}
