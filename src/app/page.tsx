import { ArrowRightIcon } from "lucide-react";

import { Footer } from "@/components/footer";
import { ShowcaseImage } from "@/components/landing/showcase-image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-full w-full">
      <Navbar className="max-w-5xl" />
      <div className="mx-auto flex min-h-[425px] w-full max-w-5xl flex-col items-center justify-center gap-8 text-center">
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight">
          <span className="bg-gradient-to-b from-zinc-500 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:to-zinc-300">
            Take Charge of Your Finances with{" "}
          </span>
          <span className="bg-gradient-to-b from-green-500 to-green-700 bg-clip-text text-transparent dark:from-green-300 dark:to-green-600">
            Ease
          </span>
        </h1>
        <p className="max-w-xl text-lg leading-normal text-zinc-900 dark:text-zinc-50">
          Keep track of expenses, manage budgets, and achieve your financial
          goals effortlessly with our all-in-one expense tracker.
        </p>
        <Button className="h-fit px-4 py-2" asChild>
          <Link href="/login">
            Get Started for free{" "}
            <ArrowRightIcon
              className="my-auto ml-2 inline-block size-3.5"
              strokeWidth={2}
            />
          </Link>
        </Button>
      </div>
      <ShowcaseImage />
      <Footer className="max-w-5xl" />
    </div>
  );
}

/* <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-3 grid-rows-2 gap-2">
        <div className="col-span-2 flex size-full items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="w-1/2 space-y-4 p-8">
            <h1 className="text-2xl font-semibold">
              Comprehensive Expense Tracking
            </h1>
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-50">
              Keep track of all your expenses in one place. Categorize your
              spending, set budgets, and gain insights into your financial
              habits.
            </p>
          </div>
          <Image
            className="aspect-square h-full w-1/2 pr-8"
            src={
              resolvedTheme === "light" ? FinanceGrowthLight : FinanceGrowthDark
            }
            alt="Finance Growth"
            width={500}
            height={500}
            draggable={false}
          />
        </div>
        <div className="row-span-2 flex flex-col justify-center rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
          <Image
            className="my-auto p-6"
            src={
              resolvedTheme === "light"
                ? KeynotePresentationLight
                : KeynotePresentationDark
            }
            alt="Keynote Presentation"
            width={500}
            height={500}
            draggable={false}
          />
          <div className="mt-auto space-y-4 p-8">
            <h1 className="text-2xl font-semibold">
              Detailed Financial Statistics
            </h1>
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-50">
              Get detailed monthly summaries of your balance, income, expenses,
              investments, and savings. Visualize your financial health with
              intuitive charts and graphs.
            </p>
          </div>
        </div>
        <div className="col-span-2 flex size-full items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="w-1/2 space-y-4 p-8">
            <h1 className="text-2xl font-semibold">Goal-Oriented Savings</h1>
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-50">
              Set and achieve your savings goals effortlessly. Track your
              progress, automate your savings, and stay motivated with
              personalized tips.
            </p>
          </div>
          <Image
            className="h-10/12 w-1/2 self-center pr-8"
            src={resolvedTheme === "light" ? RichLight : RichDark}
            alt="Rich"
            width={500}
            height={500}
            draggable={false}
          />
        </div>
      </div> */
