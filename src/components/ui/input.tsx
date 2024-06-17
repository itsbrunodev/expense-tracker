"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { CharacterCounter } from "../character-count";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, maxLength, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLInputElement
    );

    const [valueLength, setValueLength] = React.useState<number>(
      ref.current?.value.length || 0
    );

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      setValueLength(e.currentTarget.value.length);
      if (props.onInput) {
        props.onInput(e);
      }
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-zinc-100 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
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
Input.displayName = "Input";

export { Input };
