"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Globe2, MapPin, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AppPreviewAnimation } from "@/components/landing/AppPreviewAnimation";

const FEATURES = [
  {
    icon: Globe2,
    title: "Your world, mapped",
    desc: "An interactive 3D globe shows every place you've been, with glowing markers for every memory.",
  },
  {
    icon: MapPin,
    title: "Every kind of memory",
    desc: "Concerts, restaurants, sunrises, milestones, quiet cafés, life-changing trips — all of it.",
  },
  {
    icon: Sparkles,
    title: "Cinematic by design",
    desc: "Not a database. A scrapbook. Every page feels like something worth keeping.",
  },
];

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  },
};

export default function MarketingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-border/50">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-lg tracking-tight">Dear Life</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              Open Atlas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero split ──────────────────────────────────────────────────── */}
      <section className="min-h-screen pt-16 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 py-16 lg:py-0 items-center">

          {/* Left — copy (below animation on mobile, left on desktop) */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger.container}
            className="flex flex-col items-start order-2 lg:order-1"
          >
            <motion.div
              variants={stagger.item}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/8 text-primary text-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Your personal memory universe
            </motion.div>

            <motion.h1
              variants={stagger.item}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95] mb-6"
            >
              Everything
              <br />
              <span className="text-gradient">you've lived</span>
              <br />
              in one place
            </motion.h1>

            <motion.p
              variants={stagger.item}
              className="text-lg text-muted-foreground max-w-md mb-10 leading-relaxed"
            >
              Concerts. Restaurants. Sunrises. Milestones. Pin them on a living globe.
              Relive them in a cinematic scrapbook.
            </motion.p>

            <motion.div
              variants={stagger.item}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth hover:shadow-depth-lg hover:-translate-y-0.5"
                >
                  Open your Atlas
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth hover:shadow-depth-lg hover:-translate-y-0.5"
                  >
                    Start your Atlas
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-6 py-4 rounded-full border border-border hover:border-foreground/20 text-sm"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </motion.div>

            {/* Social proof / stat strip */}
            <motion.div
              variants={stagger.item}
              className="mt-12 flex items-center gap-6"
            >
              {[
                { value: "100%", label: "Private" },
                { value: "∞", label: "Memories" },
                { value: "195", label: "Countries" },
              ].map(({ value, label }) => (
                <div key={label} className="text-left">
                  <p className="font-display font-bold text-2xl text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — app preview animation (top on mobile, right on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="flex items-center justify-center lg:justify-end order-1 lg:order-2"
          >
            <AppPreviewAnimation />
          </motion.div>

        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger.container}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={stagger.item}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4">
            Your life deserves
            <br />
            <span className="text-gradient">a beautiful home</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Start for free. No credit card required.
          </p>
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth"
            >
              Back to my Atlas <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth"
            >
              Create your Atlas <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Globe2 className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold">Dear Life</span>
        </div>
        <p className="mt-2 text-xs">Your memories. Your world.</p>
      </footer>

    </div>
  );
}
