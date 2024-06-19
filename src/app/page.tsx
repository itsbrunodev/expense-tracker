import { ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { ShowcaseImage } from "@/components/landing/showcase-image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { FEATURES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="h-full w-full">
      <Navbar className="mb-0 max-w-5xl" />
      <div className="mx-auto flex min-h-[500px] w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 text-center xl:px-0">
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          {t.rich("landing.heading", {
            a: (text) => (
              <span className="bg-gradient-to-b from-zinc-500 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
                {text}
              </span>
            ),
            b: (text) => (
              <span className="bg-gradient-to-b from-green-500 to-green-700 bg-clip-text text-transparent dark:from-green-300 dark:to-green-600">
                {text}
              </span>
            ),
          })}
        </h1>
        <p className="max-w-xl leading-normal text-zinc-900 dark:text-zinc-50 md:text-lg">
          {t("landing.subheading")}
        </p>
        <Button className="h-fit px-4 py-2" asChild>
          <Link href="/login">
            {t("landing.cta")}
            <ArrowRightIcon
              className="my-auto ml-2 inline-block size-3.5"
              strokeWidth={2}
            />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-32 [&>*]:w-full">
        <div className="mx-auto max-w-5xl px-4 xl:px-0">
          <ShowcaseImage />
        </div>
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 xl:px-0">
          <h2 className="text-center text-3xl font-medium">
            {t("landing.features")}
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <div
                className={cn(
                  "group flex flex-col justify-start gap-2 transition-all md:items-start md:text-left",
                  i % 2 && "items-end text-right"
                )}
                key={i}
              >
                <div
                  className={cn(
                    "flex h-14 items-center gap-2 md:flex-row",
                    i % 2 && "flex-row-reverse"
                  )}
                >
                  <div className="rounded-md bg-gradient-to-b from-zinc-50 to-zinc-50/20 p-2.5 text-zinc-800 group-hover:from-green-100 group-hover:to-green-100/20 group-hover:text-green-800 dark:from-zinc-800 dark:to-zinc-800/20 dark:text-zinc-100 group-hover:dark:from-green-800 group-hover:dark:to-green-800/20 group-hover:dark:text-green-200">
                    <feature.icon className="size-8" strokeWidth={1} />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
                    {t(feature.title)}
                  </h3>
                </div>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">
                  {t(feature.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 xl:px-0">
          <div className="flex h-96 w-full flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-b from-green-400 to-green-700 px-4 text-center dark:from-green-600 dark:to-green-950 md:px-0">
            <h1 className="text-3xl font-bold md:text-4xl">
              {t("landing.ready")}
            </h1>
            <div className="flex max-w-[550px] flex-col items-center justify-center gap-3">
              <p className="text-zinc-800 dark:text-zinc-50 md:text-lg">
                {t("landing.subheading")}
              </p>
              <Button className="h-fit px-4 py-2" asChild>
                <Link href="/login">
                  {t("landing.cta")}
                  <ArrowRightIcon
                    className="my-auto ml-2 inline-block size-3.5"
                    strokeWidth={2}
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer className="max-w-5xl" />
    </div>
  );
}
