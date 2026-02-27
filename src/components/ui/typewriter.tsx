"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
}

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  loop = true,
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const currentWord = words[currentWordIndex];

  const typeNextChar = useCallback(() => {
    if (isWaiting) return;

    if (!isDeleting) {
      // Typing
      if (currentText.length < currentWord.length) {
        setCurrentText(currentWord.slice(0, currentText.length + 1));
      } else {
        // Finished typing, wait before deleting
        setIsWaiting(true);
        setTimeout(() => {
          setIsWaiting(false);
          setIsDeleting(true);
        }, delayBetweenWords);
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        setCurrentText(currentText.slice(0, -1));
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        if (loop || currentWordIndex < words.length - 1) {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }
  }, [currentText, currentWord, isDeleting, isWaiting, delayBetweenWords, loop, currentWordIndex, words.length]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(typeNextChar, speed);
    return () => clearTimeout(timer);
  }, [typeNextChar, isDeleting, deletingSpeed, typingSpeed]);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="inline-block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        className={cn(
          "inline-block w-0.75 h-[1em] bg-current ml-1 translate-y-[0.1em]",
          cursorClassName
        )}
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </span>
  );
}

// Alternative: Character-by-character reveal with stagger effect
interface TypewriterRevealProps {
  text: string;
  className?: string;
  charClassName?: string;
  staggerDuration?: number;
  onComplete?: () => void;
}

export function TypewriterReveal({
  text,
  className,
  charClassName,
  staggerDuration = 0.03,
  onComplete,
}: TypewriterRevealProps) {
  const characters = text.split("");

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      animate="visible"
      onAnimationComplete={onComplete}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDuration,
          },
        },
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className={cn("inline-block", charClassName)}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.1,
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
