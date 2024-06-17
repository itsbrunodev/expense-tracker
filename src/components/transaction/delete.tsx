"use client";

import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteTransaction } from "@/lib/actions/transaction";
import { DEFAULT_TOAST_OPTIONS } from "@/lib/constants";
import { TTransaction } from "@/lib/supabase/utils/other";

import { Button } from "../ui/button";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";

export function DeleteTransaction({
  transaction,
}: {
  transaction: TTransaction;
}) {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);

  function onDelete() {
    startTransition(async () => {
      const toastId = toast.loading(t("transaction-deleting"), {
        ...DEFAULT_TOAST_OPTIONS,
      });

      await deleteTransaction(transaction).then(() => {
        toast.success(t("transaction-deleting-success"), {
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
        <Button variant="destructive">
          <TrashIcon className="mr-1.5 size-3.5" /> {t("delete")}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("transaction-delete-title")}</CredenzaTitle>
          <CredenzaDescription>
            {t("transaction-delete-description")}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </CredenzaClose>
          <Button variant="destructive" onClick={onDelete}>
            {t("transaction-delete-confirm")}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
