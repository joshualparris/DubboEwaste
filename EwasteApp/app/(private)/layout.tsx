import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { requireProgrammeContext } from "@/lib/programme-context";
import { canVisit } from "@/lib/programmes";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { context } = await requireProgrammeContext();
  const pathname = (await headers()).get("x-assetflow-path") || "/dashboard";
  if (!canVisit(pathname, context.selected, context.global_admin, context.role)) redirect("/programmes?error=Choose%20an%20authorised%20programme%20for%20that%20section");
  return <div className="shell">
    <AppNav fullName={context.full_name} role={context.role || "volunteer"} programme={context.selected} globalAdmin={context.global_admin} />
    <main className="container">{children}</main>
  </div>;
}
