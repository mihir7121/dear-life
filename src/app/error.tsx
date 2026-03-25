"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md"
      >
        <div className="text-6xl mb-6">⚡</div>
        <h2 className="font-display font-bold text-3xl mb-3">Something went wrong</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          An unexpected error occurred. It's been logged and we'll look into it.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </motion.div>
    </div>
  );
}
