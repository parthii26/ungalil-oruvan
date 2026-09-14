import { getSiteSettings } from "@/lib/services/settings";
import { AboutEditor } from "@/components/admin/about-editor";

export const metadata = {
  title: "About Page Editor — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const settings = getSiteSettings();

  return (
    <div>
      <AboutEditor initialData={settings} />
    </div>
  );
}
