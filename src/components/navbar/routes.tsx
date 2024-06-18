"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createElement } from "react";

import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RoutesHorizontal() {
  const pathname = usePathname();

  const t = useTranslations();

  return (
    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-12 md:flex">
      {ROUTES.map((route, i) => (
        <Link
          href={route.path}
          className={cn(
            "inline-flex items-center gap-3 transition-opacity hover:opacity-80",
            pathname !== route.path && pathname !== "/" && "opacity-60"
          )}
          key={i}
        >
          {createElement(route.icon, { className: "size-5 -mt-0.5" })}{" "}
          {t(route.name)}
        </Link>
      ))}
    </div>
  );
}

export function RoutesVertical() {
  const pathname = usePathname();

  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 items-end">
      {ROUTES.map((route, i) => (
        <Link
          href={route.path}
          className={cn(
            "inline-flex items-center gap-2 transition-opacity hover:opacity-80",
            pathname !== route.path && pathname !== "/" && "opacity-60"
          )}
          key={i}
        >
          {createElement(route.icon, { className: "size-5 -mt-0.5" })}{" "}
          {t(route.name)}
        </Link>
      ))}
    </div>
  );
}
