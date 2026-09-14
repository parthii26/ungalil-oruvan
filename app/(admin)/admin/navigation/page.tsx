import { listAllNavigationItems } from "@/lib/repositories/navigation";
import { NavigationEditor } from "@/components/admin/navigation-editor";

export const metadata = {
  title: "Navigation Editor — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const items = listAllNavigationItems();

  return (
    <div>
      <NavigationEditor initialItems={items} />
    </div>
  );
}
