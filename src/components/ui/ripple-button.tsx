"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleButtonProps extends ButtonProps {
  rippleColor?: string;
  rippleDuration?: number;
  withHoverScale?: boolean;
  withPressEffect?: boolean;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      children,
      className,
      rippleColor = "rgba(255, 255, 255, 0.4)",
      rippleDuration = 600,
      withHoverScale = true,
      withPressEffect = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const addRipple = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple: Ripple = {
          id: Date.now(),
          x,
          y,
          size,
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, rippleDuration);
      },
      [rippleDuration]
    );

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        addRipple(event);
        onClick?.(event);
      },
      [addRipple, onClick]
    );

    return (
      <motion.div
        whileHover={withHoverScale ? { scale: 1.02 } : undefined}
        whileTap={withPressEffect ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
        className="inline-flex"
      >
        <Button
          ref={ref}
          className={cn("relative overflow-hidden", className)}
          onClick={handleClick}
          {...props}
        >
          {children}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                initial={{ transform: "scale(0)", opacity: 0.5 }}
                animate={{ transform: "scale(1)", opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: rippleDuration / 1000, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  borderRadius: "50%",
                  backgroundColor: rippleColor,
                  pointerEvents: "none",
                }}
              />
            ))}
          </AnimatePresence>
        </Button>
      </motion.div>
    );
  }
);

RippleButton.displayName = "RippleButton";

// Animated Link Button for hero sections
interface AnimatedLinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "outline-white";
}

export function AnimatedLinkButton({
  href,
  children,
  className,
  variant = "primary",
}: AnimatedLinkButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  const baseStyles =
    variant === "primary"
      ? "bg-primary hover:bg-brand-primary-hover text-primary-foreground shadow-lg hover:shadow-xl"
      : variant === "outline-white"
      ? "bg-transparent border-2 border-white text-white hover:bg-white/10"
      : "bg-card border-2 border-primary/30 hover:border-primary text-foreground hover:text-brand-primary-dark";

  return (
    <motion.a
      href={href}
      onClick={addRipple}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-semibold py-4 px-8 rounded-full transition-all duration-300 overflow-hidden",
        baseStyles,
        className
      )}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ transform: "scale(0)", opacity: 0.4 }}
            animate={{ transform: "scale(1)", opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              borderRadius: "50%",
              backgroundColor:
                variant === "primary" || variant === "outline-white"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(6, 101, 219, 0.2)",
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>
    </motion.a>
  );
}

export { RippleButton };
