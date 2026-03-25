import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { MemoryDetailView } from "@/components/memory/MemoryDetailView";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const memory = await db.memory.findUnique({
    where: { id },
    select: { title: true, description: true },
  });
  return {
    title: memory?.title ?? "Memory",
    description: memory?.description?.slice(0, 160) ?? undefined,
  };
}

export default async function MemoryDetailPage({ params }: Props) {
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

  return <MemoryDetailView memory={JSON.parse(JSON.stringify(memory))} />;
}
