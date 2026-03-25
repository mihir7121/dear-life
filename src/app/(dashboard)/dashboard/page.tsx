import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { GlobeDashboard } from "@/components/globe/GlobeDashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getUserStats(userId: string) {
  const memories = await db.memory.findMany({
    where: { user: { clerkId: userId }, published: true },
    include: { mediaItems: true },
    orderBy: { date: "desc" },
  });

  const countries = new Set(memories.map((m) => m.country).filter(Boolean)).size;
  const cities = new Set(memories.map((m) => m.city).filter(Boolean)).size;
  const favorites = memories.filter((m) => m.favorite).length;

  return { memories, countries, cities, favorites };
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await db.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId },
  });

  const { memories, countries, cities, favorites } = await getUserStats(userId);

  return (
    <GlobeDashboard
      memories={JSON.parse(JSON.stringify(memories))}
      stats={{ totalMemories: memories.length, countries, cities, favorites }}
    />
  );
}
