import { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t("savings")} - Expense Tracker`,
    icons: {
      icon: (await parent).icons?.icon,
    },
  };
}

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-16">
      <h1 className="text-4xl font-extrabold">{t("savings")}</h1>
    </div>
  );
}
