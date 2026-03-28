"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import {
  Globe2,
  Clock,
  Images,
  Heart,
  Settings,
  Plus,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Globe2, label: "Globe", exact: true },
  { href: "/dashboard/timeline", icon: Clock, label: "Timeline" },
  { href: "/dashboard/gallery", icon: Images, label: "Gallery" },
  { href: "/dashboard/favorites", icon: Heart, label: "Favorites" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function NavItem({
  href,
  icon: Icon,
  label,
  exact,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} className="group relative flex items-center">
      <motion.div
        className={cn(
          "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
          isActive
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
      >
        <Icon className={cn("w-4.5 h-4.5 flex-shrink-0", isActive && "text-primary")} />
        <span className="truncate">{label}</span>
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full -ml-3"
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
      </motion.div>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-60 h-screen sticky top-0 border-r border-border bg-card/50 backdrop-blur-xl shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border/50">
        <Globe2 className="w-5 h-5 text-primary flex-shrink-0" />
        <span className="font-display font-bold text-base tracking-tight">Dear Life</span>
      </div>

      {/* Quick add */}
      <div className="px-3 py-4">
        <Link
          href="/dashboard/memories/new"
          className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-depth"
        >
          <Plus className="w-4 h-4" />
          Add Memory
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Bottom: user + theme */}
      <div className="p-4 border-t border-border/50 flex items-center justify-between">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 rounded-full",
              userButtonPopoverCard: "bg-card border border-border shadow-depth-lg rounded-2xl",
            },
          }}
        />
        <ThemeToggle />
      </div>
    </aside>
  );
}

// Mobile header with hamburger menu
export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border glass">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4.5 h-4.5 text-primary" />
          <span className="font-display font-bold text-base tracking-tight">Dear Life</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/memories/new"
            className="flex items-center gap-1.5 bg-primary/15 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 bg-card border-r border-border md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-primary" />
                  <span className="font-display font-bold text-base">Dear Life</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-border"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-3 py-4">
                <Link
                  href="/dashboard/memories/new"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Memory
                </Link>
              </div>

              <nav className="flex-1 px-3 space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href} onClick={() => setIsOpen(false)}>
                    <NavItem {...item} />
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-border/50 flex items-center justify-between">
                <UserButton />
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
