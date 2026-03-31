"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import type { Memory, MediaItem } from "@/types";
import { getCategoryMeta } from "@/lib/categories";
import { formatDateRange } from "@/lib/utils";
import { MapPin, Calendar, Smile } from "lucide-react";
import { ScrapbookMediaTile } from "./ScrapbookMediaTile";
import { COLLAGE_LAYOUTS, COLLAGE_PADDING } from "./collageLayouts";

interface MemoryHeroScrapbookProps {
  memory: Memory;
  validMedia: MediaItem[];
  onMediaClick: (index: number) => void;
  /** Parent-owned Map so D3 overlay can read positions */
  tileRefsMap: React.MutableRefObject<Map<number, HTMLDivElement>>;
  onTileHover: (index: number) => void;
  onTileLeave: () => void;
}

export function MemoryHeroScrapbook({
  memory,
  validMedia,
  onMediaClick,
  tileRefsMap,
  onTileHover,
  onTileLeave,
}: MemoryHeroScrapbookProps) {
  const categoryMeta = getCategoryMeta(memory.category);
  const collageMedia = validMedia.slice(0, 10);
  const count = Math.max(1, Math.min(collageMedia.length, 10));
  const slots = COLLAGE_LAYOUTS[count] ?? COLLAGE_LAYOUTS[10];
  const paddingPct = COLLAGE_PADDING[count] ?? 110;

  // Stable ref-setter per tile index, only called for desktop layout
  const makeTileRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      if (el) tileRefsMap.current.set(i, el);
      else tileRefsMap.current.delete(i);
    },
    [tileRefsMap],
  );

  return (
    <section className="relative w-full overflow-x-clip">
      {/* ── Ambient blurred haze from hero photo ── */}
      {collageMedia[0]?.url && (
        <div
          className="absolute inset-0 -z-10 opacity-[0.13] dark:opacity-[0.08] blur-3xl scale-110 pointer-events-none"
          style={{
            backgroundImage: `url(${collageMedia[0].url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* ── Category badge + rating ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-2 px-6 sm:px-10 pt-6 pb-2"
      >
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: categoryMeta.bgColor,
            color: categoryMeta.color,
            border: `1px solid ${categoryMeta.color}50`,
          }}
        >
          {categoryMeta.icon} {categoryMeta.label}
        </span>
        {memory.rating && (
          <span className="text-yellow-400 text-sm">
            {"★".repeat(memory.rating)}
            <span className="text-muted-foreground/20">
              {"★".repeat(5 - memory.rating)}
            </span>
          </span>
        )}
      </motion.div>

      {/* ── Title + meta ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 sm:px-10 pb-7"
      >
        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight max-w-3xl">
          {memory.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {memory.city ? `${memory.city}, ${memory.country}` : memory.locationName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDateRange(memory.date, memory.endDate)}
          </span>
          {memory.mood && (
            <span className="flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5" />
              <span className="capitalize">{memory.mood}</span>
            </span>
          )}
        </div>
      </motion.div>

      {/* ── Collage ── */}
      {collageMedia.length > 0 && (
        <div className="px-4 sm:px-6 pb-12">

          {/*
           * DESKTOP: absolute-position editorial collage.
           * padding-bottom creates responsive height (% of container width).
           * Inner absolute div fills that space; tiles are positioned within it.
           */}
          <div className="hidden sm:block">
            <div
              className="relative w-full"
              style={{ paddingBottom: `${paddingPct}%` }}
            >
              <div className="absolute inset-0">
                {collageMedia.map((item, i) => (
                  <ScrapbookMediaTile
                    key={item.id}
                    item={item}
                    index={i}
                    mode="absolute"
                    slot={slots[i]}
                    onClick={onMediaClick}
                    tileRef={makeTileRef(i)}
                    onHover={onTileHover}
                    onLeave={onTileLeave}
                  />
                ))}
              </div>
            </div>
          </div>

          {/*
           * MOBILE: 2-column grid with subtle rotation per tile.
           * No tileRef needed here — D3 only runs on desktop.
           */}
          <div className="sm:hidden grid grid-cols-2 gap-2">
            {collageMedia.map((item, i) => (
              <ScrapbookMediaTile
                key={`m-${item.id}`}
                item={item}
                index={i}
                mode="grid"
                onClick={onMediaClick}
                onHover={onTileHover}
                onLeave={onTileLeave}
              />
            ))}
          </div>

          {/* Photo count badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-3 flex justify-end pr-1"
          >
            <span className="text-[11px] text-muted-foreground/60 font-mono">
              {collageMedia.length} {collageMedia.length === 1 ? "photo" : "photos"}
              {validMedia.length > 10 ? ` · +${validMedia.length - 10} more` : ""}
            </span>
          </motion.div>
        </div>
      )}

      {/* No-media fallback */}
      {collageMedia.length === 0 && (
        <div
          className="mx-6 sm:mx-10 h-56 rounded-2xl flex items-center justify-center mb-12"
          style={{
            background: `linear-gradient(135deg, ${categoryMeta.color}20, ${categoryMeta.color}06)`,
          }}
        >
          <span className="text-8xl opacity-20">{categoryMeta.icon}</span>
        </div>
      )}

      {/* Page-turn fade — dissolves collage into story */}
      <div className="h-20 bg-gradient-to-b from-transparent to-background pointer-events-none -mt-12" />
    </section>
  );
}
