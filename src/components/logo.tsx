"use client";

import { SVGMotionProps, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function Logo(props: SVGMotionProps<SVGSVGElement>) {
  return (
    <motion.svg
      {...props}
      className={cn("fill-black stroke-none dark:fill-white", props.className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      whileHover={{
        rotate: 360,
        scale: 1.1,
        ...(props.whileHover && typeof props.whileHover === "object"
          ? props.whileHover
          : {}),
      }}
      transition={{
        type: "spring",
        duration: 0.05,
        stiffness: 200,
        damping: 15,
        mass: 1,
        velocity: 2,
        ...props.transition,
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 0H0L100 100H0L100 200H200L100 100H200L100 0Z"
        fill="inherit"
      />
    </motion.svg>
  );
}
