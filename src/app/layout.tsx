import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";

import { ClientProviders } from "@/components/client-providers";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import "./globals.css";

const regular = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Generated by create next app",
  icons: {
    icon: [
      {
        type: "image/png",
        media: "(prefers-color-scheme: light)",
        url: "/favicon-light.png",
      },
      {
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
        url: "/favicon-dark.png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="min-h-[100vh] overflow-y-scroll"
      suppressHydrationWarning
    >
      <body
        className={cn(
          regular.className,
          "relative h-full min-h-full bg-white antialiased dark:!bg-zinc-950"
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <div
                className="relative h-full min-h-full overflow-hidden"
                vaul-drawer-wrapper=""
              >
                {children}
                {/* <ThemeToggle /> */}
              </div>
            </ThemeProvider>
          </ClientProviders>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
