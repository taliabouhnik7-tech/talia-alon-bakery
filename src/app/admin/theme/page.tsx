import { fetchThemeValues } from "@/lib/theme-server";
import { ThemeEditor } from "./ThemeEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "עיצוב — טליה אלון",
};

export default async function AdminThemePage() {
  const { values, tableMissing } = await fetchThemeValues();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">עורך העיצוב</h1>
        <p className="text-sm text-gray-500">
          שנו צבעים, גדלים ועיגול פינות עם תצוגה מקדימה חיה. לחצו “שמירת שינויים” כדי להחיל על האתר.
        </p>
      </div>
      <ThemeEditor initialValues={values} tableMissing={tableMissing} />
    </div>
  );
}
