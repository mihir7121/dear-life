import { Globe2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Globe2 className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-lg tracking-tight">Atlas of Me</span>
        </Link>
        <ThemeToggle />
      </nav>

      <div className="flex-1 flex">
        {/* Left — decorative panel (desktop only) */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-card border-r border-border">
          {/* Background image grid */}
          <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4 opacity-60">
            {[
              "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&q=70",
              "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=70",
              "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=70",
              "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=70",
            ].map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-card/20 to-card/80" />
          {/* Quote */}
          <div className="relative z-10 flex flex-col justify-end p-10">
            <blockquote className="text-2xl font-display font-semibold text-foreground/90 leading-snug mb-3">
              "Not all those who wander are lost."
            </blockquote>
            <cite className="text-sm text-muted-foreground not-italic">— J.R.R. Tolkien</cite>
          </div>
        </div>

        {/* Right — auth form */}
        <div className="flex-1 flex items-center justify-center p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
