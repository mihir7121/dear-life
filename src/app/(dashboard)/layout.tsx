import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar, MobileHeader } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
