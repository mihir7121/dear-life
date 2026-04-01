"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { MediaItem } from "@/types";

interface MemoryLightboxProps {
  items: MediaItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function MemoryLightbox({ items, activeIndex, onClose, onNavigate }: MemoryLightboxProps) {
  const isOpen = activeIndex !== null;
  const item = activeIndex !== null ? items[activeIndex] : null;
  const canPrev = activeIndex !== null && activeIndex > 0;
  const canNext = activeIndex !== null && activeIndex < items.length - 1;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && canPrev) onNavigate(activeIndex! - 1);
    if (e.key === "ArrowRight" && canNext) onNavigate(activeIndex! + 1);
  }, [isOpen, canPrev, canNext, activeIndex, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/96 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
            {activeIndex! + 1} / {items.length}
          </div>

          {/* Prev */}
          <AnimatePresence>
            {canPrev && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex! - 1); }}
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Next */}
          <AnimatePresence>
            {canNext && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); onNavigate(activeIndex! + 1); }}
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Media */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.93, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-5xl max-h-[88vh] w-full flex flex-col items-center px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {item.type === "video" ? (
              <video
                key={item.url}
                src={item.url}
                controls
                autoPlay
                className="max-h-[78vh] w-full rounded-lg object-contain"
              />
            ) : (
              <img
                key={item.url}
                src={item.url}
                alt={item.caption ?? ""}
                className="max-h-[78vh] w-full object-contain rounded-lg"
              />
            )}

            {/* Caption + download row */}
            <div className="mt-4 flex items-center justify-between w-full px-1 gap-4">
              <p className="text-white/60 text-sm text-center flex-1">
                {item.caption ?? ""}
              </p>
              {item.type !== "video" && (
                <a
                  href={item.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-3.5 h-3.5" />
                  Save
                </a>
              )}
            </div>
          </motion.div>

          {/* Filmstrip thumbnails */}
          {items.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-full">
              {items.slice(0, 12).map((thumb, i) => (
                <button
                  key={thumb.id}
                  onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                  className="relative overflow-hidden rounded transition-all duration-200"
                  style={{
                    width: i === activeIndex ? 36 : 24,
                    height: 24,
                    opacity: i === activeIndex ? 1 : 0.45,
                    outline: i === activeIndex ? "2px solid hsl(38 78% 52%)" : "none",
                    outlineOffset: "1px",
                  }}
                >
                  <img
                    src={thumb.thumbnailUrl ?? thumb.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {items.length > 12 && (
                <span className="text-white/30 text-[10px] pl-1">+{items.length - 12}</span>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
