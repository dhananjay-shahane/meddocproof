"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends ButtonProps {
  loading?: boolean;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ loading, children, disabled, className, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          size="lg"
          disabled={disabled || loading}
          className={cn("w-full text-sm font-semibold", className)}
          {...props}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {children}
        </Button>
      </motion.div>
    );
  }
);
AuthButton.displayName = "AuthButton";

export { AuthButton };
