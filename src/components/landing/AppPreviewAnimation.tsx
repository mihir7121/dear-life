"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Tag, Globe2, Heart, Clock, ChevronRight, Plus } from "lucide-react";

// ── Step definitions ───────────────────────────────────────────────────────
const STEPS = ["globe", "add", "timeline"] as const;
type Step = typeof STEPS[number];
const STEP_DURATION = 4000;

// ── Shared animation variants ──────────────────────────────────────────────
const screenIn = {
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
};

// ── Photos ─────────────────────────────────────────────────────────────────
const PHOTOS = {
  tokyo:    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=70",
  rome:     "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&q=70",
  nyc:      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&q=70",
  concert:  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=70",
  nature:   "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&q=70",
  africa:   "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&q=70",
};

// ── Pin positions for the globe screen ────────────────────────────────────
const PINS = [
  { x: 38, y: 42, color: "#f97316", delay: 0.1, label: "Rome",    photo: PHOTOS.rome    },
  { x: 62, y: 38, color: "#8b5cf6", delay: 0.4, label: "Tokyo",   photo: PHOTOS.tokyo   },
  { x: 24, y: 55, color: "#3b82f6", delay: 0.7, label: "NYC",     photo: PHOTOS.nyc     },
  { x: 52, y: 62, color: "#10b981", delay: 1.0, label: "Nairobi", photo: PHOTOS.africa  },
  { x: 75, y: 50, color: "#f43f5e", delay: 1.3, label: "Sydney",  photo: PHOTOS.nature  },
];

const RECENT = [
  { label: "Shibuya",   color: "#8b5cf6", img: PHOTOS.tokyo  },
  { label: "Colosseum", color: "#f97316", img: PHOTOS.rome   },
  { label: "NYC Walk",  color: "#3b82f6", img: PHOTOS.nyc    },
];

