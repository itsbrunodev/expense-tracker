import * as React from "react";

import { cn } from "@/lib/utils";

import { CharacterCounter } from "../character-count";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, ...props }, ref) => {
    const [valueLength, setValueLength] = React.useState(0);

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      setValueLength(e.currentTarget.value.length);
      if (props.onInput) {
        props.onInput(e);
      }
    };

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-zinc-100 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          onInput={handleInput}
          {...props}
        />
        <CharacterCounter currentLength={valueLength} maxLength={maxLength} />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
