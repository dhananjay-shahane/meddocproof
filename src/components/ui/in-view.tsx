"use client";

import {
  motion,
  useInView,
  type Variant,
  type UseInViewOptions,
  type Transition,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface InViewProps {
  children: React.ReactNode;
  className?: string;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
}

const defaultVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const defaultTransition: Transition = { duration: 0.5, ease: "easeOut" };
const defaultViewOptions: UseInViewOptions = { once: true, margin: "0px 0px -80px 0px" };

export function InView({
  children,
  className,
  variants = defaultVariants,
  transition = defaultTransition,
  viewOptions = defaultViewOptions,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
