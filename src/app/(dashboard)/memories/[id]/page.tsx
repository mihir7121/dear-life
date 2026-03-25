import { redirect } from "next/navigation";
interface Props { params: Promise<{ id: string }> }
export default async function MemoryRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/dashboard/memories/${id}`);
}
