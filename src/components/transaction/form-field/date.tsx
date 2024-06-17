import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { TTransactionForm } from "../form-schema";

export function DateField({ form }: { form: UseFormReturn<TTransactionForm> }) {
  const t = useTranslations();

  return (
    <FormField
      control={form.control}
      name="transaction_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t("date")}</FormLabel>
          <DateTimePicker
            jsDate={field.value}
            onJsDateChange={field.onChange}
          />
          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start px-3 text-left font-normal",
                  !field.value && "text-opacity-20"
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto size-4 text-zinc-500 dark:text-zinc-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
