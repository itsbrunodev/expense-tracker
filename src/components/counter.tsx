"use client";

import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

import { cn, formatNumber } from "@/lib/utils";

/**
 * @link https://magicui.design/docs/components/number-ticker
 */
export function Counter({
  className,
  value = 0,
  locale = "en-US",
  onAnimationStart,
  onAnimationComplete,
}: {
  className?: string;
  value?: number;
  locale?: string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}) {
  const { mass, stiffness, damping } = {
    mass: 5,
    stiffness: 100,
    damping: 50,
  };

  const spring = useSpring(value, { mass, stiffness, damping });
  const display: MotionValue<string> = useTransform(
    spring,
    (current) =>
      formatNumber({
        value: current,
        locale,
      }).formattedValue
  );

  useEffect(() => {
    spring.set(value);
    if (onAnimationStart) onAnimationStart();
    const unsubscribe = spring.onChange(() => {
      if (spring.get() === value && onAnimationComplete) onAnimationComplete();
    });
    return () => unsubscribe();
  }, [spring, value, onAnimationStart, onAnimationComplete]);

  return (
    <motion.span className={cn("", className)}>
      {display}
    </motion.span>
  );
}
