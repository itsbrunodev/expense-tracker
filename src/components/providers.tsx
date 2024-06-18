"use client";

import { useLocale } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProvider } from "react-aria";

export function Providers({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  return (
    <I18nProvider locale={locale}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </I18nProvider>
  );
}
