"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Globe2, Heart, MapPin, Layers } from "lucide-react";
import type { Memory } from "@/types";
import { GlobeComponent } from "./GlobeComponent";
import { MemoryPreviewCard } from "./MemoryPreviewCard";
import { CATEGORIES } from "@/lib/categories";

interface GlobeDashboardProps {
  memories: Memory[];
  stats: {
    totalMemories: number;
    countries: number;
    cities: number;
    favorites: number;
  };
}

const STAT_ITEMS = (stats: GlobeDashboardProps["stats"]) => [
  { label: "Memories", value: stats.totalMemories, icon: Layers },
  { label: "Countries", value: stats.countries, icon: Globe2 },
  { label: "Cities", value: stats.cities, icon: MapPin },
  { label: "Favorites", value: stats.favorites, icon: Heart },
];

export function GlobeDashboard({ memories, stats }: GlobeDashboardProps) {
  const [selectedMemories, setSelectedMemories] = useState<Memory[] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const filteredMemories = memories.filter((m) => {
    if (activeCategory && m.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.locationName.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q) ||
        m.country?.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const recentMemories = [...memories]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="relative h-[calc(100vh-0px)] md:h-screen overflow-hidden bg-background">
      {/* ── GLOBE (full bleed) ── */}
      <div className={`absolute inset-0 ${isDark ? "globe-bg-dark" : "globe-bg-light"}`}>
        <GlobeComponent
          memories={filteredMemories}
          onMarkerClick={(mems) => setSelectedMemories(mems)}
        />
      </div>

      {/* Overlay: dismiss card */}
      {selectedMemories && (
        <div
          className="absolute inset-0 z-20"
          onClick={() => setSelectedMemories(null)}
        />
      )}

      {/* ── TOP BAR ── */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-3">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden sm:flex items-center gap-2 glass rounded-2xl px-4 py-2.5 border-border/40"
        >
          {STAT_ITEMS(stats).map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-1.5 px-2">
              <Icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-lg font-bold font-display leading-none">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-xs"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border-border/40 pl-9 pr-4 py-2.5 rounded-xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </motion.div>

        {/* Add button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Link
            href="/dashboard/memories/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-depth whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Memory</span>
          </Link>
        </motion.div>
      </div>

      {/* ── CATEGORY FILTERS ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-48 md:bottom-56 left-4 right-4 z-30 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1"
      >
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            activeCategory === null
              ? "bg-primary text-primary-foreground shadow-depth"
              : "glass border-border/40 text-foreground/80 hover:text-foreground"
          }`}
        >
          All
        </button>
        {CATEGORIES.filter((c) => memories.some((m) => m.category === c.value)).map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? "shadow-depth"
                : "glass border-border/40 text-foreground/80 hover:text-foreground"
            }`}
            style={
              activeCategory === cat.value
                ? { background: cat.color, color: "white" }
                : {}
            }
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </motion.div>

      {/* ── RECENT MEMORIES STRIP ── */}
      {memories.length > 0 && !selectedMemories && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-4 left-4 right-4 z-30"
        >
          <div className="glass rounded-2xl border-border/40 p-3 md:p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent
              </span>
              <Link
                href="/dashboard/timeline"
                className="text-xs text-primary hover:underline font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-0.5">
              {recentMemories.map((memory, i) => (
                <RecentMemoryChip key={memory.id} memory={memory} index={i} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── EMPTY STATE ── */}
      {memories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <div className="glass rounded-3xl border-border/40 p-8 max-w-sm text-center pointer-events-auto mx-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Globe2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">Your atlas is empty</h2>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              Every journey begins somewhere. Add your first memory and watch your world come alive.
            </p>
            <Link
              href="/dashboard/memories/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add your first memory
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── MEMORY PREVIEW CARD ── */}
      <AnimatePresence>
        {selectedMemories && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto">
              <MemoryPreviewCard
                memories={selectedMemories}
                onClose={() => setSelectedMemories(null)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecentMemoryChip({ memory, index }: { memory: Memory; index: number }) {
  const coverMedia = memory.mediaItems.find((m) => m.id === memory.coverMediaId) || memory.mediaItems[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/dashboard/memories/${memory.id}`}
        className="group flex-shrink-0 flex items-center gap-2.5 bg-background/70 hover:bg-background border border-border/60 hover:border-border rounded-xl px-3 py-2 transition-all"
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {coverMedia ? (
            <img src={coverMedia.url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">
              {memory.category === "concert" ? "🎵" : "📍"}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate max-w-[120px] group-hover:text-primary transition-colors">
            {memory.title}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
            {memory.city || memory.locationName}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
