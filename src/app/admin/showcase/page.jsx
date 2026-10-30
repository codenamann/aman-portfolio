import { redirect } from "next/navigation";

export default function AdminShowcaseRedirect() {
  redirect("/admin/projects?tab=carousel");
}
