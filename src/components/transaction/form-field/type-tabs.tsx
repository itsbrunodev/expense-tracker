import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TTransactionTypes } from "@/lib/types";
import { capitalizeFirstLetter, cn } from "@/lib/utils";

import { TTransactionForm } from "../form-schema";

export function TransactionTypeTabsField({
  form,
}: {
  form: UseFormReturn<TTransactionForm>;
}) {
  return (
    <FormField
      control={form.control}
      name="transaction_type"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-0.5 rounded-lg bg-zinc-50 p-1 dark:bg-zinc-800">
              <TypeButton
                type="expense"
                currentType={field.value}
                setType={field.onChange}
              />
              {
                <div
                  className={cn(
                    "my-auto h-5 w-px bg-zinc-700 opacity-0",
                    !["expense", "income"].includes(field.value) &&
                      "opacity-100"
                  )}
                />
              }
              <TypeButton
                type="income"
                currentType={field.value}
                setType={field.onChange}
              />
              {
                <div
                  className={cn(
                    "my-auto h-5 w-px bg-zinc-700 opacity-0",
                    !["income", "investment"].includes(field.value) &&
                      "opacity-100"
                  )}
                />
              }
              <TypeButton
                type="investment"
                currentType={field.value}
                setType={field.onChange}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TypeButton({
  type,
  currentType,
  setType,
}: {
  type: TTransactionTypes;
  currentType: TTransactionTypes;
  setType: (type: TTransactionTypes) => void;
}) {
  const t = useTranslations();

  return (
    <Button
      className={cn(
        "group w-full rounded-md",
        currentType === type
          ? ""
          : "text-zinc-400 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
      )}
      variant={currentType === type ? "inverted" : "ghost"}
      type="button"
      onClick={() => {
        setType(type);
      }}
    >
      <div className="mr-1.5 [&>svg]:size-4">
        {type === "expense" ? (
          <ArrowDownLeftIcon
            className={cn(
              "transition-color",
              currentType === type && "text-red-600 dark:text-red-500"
            )}
            strokeWidth={2.5}
          />
        ) : type === "income" ? (
          <ArrowUpRightIcon
            className={cn(
              "transition-color",
              currentType === type && "text-green-600 dark:text-green-500"
            )}
            strokeWidth={2.5}
          />
        ) : (
          <TrendingUpIcon
            className={cn(
              "transition-color",
              currentType === type && "text-indigo-600 dark:text-indigo-500"
            )}
            strokeWidth={2.5}
          />
        )}
      </div>
      {t(type)}
    </Button>
  );
}
