import * as React from "react";

import { cn } from "@/lib/utils";

export function CharacterCounter({
  currentLength = 0,
  maxLength,
}: {
  currentLength?: number;
  maxLength?: number;
}) {
  if (!maxLength) return null;

  const showCharCount = currentLength / maxLength > 0.75;

  return showCharCount ? (
    <span
      className={cn(
        "pointer-events-none absolute bottom-3 right-3 transform text-xs font-medium text-zinc-500 dark:text-zinc-400",
        maxLength === currentLength && "text-red-600 dark:text-red-500"
      )}
    >
      {currentLength}/{maxLength}
    </span>
  ) : null;
}
