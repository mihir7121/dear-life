import { redirect } from "next/navigation";

// Route group pages must not conflict with app/page.tsx (marketing).
// All dashboard content lives under /dashboard via (dashboard)/dashboard/
export default function DashboardRootRedirect() {
  redirect("/dashboard");
}
