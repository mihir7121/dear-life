"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Heart,
  Edit,
  Trash2,
  Tag,
  Smile,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
} from "lucide-react";
import type { Memory } from "@/types";
import { formatDateRange, formatDate, cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categories";

interface MemoryDetailViewProps {
  memory: Memory;
}

export function MemoryDetailView({ memory }: MemoryDetailViewProps) {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [favorited, setFavorited] = useState(memory.favorite);

  const coverMedia = memory.mediaItems.find((m) => m.id === memory.coverMediaId) || memory.mediaItems[0];
  const categoryMeta = getCategoryMeta(memory.category);

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

  const navigateLightbox = (dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    const next = lightboxIndex + dir;
    if (next >= 0 && next < memory.mediaItems.length) setLightboxIndex(next);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── CINEMATIC HERO ── */}
      <div ref={heroRef} className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {/* Parallax image */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 origin-top"
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
              style={{
                background: `linear-gradient(135deg, ${categoryMeta.color}40, ${categoryMeta.color}15)`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-9xl opacity-20">
                {categoryMeta.icon}
              </div>
            </div>
          )}
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />

        {/* Controls */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 glass px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/20 dark:hover:bg-black/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-xl glass transition-colors",
                favorited ? "text-rose-400" : "text-white/80 hover:text-white",
              )}
            >
              <Heart className={cn("w-4.5 h-4.5", favorited && "fill-rose-400")} />
            </button>
            <Link
              href={`/dashboard/memories/${memory.id}/edit`}
              className="flex items-center gap-2 glass px-3 py-2 rounded-xl text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-9 h-9 flex items-center justify-center rounded-xl glass text-white/70 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Hero content (bottom overlay) */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full backdrop-blur"
                style={{
                  background: categoryMeta.bgColor,
                  color: categoryMeta.color,
                  border: `1px solid ${categoryMeta.color}50`,
                }}
              >
                {categoryMeta.icon} {categoryMeta.label}
              </span>
              {memory.rating && (
                <span className="flex items-center gap-0.5 text-sm text-yellow-400">
                  {Array.from({ length: memory.rating }, (_, i) => (
                    <span key={i}>★</span>
                  ))}
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-3 max-w-3xl drop-shadow-lg">
              {memory.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
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
                  {memory.mood}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Story */}
            {memory.description && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h2 className="font-display font-bold text-lg mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  The Story
                </h2>
                <p className="prose-memory whitespace-pre-wrap font-serif text-lg leading-[1.8]">
                  {memory.description}
                </p>
              </motion.section>
            )}

            {/* Media gallery */}
            {memory.mediaItems.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  {memory.mediaItems.length} {memory.mediaItems.length === 1 ? "photo" : "photos & videos"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {memory.mediaItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index, duration: 0.4 }}
                      className={cn(
                        "relative cursor-pointer group overflow-hidden rounded-xl",
                        index === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square",
                      )}
                      onClick={() => setLightboxIndex(index)}
                    >
                      {item.type === "video" ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            src={item.url}
                            className="w-full h-full object-cover opacity-80"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                              <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.caption || `Photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-white text-xs">{item.caption}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-5 space-y-4 scrapbook-layer"
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{memory.locationName}</p>
                    {memory.city && (
                      <p className="text-muted-foreground text-xs">
                        {memory.city}, {memory.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{formatDateRange(memory.date, memory.endDate)}</span>
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
                    <span className="text-yellow-400">
                      {"★".repeat(memory.rating)}
                      <span className="text-muted-foreground/30">
                        {"★".repeat(5 - memory.rating)}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Color theme indicator */}
              {memory.colorTheme && (
                <div
                  className="h-1 rounded-full mt-2"
                  style={{ background: `linear-gradient(90deg, ${memory.colorTheme}80, ${memory.colorTheme}30)` }}
                />
              )}
            </motion.div>

            {/* Tags */}
            {memory.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mini map link */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <div className="relative h-36 bg-muted">
                <img
                  src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${memory.longitude},${memory.latitude},10,0/600x300@2x?access_token=pk.placeholder`}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => {
                    // Fallback if Mapbox token not set
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Fallback map placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <MapPin className="w-8 h-8 text-primary" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    {memory.latitude.toFixed(4)}, {memory.longitude.toFixed(4)}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${memory.latitude},${memory.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 flex items-center gap-1 text-xs bg-black/60 text-white px-2 py-1 rounded-lg hover:bg-black/80 transition-colors"
                >
                  Open in Maps <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col gap-2"
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

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="w-5 h-5" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(-1);
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {lightboxIndex < memory.mediaItems.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(1);
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <motion.div
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-5xl max-h-[90vh] w-full px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {memory.mediaItems[lightboxIndex].type === "video" ? (
              <video
                src={memory.mediaItems[lightboxIndex].url}
                controls
                autoPlay
                className="max-h-[85vh] w-full object-contain"
              />
            ) : (
              <img
                src={memory.mediaItems[lightboxIndex].url}
                alt={memory.mediaItems[lightboxIndex].caption || ""}
                className="max-h-[85vh] w-full object-contain"
              />
            )}
            {memory.mediaItems[lightboxIndex].caption && (
              <p className="text-white/70 text-center text-sm mt-3">
                {memory.mediaItems[lightboxIndex].caption}
              </p>
            )}
            <p className="text-white/40 text-center text-xs mt-1">
              {lightboxIndex + 1} / {memory.mediaItems.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
