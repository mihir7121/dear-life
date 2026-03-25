"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Memory } from "@/types";
import { formatDate } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categories";

interface MemoryPreviewCardProps {
  memories: Memory[];
  onClose: () => void;
}

export function MemoryPreviewCard({ memories, onClose }: MemoryPreviewCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const memory = memories[activeIndex];
  const categoryMeta = getCategoryMeta(memory.category);
  const coverMedia = memory.mediaItems.find((m) => m.id === memory.coverMediaId) || memory.mediaItems[0];

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < memories.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
      className="relative w-80 sm:w-96 rounded-2xl overflow-hidden shadow-depth-lg border border-border/50 bg-card"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Multiple memories nav */}
      {memories.length > 1 && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={!hasPrev}
            className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-white text-xs font-medium bg-black/50 backdrop-blur px-2 py-0.5 rounded-full">
            {activeIndex + 1} / {memories.length}
          </span>
          <button
            onClick={() => setActiveIndex((i) => Math.min(memories.length - 1, i + 1))}
            disabled={!hasNext}
            className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cover image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={memory.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative h-48 bg-muted"
        >
          {coverMedia ? (
            <img
              src={coverMedia.url}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(135deg, ${categoryMeta.color}40, ${categoryMeta.color}20)` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: categoryMeta.bgColor,
                color: categoryMeta.color,
                border: `1px solid ${categoryMeta.color}40`,
              }}
            >
              {categoryMeta.icon} {categoryMeta.label}
            </span>
            {memory.favorite && (
              <span className="flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Heart className="w-2.5 h-2.5 fill-current" />
              </span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={memory.id + "-content"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="font-display font-bold text-base leading-tight mb-2 line-clamp-2">
              {memory.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {memory.city ? `${memory.city}, ${memory.country}` : memory.locationName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(memory.date)}
              </span>
            </div>

            {memory.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {memory.description}
              </p>
            )}

            {/* Media count */}
            {memory.mediaItems.length > 1 && (
              <div className="flex gap-1 mb-4">
                {memory.mediaItems.slice(0, 4).map((item, i) => (
                  <div key={item.id} className="relative flex-1 h-10 rounded-md overflow-hidden bg-muted">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                    {i === 3 && memory.mediaItems.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                        +{memory.mediaItems.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Link
              href={`/dashboard/memories/${memory.id}`}
              className="flex items-center justify-center gap-2 w-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold py-2.5 rounded-xl transition-colors group"
            >
              Open memory
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
