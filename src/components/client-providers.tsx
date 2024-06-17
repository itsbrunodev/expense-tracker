"use client";

import { useLocale } from "next-intl";
import { I18nProvider } from "react-aria";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  return <I18nProvider locale={locale}>{children}</I18nProvider>;
}
