"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { newTransaction } from "@/lib/actions/transaction";
import { DEFAULT_TOAST_OPTIONS } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { CategorySelectField } from "./form-field/category-select";
import { DateField } from "./form-field/date";
import { DescriptionField } from "./form-field/description";
import { MoneyField } from "./form-field/money";
import { TitleField } from "./form-field/title";
import { TransactionTypeTabsField } from "./form-field/type-tabs";
import { TTransactionForm, transactionFormSchema } from "./form-schema";

export function NewTransaction({ currency }: { currency: string }) {
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TTransactionForm>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      transaction_date: new Date(),
      title: "",
      description: "",
      categories: [],
      transaction_type: "income",
    },
  });

  const t = useTranslations();

  function onSubmit(values: TTransactionForm) {
    startTransition(async () => {
      const toastId = toast.loading(t("transaction-creating"), {
        ...DEFAULT_TOAST_OPTIONS,
      });

      await newTransaction({
        ...values,
      }).then(() => {
        toast.success(t("transaction-creating-success"), {
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
        <Button>
          <PlusIcon className="mr-1 size-4" />
          {t("add")}
        </Button>
      </CredenzaTrigger>
      <ScrollArea>
        <ScrollBar orientation="vertical" />
        <CredenzaContent className="flex flex-col px-8 pb-8 pt-2">
          <CredenzaHeader>
            <CredenzaTitle className="text-center text-lg font-medium text-black dark:text-white">
              {t("new-transaction")}
            </CredenzaTitle>
          </CredenzaHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <MoneyField currency={currency} form={form} />
                <div className="flex flex-col gap-4">
                  <TransactionTypeTabsField form={form} />
                  <TitleField form={form} />
                  <DescriptionField form={form} />
                  <DateField form={form} />
                  <CategorySelectField form={form} />
                </div>
              </div>
              <CredenzaFooter className="mt-6">
                <Button
                  className="w-full"
                  type="submit"
                  size="lg"
                  disabled={form.getValues("amount") === 0 || isPending}
                >
                  {t("add-transaction")}
                </Button>
              </CredenzaFooter>
            </form>
          </Form>
        </CredenzaContent>
      </ScrollArea>
    </Credenza>
  );
}
