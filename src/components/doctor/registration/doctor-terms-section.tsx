"use client";

import { useState, useRef, useEffect } from "react";

interface DoctorTermsSectionProps {
  title: string;
  content: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export function DoctorTermsSection({
  title,
  content,
  checked,
  onChange,
  required = true,
}: DoctorTermsSectionProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isNearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
      if (isNearBottom) setScrolledToBottom(true);
    };

    // Check if content is shorter than container (already at bottom)
    if (el.scrollHeight <= el.clientHeight) {
      setScrolledToBottom(true);
    }

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-foreground">
        {title} {required && <span className="text-red-500">*</span>}
      </h4>
      
      <div
        ref={scrollRef}
        className="max-h-48 overflow-y-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground scrollbar-thin"
      >
        <p className="whitespace-pre-line">{content}</p>
      </div>
      
      {!scrolledToBottom && (
        <p className="text-xs text-amber-600 dark:text-amber-500">
          Please scroll through the content above to accept.
        </p>
      )}
      
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={!scrolledToBottom}
          className="mt-0.5 h-4 w-4 rounded border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="text-sm text-foreground">
          I have read, understood, and agree to the {title.toLowerCase()}
        </span>
      </label>
    </div>
  );
}
