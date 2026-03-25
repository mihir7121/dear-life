import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsView } from "@/components/settings/SettingsView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  const [user, stats] = await Promise.all([
    db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        name: clerkUser?.fullName ?? clerkUser?.firstName ?? undefined,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? undefined,
        avatar: clerkUser?.imageUrl ?? undefined,
      },
    }),
    db.memory.aggregate({
      where: { user: { clerkId: userId } },
      _count: { id: true },
    }),
  ]);

  return (
    <SettingsView
      user={JSON.parse(JSON.stringify(user))}
      stats={{ totalMemories: stats._count.id }}
    />
  );
}
