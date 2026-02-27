"use client";

import { useState, useRef, useEffect } from "react";
import { TERMS_AND_CONDITIONS_TEXT } from "@/lib/certificate-types";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function TermsCheckbox({ checked, onChange }: TermsCheckboxProps) {
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
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        Terms & Conditions <span className="text-red-500">*</span>
      </label>
      <div
        ref={scrollRef}
        className="max-h-48 overflow-y-auto rounded-lg border bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground"
      >
        <p className="whitespace-pre-line">{TERMS_AND_CONDITIONS_TEXT}</p>
      </div>
      {!scrolledToBottom && (
        <p className="text-xs text-amber-600">
          Please scroll through the terms & conditions above to accept.
        </p>
      )}
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={!scrolledToBottom}
          className="mt-0.5 h-4 w-4 rounded border accent-primary disabled:opacity-50"
        />
        <span className="text-sm">
          I agree to the{" "}
          <a href="/terms" target="_blank" className="text-primary underline">
            Terms & Conditions
          </a>
        </span>
      </label>
    </div>
  );
}
