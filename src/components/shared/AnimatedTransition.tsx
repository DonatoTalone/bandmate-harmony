
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slide-up" | "slide-down" | "scale";
  duration?: number;
  delay?: number;
}

export function AnimatedTransition({
  children,
  className,
  variant = "fade",
  duration = 0.3,
  delay = 0,
}: AnimatedTransitionProps) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    "slide-up": {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    "slide-down": {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  };

  return (
    <motion.div
      initial={variants[variant].initial}
      animate={variants[variant].animate}
      exit={variants[variant].exit}
      transition={{ duration, delay, ease: "easeInOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
