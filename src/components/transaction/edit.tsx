"use client";

import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateTransaction } from "@/lib/actions/transaction";
import { DEFAULT_TOAST_OPTIONS } from "@/lib/constants";
import { TTransaction } from "@/lib/supabase/utils/other";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Credenza,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";
import { CategorySelectField } from "./form-field/category-select";
import { DateField } from "./form-field/date";
import { DescriptionField } from "./form-field/description";
import { MoneyField } from "./form-field/money";
import { TitleField } from "./form-field/title";
import { TransactionTypeSelectField } from "./form-field/type-select";
import { TTransactionForm, transactionFormSchema } from "./form-schema";

export function EditTransaction({
  currency,
  transaction,
}: {
  transaction: TTransaction;
  currency: string;
}) {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: TTransactionForm = {
    amount: transaction.amount,
    transaction_date: new Date(transaction.transaction_date),
    transaction_type:
      transaction.transaction_type as TTransactionForm["transaction_type"],
    title: transaction.title,
    description: transaction.description || undefined,
    categories: transaction.categories,
  };

  const form = useForm<TTransactionForm>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  function onSubmit(values: TTransactionForm) {
    startTransition(async () => {
      const toastId = toast.loading(t("transaction-editing"), {
        ...DEFAULT_TOAST_OPTIONS,
      });

      await updateTransaction(transaction.transaction_id, defaultValues, {
        ...values,
      }).then(() => {
        toast.success(t("transaction-editing-success"), {
          id: toastId,
          ...DEFAULT_TOAST_OPTIONS,
        });
      });
    });
  }

  useEffect(() => {
    if (isPending) return;

    setIsOpen(false);
  }, [isPending]);

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline">
          <PencilIcon className="mr-1.5 size-3.5" />
          {t("edit")}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="flex flex-col px-8 pb-8 pt-2">
        <CredenzaHeader>
          <CredenzaTitle className="text-center text-lg font-medium text-black dark:text-white">
            {t("transaction-edit")}
          </CredenzaTitle>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <MoneyField currency={currency} form={form} />
              <div className="flex flex-col gap-4">
                <TransactionTypeSelectField form={form} />
                <TitleField form={form} />
                <DescriptionField form={form} />
                <DateField form={form} />
                <CategorySelectField form={form} />
              </div>
            </div>
            <CredenzaFooter className="mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
                disabled={form.getValues("amount") === 0 || isPending}
              >
                {t("reset")}
              </Button>
              <Button
                type="submit"
                disabled={form.getValues("amount") === 0 || isPending}
              >
                {t("transaction-edit")}
              </Button>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}
