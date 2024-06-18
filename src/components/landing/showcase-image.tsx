"use client";

import Image from "next/image";

import ShowcaseDark from "../../../public/showcase-dark.png";
import ShowcaseLight from "../../../public/showcase-light.png";

export function ShowcaseImage() {
  return (
    <div className="mx-auto mt-12 max-w-5xl">
      <div className="relative rounded-2xl">
        <div className="absolute bottom-0 left-0 right-0 z-10 h-full bg-gradient-to-t from-white dark:from-zinc-950" />
        <div className="aspect-video w-full overflow-hidden rounded-[inherit] border border-zinc-100 dark:border-zinc-800">
          <Image
            className="hidden size-full dark:inline"
            src={ShowcaseDark}
            alt="Dark mode showcase image"
            width={1920}
            height={1080}
            priority
          />
          <Image
            className="inline size-full dark:hidden"
            src={ShowcaseLight}
            alt="Light mode showcase image"
            width={1920}
            height={1080}
            priority
          />
        </div>
      </div>
    </div>
  );
}
