"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { MediaItem } from "@/types";
import type { CollageSlot } from "./collageLayouts";

interface ScrapbookMediaTileProps {
  item: MediaItem;
  index: number;
  /** "absolute" → editorial collage (desktop). "grid" → 2-col mobile grid. */
  mode: "absolute" | "grid";
  /** Required when mode="absolute" */
  slot?: CollageSlot;
  onClick: (index: number) => void;
  /** Ref callback so the D3 overlay can measure tile positions */
  tileRef?: (el: HTMLDivElement | null) => void;
  onHover?: (index: number) => void;
  onLeave?: () => void;
}

const PIN_COLORS = ["#d4a853", "#c0392b", "#2c7be5", "#27ae60", "#8e44ad"];

export function ScrapbookMediaTile({
  item,
  index,
  mode,
  slot,
  onClick,
  tileRef,
  onHover,
  onLeave,
}: ScrapbookMediaTileProps) {
  const isVideo = item.type === "video";
  const src = isVideo ? (item.thumbnailUrl ?? item.url) : item.url;
  const pinColor = PIN_COLORS[index % PIN_COLORS.length];

  // Absolute-mode positioning styles
  const absoluteStyle: React.CSSProperties =
    mode === "absolute" && slot
      ? {
          position: "absolute",
          top: slot.top,
          left: slot.left,
          width: slot.width,
          zIndex: slot.zIndex,
          aspectRatio: slot.aspectRatio,
        }
      : {};

  return (
    <motion.div
      ref={tileRef}
      data-tile-index={index}
      className="relative cursor-pointer group overflow-hidden rounded-xl bg-muted select-none"
      style={{
        ...absoluteStyle,
        boxShadow:
          "0 6px 32px -6px rgba(0,0,0,0.42), 0 2px 8px rgba(0,0,0,0.18), 0 0 0 3px rgba(255,255,255,0.12)",
      }}
      initial={{ opacity: 0, scale: 0.82, rotate: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: slot?.rotate ?? 0,
      }}
      transition={{
        delay: 0.07 * index,
        duration: 0.72,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.055,
        rotate: 0,
        zIndex: 50,
        boxShadow:
          "0 22px 64px -10px rgba(0,0,0,0.58), 0 8px 20px rgba(0,0,0,0.28), 0 0 0 3px rgba(255,255,255,0.25)",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      onClick={() => onClick(index)}
      onMouseEnter={() => onHover?.(index)}
      onMouseLeave={() => onLeave?.()}
      onFocus={() => onHover?.(index)}
      onBlur={() => onLeave?.()}
      tabIndex={0}
    >
      {/* ── Pushpin ── */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full z-20 pointer-events-none"
        style={{
          background: pinColor,
          opacity: 0.8,
          boxShadow: `0 1px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)`,
        }}
      />

      {/* ── Media ── */}
      <div className="w-full h-full">
        {isVideo ? (
          <>
            <img
              src={src}
              alt={item.caption ?? `Video ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/22">
              <div className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
            </div>
          </>
        ) : (
          <img
            src={item.url}
            alt={item.caption ?? `Photo ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      {/* ── Hover vignette ── */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/18 transition-colors duration-300 pointer-events-none rounded-xl" />

      {/* ── Caption on hover ── */}
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl pointer-events-none">
          <p className="text-white text-[11px] leading-snug line-clamp-2">
            {item.caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}
