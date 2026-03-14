import { redirect } from "next/navigation";
import { requireSession } from "@/services/auth/auth-service";

export default async function ClientsPage() {
  const session = await requireSession();

  redirect(session.user.role === "admin" ? "/dashboard/admin" : "/dashboard");
}
