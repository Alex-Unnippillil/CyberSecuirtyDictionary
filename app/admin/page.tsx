import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  const session = cookies().get("session");
  if (!session) {
    redirect("/");
  }
  return <AdminPanel />;
}
