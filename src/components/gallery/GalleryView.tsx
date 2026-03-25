"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { Memory } from "@/types";
import { MemoryCard } from "@/components/memory/MemoryCard";
import { CATEGORIES } from "@/lib/categories";

interface GalleryViewProps {
  memories: Memory[];
}

export function GalleryView({ memories }: GalleryViewProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"masonry" | "grid">("masonry");

  const filtered = memories.filter((m) => {
    if (activeCategory && m.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q) ||
        m.country?.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const usedCategories = CATEGORIES.filter((c) =>
    memories.some((m) => m.category === c.value),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <h1 className="font-display font-bold text-2xl">Gallery</h1>
              <p className="text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "memory" : "memories"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setView("masonry")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    view === "masonry"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Masonry
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    view === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Grid
                </button>
              </div>
              <Link
                href="/dashboard/memories/new"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Memory</span>
              </Link>
            </div>
          </div>

          {/* Search + filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !activeCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {usedCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.value ? null : cat.value)
                  }
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat.value
                      ? "shadow-depth"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    activeCategory === cat.value
                      ? { background: cat.color, color: "white" }
                      : {}
                  }
                >
                  {cat.icon}
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center text-4xl mb-5">🖼️</div>
            <h2 className="font-display font-bold text-2xl mb-2">Your gallery is empty</h2>
            <p className="text-muted-foreground max-w-xs mb-6 text-sm">
              Add memories with photos to fill your gallery.
            </p>
            <Link
              href="/dashboard/memories/new"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Add first memory
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No memories match your filters
          </div>
        ) : view === "masonry" ? (
          <div className="masonry">
            {filtered.map((memory, i) => (
              <MemoryCard key={memory.id} memory={memory} index={i} variant="gallery" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((memory, i) => (
              <MemoryCard key={memory.id} memory={memory} index={i} variant="default" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
