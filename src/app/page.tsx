"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Globe2, MapPin, Sparkles, Play } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const PREVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80",
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
];

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
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-border/50">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-lg tracking-tight">Atlas of Me</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedOut>
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
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              Open Atlas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden"
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(38 78% 52% / 0.12) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20], y: [-10, 10, -10] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(234 60% 55% / 0.10) 0%, transparent 70%)",
            }}
            animate={{ scale: [1.1, 0.9, 1.1], x: [15, -15, 15], y: [10, -10, 10] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(280 60% 55% / 0.08) 0%, transparent 70%)",
            }}
            animate={{ scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/8 text-primary text-sm font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Your personal memory universe
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6"
          >
            Everything
            <br />
            <span className="text-gradient">you've lived</span>
            <br />
            in one place
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            Concerts. Restaurants. Sunrises. Milestones. The world you've explored, pinned on
            a living globe and preserved in a beautiful, cinematic scrapbook.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <SignedOut>
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth hover:shadow-depth-lg hover:-translate-y-0.5"
              >
                Start your Atlas
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-6 py-4 rounded-full border border-border hover:border-foreground/20"
              >
                <Play className="w-4 h-4" />
                Sign in to your atlas
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth hover:shadow-depth-lg hover:-translate-y-0.5"
              >
                Open your Atlas
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SignedIn>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent rounded-full"
          />
        </motion.div>
      </section>

      {/* Preview grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger.container}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {PREVIEW_IMAGES.map((src, i) => (
            <motion.div
              key={i}
              variants={stagger.item}
              className={`relative overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 md:col-span-1 row-span-2 aspect-[4/5]" :
                i === 3 ? "col-span-2 aspect-[2/1]" :
                "aspect-square"
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Decorative pin */}
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary shadow-glow-primary animate-ping-slow" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
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

      {/* Bottom CTA */}
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
          <SignedOut>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth"
            >
              Create your Atlas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-depth"
            >
              Back to my Atlas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SignedIn>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Globe2 className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold">Atlas of Me</span>
        </div>
        <p className="mt-2 text-xs">Your memories. Your world.</p>
      </footer>
    </div>
  );
}
