"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Welcome } from "@/components/setup/welcome";
import { Wizard } from "@/components/setup/wizard";
import { SETUP_STEPS } from "@/lib/constants";

export default function Page() {
  const { replace } = useRouter();

  const [dismissedWelcome, setDismissedWelcome] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = SETUP_STEPS;

  return (
    <AnimatePresence mode="wait">
      {!dismissedWelcome && (
        <CenteredWithAnimation>
          <Welcome
            onClickSetup={() => setDismissedWelcome(true)}
            onClickSkip={() => replace("/home")}
          />
        </CenteredWithAnimation>
      )}
      {dismissedWelcome && (
        <CenteredWithAnimation>
          <Wizard
            currentStep={currentStep}
            completedSteps={completedSteps}
            steps={steps}
            onClickPrev={() => {
              if (currentStep === 0) return;
              setCurrentStep(currentStep - 1);
              setCompletedSteps((prev) =>
                prev.filter((x) => x !== currentStep - 1)
              );
            }}
            onClickNext={() => {
              if (currentStep === steps.length - 1) return;
              setCurrentStep(currentStep + 1);

              if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
              }
            }}
          />
        </CenteredWithAnimation>
      )}
    </AnimatePresence>
  );
}

function CenteredWithAnimation({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex h-screen w-full flex-col items-center justify-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      key="wizard"
    >
      {children}
    </motion.div>
  );
}
