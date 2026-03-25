import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FavoritesView } from "@/components/favorites/FavoritesView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Favorites" };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/dashboard");

  const memories = await db.memory.findMany({
    where: { userId: user.id, favorite: true, published: true },
    include: { mediaItems: { orderBy: { orderIndex: "asc" } } },
    orderBy: { date: "desc" },
  });

  return <FavoritesView memories={JSON.parse(JSON.stringify(memories))} />;
}
