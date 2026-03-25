"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Filter, Plus, MapPin, Heart } from "lucide-react";
import type { Memory } from "@/types";
import { formatDate, formatYear, formatMonth, groupBy } from "@/lib/utils";
import { getCategoryMeta, CATEGORIES } from "@/lib/categories";

interface TimelineViewProps {
  memories: Memory[];
}

export function TimelineView({ memories }: TimelineViewProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Group by year then month
  const byYear = groupBy(filtered, (m) => formatYear(m.date));
  const years = Object.keys(byYear).sort((a, b) => +b - +a);

  const usedCategories = CATEGORIES.filter((c) =>
    memories.some((m) => m.category === c.value),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl">Timeline</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "memory" : "memories"}
            </p>
          </div>
          <Link
            href="/dashboard/memories/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Memory</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto px-4 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
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
              onClick={() => setActiveCategory(activeCategory === cat.value ? null : cat.value)}
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
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {memories.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No memories match your filters
          </div>
        ) : (
          <div className="space-y-12">
            {years.map((year) => {
              const byMonth = groupBy(byYear[year], (m) => formatMonth(m.date));
              const months = Object.keys(byMonth).sort(
                (a, b) => new Date(b).getTime() - new Date(a).getTime(),
              );

              return (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Year header */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-display font-bold text-4xl text-primary/20 select-none">
                      {year}
                    </h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {byYear[year].length} {byYear[year].length === 1 ? "memory" : "memories"}
                    </span>
                  </div>

                  {months.map((month) => (
                    <div key={month} className="mb-8">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 ml-8">
                        {month}
                      </h3>
                      <div className="space-y-4">
                        {byMonth[month].map((memory, i) => (
                          <TimelineEntry key={memory.id} memory={memory} index={i} />
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineEntry({ memory, index }: { memory: Memory; index: number }) {
  const categoryMeta = getCategoryMeta(memory.category);
  const coverMedia =
    memory.mediaItems.find((m) => m.id === memory.coverMediaId) || memory.mediaItems[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4"
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div
          className="w-3 h-3 rounded-full border-2 flex-shrink-0 mt-4"
          style={{
            background: categoryMeta.color,
            borderColor: categoryMeta.color,
            boxShadow: `0 0 8px ${categoryMeta.color}60`,
          }}
        />
        <div className="flex-1 w-px bg-border mt-1" />
      </div>

      {/* Card */}
      <Link
        href={`/dashboard/memories/${memory.id}`}
        className="flex-1 group flex gap-4 bg-card border border-border rounded-2xl p-4 mb-2 hover:border-primary/30 hover:shadow-depth transition-all duration-300 hover:-translate-y-0.5"
      >
        {/* Cover */}
        {coverMedia && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            <img
              src={coverMedia.url}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: categoryMeta.bgColor, color: categoryMeta.color }}
            >
              {categoryMeta.icon} {categoryMeta.label}
            </span>
            {memory.favorite && <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />}
          </div>
          <h3 className="font-display font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {memory.title}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {memory.city || memory.locationName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(memory.date)}
            </span>
          </div>
          {memory.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
              {memory.description}
            </p>
          )}
          {memory.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {memory.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[10px] text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center text-4xl mb-5">
        📅
      </div>
      <h2 className="font-display font-bold text-2xl mb-2">No memories yet</h2>
      <p className="text-muted-foreground max-w-xs mb-6 text-sm leading-relaxed">
        Your timeline is empty. Add your first memory and it'll appear here, organized by date.
      </p>
      <Link
        href="/dashboard/memories/new"
        className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add your first memory
      </Link>
    </div>
  );
}
