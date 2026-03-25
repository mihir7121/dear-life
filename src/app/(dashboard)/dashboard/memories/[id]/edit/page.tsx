import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { MemoryForm } from "@/components/memory/MemoryForm";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Memory" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMemoryPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/dashboard");

  const memory = await db.memory.findUnique({
    where: { id, userId: user.id },
    include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
  });

  if (!memory) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 sticky top-0 bg-background/80 backdrop-blur z-10">
        <h1 className="font-display font-bold text-xl">Edit Memory</h1>
        <p className="text-sm text-muted-foreground">{memory.title}</p>
      </div>
      <MemoryForm mode="edit" initialData={JSON.parse(JSON.stringify(memory))} />
    </div>
  );
}
