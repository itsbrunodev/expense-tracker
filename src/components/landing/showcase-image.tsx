"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

import ShowcaseDark from "../../../public/showcase-dark.png";
import ShowcaseLight from "../../../public/showcase-light.png";

export function ShowcaseImage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mx-auto mt-12 max-w-5xl">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute bottom-0 left-0 right-0 z-10 h-full bg-gradient-to-t from-white dark:from-zinc-950" />
        <Image
          className="aspect-video w-full rounded-[inherit] border border-zinc-100 dark:border-zinc-800"
          src={resolvedTheme === "light" ? ShowcaseLight : ShowcaseDark}
          alt="Showcase"
          width={1920}
          height={1080}
          draggable={false}
        />
      </div>
    </div>
  );
}