function GlobeScreen() {
  return (
    <motion.div {...screenIn} className="absolute inset-0 flex flex-col p-4 gap-2.5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Globe2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold">Atlas</span>
        </div>
        <div className="flex gap-1.5">
          {["28 memories", "12 countries"].map((s) => (
            <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
          ))}
        </div>
      </div>

      {/* Globe + floating card */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Globe circle */}
        <div className="w-44 h-44 rounded-full bg-gradient-to-br from-[#0d1a3a] to-[#0a1428] relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.18)]">
          <div className="absolute inset-0">
            <div className="absolute top-[30%] left-[15%] w-16 h-10 rounded-[40%] bg-[#1a2e5a] opacity-90" />
            <div className="absolute top-[40%] left-[45%] w-20 h-12 rounded-[35%] bg-[#1a2e5a] opacity-90" />
            <div className="absolute top-[55%] left-[30%] w-12 h-8 rounded-[45%] bg-[#1a2e5a] opacity-90" />
            <div className="absolute top-[25%] right-[15%] w-10 h-7 rounded-[40%] bg-[#1a2e5a] opacity-90" />
          </div>
          {PINS.map((pin) => (
            <motion.div
              key={pin.label}
              className="absolute"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: pin.delay, type: "spring", bounce: 0.5 }}
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full border border-white/40"
                style={{ background: pin.color, boxShadow: `0 0 8px ${pin.color}` }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: pin.delay }}
              />
            </motion.div>
          ))}
        </div>

        {/* Floating memory card with photo */}
        <motion.div
          className="absolute bottom-2 right-2 bg-card border border-border rounded-xl overflow-hidden shadow-depth w-32"
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-16 overflow-hidden">
            <img src={PHOTOS.tokyo} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="px-2 py-1.5">
            <p className="text-[10px] font-semibold leading-tight">Night in Shibuya</p>
            <p className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-2 h-2" /> Tokyo 🎵
            </p>
          </div>
        </motion.div>

        {/* Second floating pin label */}
        <motion.div
          className="absolute top-3 left-3 bg-card/90 backdrop-blur border border-border rounded-lg px-2 py-1"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.0, duration: 0.4 }}
        >
          <p className="text-[9px] text-muted-foreground">Pinned</p>
          <p className="text-[10px] font-semibold">Rome 🏛️</p>
        </motion.div>
      </div>

      {/* Recent photo strip */}
      <motion.div
        className="glass rounded-xl p-2 flex gap-2 items-center overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.4 }}
      >
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold flex-shrink-0">Recent</p>
        {RECENT.map((m) => (
          <div key={m.label} className="flex items-center gap-1.5 bg-background/70 rounded-lg pl-1 pr-2 py-1 flex-shrink-0">
            <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
              <img src={m.img} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-medium whitespace-nowrap">{m.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── Add Memory screen ──────────────────────────────────────────────────────
const FORM_FIELDS = [
  { icon: MapPin,    label: "Location", value: "Shibuya, Tokyo",  color: "text-blue-400",   delay: 0.55 },
  { icon: Calendar,  label: "Date",     value: "March 22, 2025",  color: "text-emerald-400", delay: 0.75 },
  { icon: Tag,       label: "Category", value: "🎵 Concert",      color: "text-purple-400",  delay: 0.95 },
];

const UPLOAD_PHOTOS = [PHOTOS.tokyo, PHOTOS.concert, PHOTOS.nature];

function AddScreen() {
  return (
    <motion.div {...screenIn} className="absolute inset-0 flex flex-col p-4 gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">New Memory</span>
        <motion.div
          className="flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-[10px] font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Plus className="w-3 h-3" /> Save
        </motion.div>
      </div>

      {/* Photo strip — three uploaded images */}
      <motion.div
        className="flex gap-1.5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {UPLOAD_PHOTOS.map((src, i) => (
          <motion.div
            key={src}
            className="flex-1 rounded-xl overflow-hidden relative"
            style={{ height: i === 0 ? 88 : 88 }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-1.5">
                <span className="text-[9px] text-white font-medium">Cover</span>
              </div>
            )}
            {i === 2 && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">+2</span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Title field */}
      <motion.div
        className="bg-muted/50 rounded-lg px-3 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-[9px] text-muted-foreground mb-0.5">Title</p>
        <TypewriterText text="Night in Shibuya" delay={0.35} />
      </motion.div>

      {/* Form fields */}
      <div className="flex flex-col gap-1.5">
        {FORM_FIELDS.map((f) => (
          <motion.div
            key={f.label}
            className="flex items-center gap-2.5 bg-muted/40 rounded-lg px-3 py-1.5"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: f.delay, duration: 0.35 }}
          >
            <f.icon className={`w-3 h-3 flex-shrink-0 ${f.color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-muted-foreground">{f.label}</p>
              <p className="text-[11px] font-medium truncate">{f.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pinned confirmation */}
      <motion.div
        className="mt-auto flex items-center justify-center gap-2 text-[10px] text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
        Memory pinned to your atlas
      </motion.div>
    </motion.div>
  );
}

// ── Timeline screen ────────────────────────────────────────────────────────
const TIMELINE_ITEMS = [
  { title: "Night in Shibuya",    location: "Tokyo, Japan",    date: "Mar 22", color: "#8b5cf6", emoji: "🎵", img: PHOTOS.tokyo,   favorite: true,  delay: 0.5  },
  { title: "Sunset at Colosseum", location: "Rome, Italy",     date: "Feb 14", color: "#f97316", emoji: "🏛️", img: PHOTOS.rome,    favorite: false, delay: 0.7  },
  { title: "Brooklyn Bridge",     location: "New York, USA",   date: "Jan 5",  color: "#3b82f6", emoji: "🌉", img: PHOTOS.nyc,     favorite: false, delay: 0.9  },
];

function TimelineScreen() {
  return (
    <motion.div {...screenIn} className="absolute inset-0 flex flex-col p-4 gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">Timeline</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" /> 28 memories
        </div>
      </div>

      {/* Hero featured card */}
      <motion.div
        className="relative rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
        style={{ height: 110 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={PHOTOS.concert} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-3 flex items-end justify-between">
          <div>
            <p className="text-white text-xs font-semibold leading-tight">Primavera Sound</p>
            <p className="text-white/70 text-[10px] flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5" /> Barcelona, Spain
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="text-[9px] text-white/60">Jun 2</span>
          </div>
        </div>
        <div className="absolute top-2.5 left-2.5 bg-purple-500/80 backdrop-blur text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
          🎵 Concert
        </div>
      </motion.div>

      {/* List items */}
      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        {TIMELINE_ITEMS.map((item) => (
          <motion.div
            key={item.title}
            className="flex gap-2.5 items-center bg-card border border-border/60 rounded-xl p-2 group cursor-pointer"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img src={item.img} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <p className="text-[11px] font-semibold truncate">{item.title}</p>
                {item.favorite && <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 flex-shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground truncate flex items-center gap-0.5">
                <MapPin className="w-2 h-2 flex-shrink-0" />{item.location}
              </p>
            </div>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <span className="text-[9px] text-muted-foreground">{item.date}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Typewriter helper ──────────────────────────────────────────────────────
function TypewriterText({ text, delay }: { text: string; delay: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setShown((n) => {
          if (n >= text.length) { clearInterval(interval); return n; }
          return n + 1;
        });
      }, 42);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(start);
  }, [text, delay]);
  return (
    <p className="text-xs font-semibold">
      {text.slice(0, shown)}
      {shown < text.length && <span className="inline-block w-0.5 h-3 bg-primary animate-pulse ml-px" />}
    </p>
  );
}

// ── Step label map ─────────────────────────────────────────────────────────
const STEP_META: Record<Step, { label: string; icon: React.ReactNode }> = {
  globe:    { label: "Explore",  icon: <Globe2 className="w-3 h-3" /> },
  add:      { label: "Add",      icon: <Plus className="w-3 h-3" />   },
  timeline: { label: "Timeline", icon: <Clock className="w-3 h-3" />  },
};

// ── Main export ────────────────────────────────────────────────────────────
export function AppPreviewAnimation() {
  const [step, setStep] = useState<Step>("globe");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / STEP_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        setStep((s) => {
          const idx = STEPS.indexOf(s);
          return STEPS[(idx + 1) % STEPS.length];
        });
      }
    }, 30);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="relative w-full max-w-[300px] mx-auto select-none">
      {/* Device chrome */}
      <div className="relative rounded-[2rem] border border-border/60 bg-card shadow-[0_32px_80px_rgba(0,0,0,0.2)] overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 bg-card">
          <span className="text-[10px] text-muted-foreground font-medium">9:41</span>
          <div className="w-16 h-4 bg-foreground/10 rounded-full" />
          <div className="flex gap-1 items-center">
            <div className="w-3 h-2 bg-foreground/20 rounded-sm" />
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
          </div>
        </div>

        {/* Screen */}
        <div className="relative h-[380px] bg-background overflow-hidden">
          <AnimatePresence mode="wait">
            {step === "globe"    && <GlobeScreen    key="globe" />}
            {step === "add"      && <AddScreen      key="add" />}
            {step === "timeline" && <TimelineScreen key="timeline" />}
          </AnimatePresence>
        </div>

        {/* Nav bar */}
        <div className="flex items-center justify-around px-6 py-3 bg-card border-t border-border/50">
          {(["globe", "add", "timeline"] as Step[]).map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                step === s ? "text-primary" : "text-muted-foreground/40"
              }`}
            >
              {STEP_META[s].icon}
              <span className="text-[9px] font-medium">{STEP_META[s].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-4 flex gap-2 justify-center">
        {STEPS.map((s) => (
          <div key={s} className="relative h-0.5 rounded-full overflow-hidden bg-border flex-1 max-w-16">
            {step === s && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            )}
            {STEPS.indexOf(s) < STEPS.indexOf(step) && (
              <div className="absolute inset-0 bg-primary/40 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
