"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { SETUP_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

export function Wizard({
  currentStep,
  completedSteps,
  steps,
  onClickPrev,
  onClickNext,
}: {
  currentStep: number;
  completedSteps: number[];
  steps: typeof SETUP_STEPS;
  onClickPrev?: () => void;
  onClickNext?: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex w-full items-start justify-center gap-12">
      <div className="w-96 space-y-6 rounded-lg border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-1">
          <h1 className="text-xl font-medium">{t("setup")}</h1>
          <p className="text-zinc-600 dark:text-zinc-200">
            {t("setup-tooltip")}
          </p>
        </div>
        <div className="flex flex-col">
          {steps.map((step, index) => (
            <div key={index} className="groupa flex gap-4"> {/* TODO: groupa to group if possible */}
              <div className="flex flex-col items-center justify-start">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium tabular-nums transition-colors",
                    completedSteps.includes(index)
                      ? "bg-zinc-800 dark:bg-zinc-100"
                      : currentStep === index
                        ? "border-zinc-800 dark:border-zinc-100"
                        : "border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
                  )}
                >
                  <AnimatePresence>
                    {completedSteps.includes(index) ? (
                      <motion.div
                        initial={{ rotate: -90 }}
                        animate={{ rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <CheckIcon
                          className="size-3.5 text-zinc-100 dark:text-zinc-800"
                          strokeWidth={3.5}
                        />
                      </motion.div>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </AnimatePresence>
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      "my-2 h-10 w-0.5 transition-colors",
                      completedSteps.includes(index) /* &&
                    completedSteps.includes(index + 1) */
                        ? "bg-zinc-900 dark:bg-zinc-100"
                        : "bg-zinc-200 dark:bg-zinc-800"
                    )}
                  />
                )}
              </div>
              <div
                className={cn(
                  "text-left transition-opacity group-hover:opacity-70",
                  !completedSteps.includes(index) &&
                    currentStep !== index &&
                    "opacity-50"
                )}
              >
                <h1 className="font-medium">{t(step.title)}</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-200">
                  {t(step.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-full w-full max-w-xl flex-col justify-between py-6">
        <AnimatePresence mode="wait">
          <motion.div
            className="flex h-full flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.1 }}
            key={currentStep}
          >
            <h1 className="text-2xl font-semibold">
              {t(steps[currentStep].title)}
            </h1>
            <div className="m-auto"></div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClickPrev}>
            {t("back")}
          </Button>
          <Button onClick={onClickNext}>
            {currentStep === steps.length - 1 ? t("finish") : t("next")}
          </Button>
        </div>
      </div>
      {/* <ThemeToggle /> */}
    </div>
  );
}
