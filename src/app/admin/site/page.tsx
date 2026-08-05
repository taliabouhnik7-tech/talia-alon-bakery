import { fetchSiteSettings } from "@/lib/site-settings-server";
import { SiteSettingsEditor } from "./SiteSettingsEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "אתר — טליה אלון",
};

export default async function AdminSitePage() {
  const settings = await fetchSiteSettings();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">הגדרות אתר</h1>
        <p className="text-sm text-gray-500">
          כותרת מותאמת אישית ושורת המידע שמתחתיה. לחצו “שמירה” כדי להחיל על האתר.
        </p>
      </div>
      <SiteSettingsEditor initial={settings} />
    </div>
  );
}
