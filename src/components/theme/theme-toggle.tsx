"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex gap-1.5">
      <Button
        className="size-fit rounded-full border p-1.5"
        variant={theme === "dark" ? "default" : "outline"}
        size="icon"
        aria-label="Dark mode"
        title="Dark"
        onClick={() => {
          setTheme("dark");
        }}
      >
        <MoonIcon className="size-4" />
      </Button>
      <Button
        className="size-fit rounded-full border p-1.5"
        variant={theme === "light" ? "default" : "outline"}
        size="icon"
        aria-label="Light mode"
        title="Light"
        onClick={() => {
          setTheme("light");
        }}
      >
        <SunIcon className="size-4" />
      </Button>
      <Button
        className="size-fit rounded-full border p-1.5"
        variant={theme === "system" ? "default" : "outline"}
        size="icon"
        aria-label="System mode"
        title="System"
        onClick={() => {
          setTheme("system");
        }}
      >
        <MonitorIcon className="size-4" />
      </Button>
    </div>
  );
}
