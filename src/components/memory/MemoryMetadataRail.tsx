"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar, Smile, Star, Tag, ExternalLink } from "lucide-react";
import type { Memory } from "@/types";
import { getCategoryMeta } from "@/lib/categories";
import { formatDateRange } from "@/lib/utils";

interface MemoryMetadataRailProps {
  memory: Memory;
}

export function MemoryMetadataRail({ memory }: MemoryMetadataRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const categoryMeta = getCategoryMeta(memory.category);

  const stagger = (i: number) => ({
    initial: { opacity: 0, x: 16 },
    animate: isInView ? { opacity: 1, x: 0 } : {},
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <div ref={ref} className="space-y-5">
      {/* Details card */}
      <motion.div
        {...stagger(0)}
        className="bg-card border border-border rounded-2xl p-5 space-y-4 scrapbook-layer"
      >
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.16em]">
          Details
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium leading-snug">{memory.locationName}</p>
              {memory.city && (
                <p className="text-muted-foreground text-xs mt-0.5">{memory.city}, {memory.country}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>{formatDateRange(memory.date, memory.endDate)}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 flex items-center justify-center text-sm flex-shrink-0">
              {categoryMeta.icon}
            </span>
            <span>{categoryMeta.label}</span>
          </div>

          {memory.mood && (
            <div className="flex items-center gap-2.5">
              <Smile className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="capitalize">{memory.mood}</span>
            </div>
          )}

          {memory.rating && (
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span>
                <span className="text-yellow-400">{"★".repeat(memory.rating)}</span>
                <span className="text-muted-foreground/25">{"★".repeat(5 - memory.rating)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Color accent bar */}
        {memory.colorTheme && (
          <div
            className="h-0.5 rounded-full"
            style={{ background: `linear-gradient(90deg, ${memory.colorTheme}90, ${memory.colorTheme}20)` }}
          />
        )}
      </motion.div>

      {/* Tags */}
      {memory.tags.length > 0 && (
        <motion.div {...stagger(1)} className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
            <Tag className="w-3 h-3" /> Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mini map */}
      <motion.div
        {...stagger(2)}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="relative h-32 bg-muted">
          {/* Coordinate display fallback */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <MapPin className="w-7 h-7 text-primary opacity-70" />
            <span className="text-xs text-muted-foreground font-mono">
              {memory.latitude.toFixed(4)}, {memory.longitude.toFixed(4)}
            </span>
          </div>
          <a
            href={`https://www.google.com/maps?q=${memory.latitude},${memory.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] bg-black/60 text-white px-2 py-1 rounded-lg hover:bg-black/80 transition-colors"
          >
            Open in Maps <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
