"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Memory } from "@/types";
import { MemoryCard } from "@/components/memory/MemoryCard";

interface FavoritesViewProps {
  memories: Memory[];
}

export function FavoritesView({ memories }: FavoritesViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 sticky top-0 bg-background/90 backdrop-blur z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <h1 className="font-display font-bold text-2xl">Favorites</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {memories.length} {memories.length === 1 ? "memory" : "memories"} you love most
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
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {memories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-5"
            >
              <Heart className="w-10 h-10 text-rose-400" />
            </motion.div>
            <h2 className="font-display font-bold text-2xl mb-2">No favorites yet</h2>
            <p className="text-muted-foreground max-w-xs mb-6 text-sm leading-relaxed">
              Mark memories as favorites by tapping the heart icon. Your most treasured moments will live here.
            </p>
            <Link
              href="/dashboard/timeline"
              className="flex items-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Browse your memories
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Featured — first favorite gets a big card */}
            {memories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Link href={`/dashboard/memories/${memories[0].id}`} className="group block">
                  <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden">
                    {(memories[0].mediaItems.find((m) => m.id === memories[0].coverMediaId) || memories[0].mediaItems[0]) && (
                      <img
                        src={(memories[0].mediaItems.find((m) => m.id === memories[0].coverMediaId) || memories[0].mediaItems[0]).url}
                        alt={memories[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                        <span className="text-rose-300 text-sm font-medium">Favorite</span>
                      </div>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
                        {memories[0].title}
                      </h2>
                      <p className="text-white/70 text-sm">
                        {memories[0].city && `${memories[0].city}, ${memories[0].country}`}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Rest of favorites */}
            {memories.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {memories.slice(1).map((memory, i) => (
                  <MemoryCard key={memory.id} memory={memory} index={i} variant="default" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
