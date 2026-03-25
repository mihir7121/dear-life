"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, MapPin, Calendar, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Memory } from "@/types";
import { formatDate, cn } from "@/lib/utils";
import { getCategoryMeta } from "@/lib/categories";

interface MemoryCardProps {
  memory: Memory;
  index?: number;
  variant?: "default" | "compact" | "gallery";
  onDelete?: (id: string) => void;
}

export function MemoryCard({
  memory,
  index = 0,
  variant = "default",
  onDelete,
}: MemoryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const categoryMeta = getCategoryMeta(memory.category);
  const coverMedia =
    memory.mediaItems.find((m) => m.id === memory.coverMediaId) || memory.mediaItems[0];

  if (variant === "gallery") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="masonry-item"
      >
        <Link href={`/dashboard/memories/${memory.id}`} className="block group">
          <div className="relative overflow-hidden rounded-2xl bg-muted">
            {coverMedia ? (
              <img
                src={coverMedia.url}
                alt={memory.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ aspectRatio: index % 3 === 0 ? "3/4" : index % 5 === 0 ? "1/1" : "4/3" }}
              />
            ) : (
              <div
                className="w-full"
                style={{
                  aspectRatio: "4/3",
                  background: `linear-gradient(135deg, ${categoryMeta.color}30, ${categoryMeta.color}10)`,
                }}
              />
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-sm font-semibold line-clamp-1">{memory.title}</p>
              <p className="text-white/70 text-xs">{memory.city || memory.locationName}</p>
            </div>
            {/* Category indicator */}
            <div
              className="absolute top-2 left-2 w-2 h-2 rounded-full"
              style={{ background: categoryMeta.color }}
            />
            {memory.favorite && (
              <div className="absolute top-2 right-2">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={`/dashboard/memories/${memory.id}`}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            {coverMedia ? (
              <img src={coverMedia.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-2xl"
                style={{ background: categoryMeta.bgColor }}
              >
                {categoryMeta.icon}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {memory.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {memory.city ? `${memory.city} · ` : ""}
              {formatDate(memory.date)}
            </p>
          </div>
          {memory.favorite && <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 flex-shrink-0" />}
        </Link>
      </motion.div>
    );
  }

  // Default card
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="memory-card group"
    >
      <div className="scrapbook-layer relative bg-card border border-border rounded-2xl overflow-hidden shadow-depth hover:shadow-depth-lg transition-shadow duration-300">
        {/* Cover image */}
        <Link href={`/dashboard/memories/${memory.id}`} className="block">
          <div className="relative h-52 bg-muted overflow-hidden">
            {coverMedia ? (
              <img
                src={coverMedia.url}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-5xl"
                style={{
                  background: `linear-gradient(135deg, ${categoryMeta.color}25, ${categoryMeta.color}10)`,
                }}
              >
                {categoryMeta.icon}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur"
                style={{
                  background: categoryMeta.bgColor,
                  color: categoryMeta.color,
                  border: `1px solid ${categoryMeta.color}40`,
                }}
              >
                {categoryMeta.icon} {categoryMeta.label}
              </span>
            </div>

            {/* Favorite */}
            {memory.favorite && (
              <div className="absolute top-3 right-10 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 backdrop-blur">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              </div>
            )}

            {/* Menu */}
            <div className="absolute top-3 right-3">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(!menuOpen);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-black/40 backdrop-blur hover:bg-black/60 transition-colors text-white"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 z-10 min-w-[130px] bg-popover border border-border rounded-xl shadow-depth-lg overflow-hidden">
                    <Link
                      href={`/dashboard/memories/${memory.id}/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(memory.id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Media count strip */}
            {memory.mediaItems.length > 1 && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                {memory.mediaItems.slice(1, 4).map((item) => (
                  <div key={item.id} className="w-8 h-8 rounded-md overflow-hidden border border-white/20">
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {memory.mediaItems.length > 4 && (
                  <div className="w-8 h-8 rounded-md bg-black/60 backdrop-blur flex items-center justify-center border border-white/20 text-white text-xs font-bold">
                    +{memory.mediaItems.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link href={`/dashboard/memories/${memory.id}`}>
            <h3 className="font-display font-bold text-base leading-tight mb-1.5 hover:text-primary transition-colors line-clamp-2">
              {memory.title}
            </h3>
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
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
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {memory.description}
            </p>
          )}

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {memory.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
              {memory.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{memory.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
