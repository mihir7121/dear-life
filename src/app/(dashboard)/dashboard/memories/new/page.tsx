import type { Metadata } from "next";
import { MemoryForm } from "@/components/memory/MemoryForm";

export const metadata: Metadata = { title: "Add Memory" };

export default function NewMemoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 sticky top-0 bg-background/80 backdrop-blur z-10">
        <h1 className="font-display font-bold text-xl">New Memory</h1>
        <p className="text-sm text-muted-foreground">Capture a moment worth keeping</p>
      </div>
      <MemoryForm mode="create" />
    </div>
  );
}
