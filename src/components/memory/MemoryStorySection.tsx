"use client";

import { useRef, RefObject } from "react";
import { motion, useInView } from "framer-motion";
import type { Memory, MediaItem } from "@/types";

interface MemoryStorySectionProps {
  memory: Memory;
  mediaItems: MediaItem[];
  /** D3 connector threads from tiles converge on this element */
  storyAnchorRef: RefObject<HTMLDivElement>;
  /** Per-tile caption annotation cards that D3 can connect to */
  captionNodeRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
}

export function MemoryStorySection({
  memory,
  mediaItems,
  storyAnchorRef,
  captionNodeRefs,
}: MemoryStorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const paragraphs = (memory.description ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Media items that carry captions — these become story nodes for D3
  const captionedItems = mediaItems
    .map((item, i) => ({ item, mediaIndex: i }))
    .filter(({ item }) => !!item.caption);

  const hasContent = paragraphs.length > 0 || captionedItems.length > 0;
  if (!hasContent) return null;

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/*
       * ── Story anchor ──────────────────────────────────────────────────
       * This div is the D3 target for tiles without their own caption card.
       * All "uncaptioned" threads converge here.
       */}
      <div ref={storyAnchorRef} className="flex items-center gap-3 mb-7">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          The Story
        </span>
        <div className="flex-1 h-px bg-border" />
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "hsl(38 78% 52%)" }}
        />
      </div>

      {/* ── Prose ────────────────────────────────────────────────────────── */}
      {paragraphs.length > 0 && (
        <div className="space-y-5">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.07 * i,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-serif text-lg leading-[1.85] text-foreground/85 whitespace-pre-wrap"
            >
              {i === 0 && para.length > 0 ? (
                <>
                  {/* Gold drop-cap pulls eye from collage → story */}
                  <span
                    className="float-left font-display font-bold text-5xl leading-[0.85] mr-2 mt-1"
                    style={{ color: "hsl(38 78% 52%)" }}
                  >
                    {para[0]}
                  </span>
                  {para.slice(1)}
                </>
              ) : (
                para
              )}
            </motion.p>
          ))}
        </div>
      )}

      {/*
       * ── Caption annotation cards ──────────────────────────────────────
       * These are the story nodes for D3 — each card is a ref target.
       * D3 draws a path from the corresponding photo tile to this card.
       * Only rendered when at least one media item has a caption.
       */}
      {captionedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-10 space-y-2.5"
        >
          {/* Section divider */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Captured Moments
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {captionedItems.map(({ item, mediaIndex }) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) captionNodeRefs.current.set(mediaIndex, el);
                else captionNodeRefs.current.delete(mediaIndex);
              }}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/35 border border-border/40 text-sm group hover:bg-muted/60 transition-colors duration-200"
            >
              {/* Thumbnail */}
              <div className="w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-muted ring-1 ring-border/60">
                <img
                  src={item.thumbnailUrl ?? item.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground font-mono mb-0.5 block">
                  photo {mediaIndex + 1}
                </span>
                <p className="text-foreground/80 leading-snug">{item.caption}</p>
              </div>
              {/* Gold accent thread-end indicator */}
              <div
                className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5 opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ background: "hsl(38 78% 52%)" }}
              />
            </div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
