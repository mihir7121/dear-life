"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Memory } from "@/types";

import { MemoryHeroScrapbook } from "./MemoryHeroScrapbook";
import { MemoryConnectorOverlay } from "./MemoryConnectorOverlay";
import { MemoryLightbox } from "./MemoryLightbox";
import { MemoryStorySection } from "./MemoryStorySection";
import { MemoryMetadataRail } from "./MemoryMetadataRail";

interface MemoryDetailViewProps {
  memory: Memory;
}

export function MemoryDetailView({ memory }: MemoryDetailViewProps) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [favorited, setFavorited] = useState(memory.favorite);
  // Index of the tile currently being hovered — drives D3 highlight
  const [activeConnectorTile, setActiveConnectorTile] = useState<number | null>(null);

  // ── D3 connector ref system ──────────────────────────────────────────────
  // connectorWrapperRef  → outer div that the SVG overlay is absolutely positioned over
  // tileRefsMap          → populated by MemoryHeroScrapbook (desktop tiles only)
  // storyAnchorRef       → the "The Story" header in MemoryStorySection
  // captionNodeRefs      → per-tile caption annotation cards in MemoryStorySection
  const connectorWrapperRef = useRef<HTMLDivElement>(null);
  const tileRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
  const storyAnchorRef = useRef<HTMLDivElement>(null);
  const captionNodeRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const validMedia = memory.mediaItems.filter((m) => m.url?.startsWith("http"));

  const handleDelete = async () => {
    if (!confirm("Delete this memory? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/memories/${memory.id}`, { method: "DELETE" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setDeleting(false);
    }
  };

  const handleFavorite = async () => {
    const newVal = !favorited;
    setFavorited(newVal);
    await fetch(`/api/memories/${memory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...memory, favorite: newVal }),
    });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Sticky nav ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 bg-background/85 backdrop-blur-md border-b border-border/40"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFavorite}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-secondary",
              favorited ? "text-rose-400" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-4 h-4", favorited && "fill-rose-400")} />
          </button>
          <Link
            href={`/dashboard/memories/${memory.id}/edit`}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
            aria-label="Delete memory"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/*
       * ── Connector canvas ──────────────────────────────────────────────
       * This wrapper is `position: relative` so the D3 SVG overlay
       * (absolutely positioned inside it) spans the full area from the
       * scrapbook collage top all the way down through the story section.
       *
       * The SVG sits at z-index:1 — above the background but below the
       * photo tiles (z-index 2-11), so connector threads appear to
       * emerge from behind photos and travel down to story nodes.
       */}
      <div ref={connectorWrapperRef} className="relative">

        {/* D3 SVG overlay — covers the full canvas */}
        {validMedia.length > 0 && (
          <MemoryConnectorOverlay
            wrapperRef={connectorWrapperRef}
            tileRefs={tileRefsMap}
            storyAnchorRef={storyAnchorRef}
            captionNodeRefs={captionNodeRefs}
            mediaItems={validMedia}
            activeIndex={activeConnectorTile}
          />
        )}

        {/* ── Scrapbook collage ── */}
        <MemoryHeroScrapbook
          memory={memory}
          validMedia={validMedia}
          onMediaClick={setLightboxIndex}
          tileRefsMap={tileRefsMap}
          onTileHover={setActiveConnectorTile}
          onTileLeave={() => setActiveConnectorTile(null)}
        />

        {/* ── Story + metadata ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-14">

            {/* Story column */}
            <div className="min-w-0">
              <MemoryStorySection
                memory={memory}
                mediaItems={validMedia}
                storyAnchorRef={storyAnchorRef}
                captionNodeRefs={captionNodeRefs}
              />

              {/* Tags — mobile only */}
              {memory.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mt-10 flex flex-wrap gap-1.5 lg:hidden"
                >
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Actions — mobile only */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-12 flex flex-col sm:flex-row gap-2 lg:hidden"
              >
                <Link
                  href={`/dashboard/memories/${memory.id}/edit`}
                  className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit memory
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            </div>

            {/* Metadata rail + actions — desktop only */}
            <div className="hidden lg:block">
              <MemoryMetadataRail memory={memory} />

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col gap-2 mt-5"
              >
                <Link
                  href={`/dashboard/memories/${memory.id}/edit`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit memory
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            </div>
          </div>
        </div>

      </div>{/* end connectorWrapper */}

      {/* ── Lightbox ── */}
      <MemoryLightbox
        items={validMedia}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
