"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Globe2 className="w-10 h-10 text-primary" />
        </motion.div>
        <h1 className="font-display font-bold text-4xl mb-3">This place doesn't exist</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for may have moved, been deleted, or never existed in the first place. Time to explore.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to your Atlas
        </Link>
      </motion.div>
    </div>
  );
}
