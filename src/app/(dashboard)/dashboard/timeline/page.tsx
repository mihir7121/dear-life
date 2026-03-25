import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TimelineView } from "@/components/timeline/TimelineView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Timeline" };
export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/dashboard");

  const memories = await db.memory.findMany({
    where: { userId: user.id, published: true },
    include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
    orderBy: { date: "desc" },
  });

  return <TimelineView memories={JSON.parse(JSON.stringify(memories))} />;
}
