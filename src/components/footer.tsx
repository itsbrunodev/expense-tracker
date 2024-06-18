"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";

export const dynamic = "force-dynamic";

export function Footer({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <footer
      className={cn(
        "mx-auto mt-16 flex w-full max-w-4xl items-center justify-between border-t border-t-zinc-50 px-4 py-4 text-sm dark:border-t-zinc-900 xl:px-0",
        className
      )}
    >
      <p className="flex items-center font-medium text-zinc-600 dark:text-zinc-100">
        <Logo className="pointer-events-none mr-2 size-3.5 fill-zinc-700 dark:fill-zinc-200" />
        Expense Tracker
        <span className="ml-1 font-normal text-zinc-700 dark:text-zinc-200">
          {t.rich("by", {
            a: (text) => (
              <Link
                className="underline transition-colors hover:text-zinc-700 dark:hover:text-white"
                href="https://itsbruno.dev/"
                target="_blank"
              >
                {text}
              </Link>
            ),
          })}
        </span>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
