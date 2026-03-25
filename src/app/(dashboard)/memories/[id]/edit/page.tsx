import { redirect } from "next/navigation";
interface Props { params: Promise<{ id: string }> }
export default async function EditRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/dashboard/memories/${id}/edit`);
}
