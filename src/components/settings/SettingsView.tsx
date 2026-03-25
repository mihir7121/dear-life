"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Globe2, Layers, Heart, Camera, Loader2, Check } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { User } from "@/types";

interface SettingsViewProps {
  user: User;
  stats: { totalMemories: number };
}

export function SettingsView({ user, stats }: SettingsViewProps) {
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveBio = async () => {
    setSaving(true);
    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const stagger = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
    item: {
      hidden: { opacity: 0, y: 16 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 sticky top-0 bg-background/90 backdrop-blur z-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Profile section */}
          <motion.div variants={stagger.item} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Profile
            </h2>
            <div className="flex items-center gap-4 mb-5">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-14 h-14 rounded-2xl",
                    userButtonPopoverCard: "bg-card border border-border shadow-depth-lg rounded-2xl",
                  },
                }}
              />
              <div>
                <p className="font-semibold text-base">{user.name ?? "Atlas Explorer"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  Click avatar to manage profile
                </p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about your adventures..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <button
                onClick={saveBio}
                disabled={saving}
                className="mt-2 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : saved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : null}
                {saved ? "Saved!" : "Save bio"}
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={stagger.item} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Your Atlas
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Layers, label: "Memories", value: stats.totalMemories },
                { icon: Globe2, label: "Globe pins", value: stats.totalMemories },
                { icon: Camera, label: "Media items", value: "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-muted/50">
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="font-display font-bold text-2xl">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div variants={stagger.item} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Appearance
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Theme</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </motion.div>

          {/* Account */}
          <motion.div variants={stagger.item} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Account
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              Manage your account, change your email or password, and more through your Clerk profile.
            </p>
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "flex items-center gap-2",
                },
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
