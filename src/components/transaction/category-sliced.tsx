import { useTranslations } from "next-intl";

import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CATEGORIES_VALUES } from "@/lib/constants";

/**
 * Renders a list of categories, slicing it to a maximum number of categories and displaying a tooltip with the remaining categories.
 *
 * @param {Object} props - The props object.
 * @param {CATEGORIES_VALUES[]} props.categories - The list of categories to render.
 * @param {number} [props.maxCategories=2] - The maximum number of categories to display.
 * @param {BadgeProps['variant']} [props.badgeVariant='default'] - The variant of the badge.
 */
export function CategorySliced({
  categories,
  maxCategories = 2,
  badgeVariant = "default",
}: {
  categories: typeof CATEGORIES_VALUES;
  maxCategories?: number;
  badgeVariant?: BadgeProps["variant"];
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-wrap gap-1">
      {categories.slice(0, maxCategories).map((category, i) => (
        <Badge variant={badgeVariant} key={i}>
          {t(`category.value.${category}`)}
        </Badge>
      ))}
      <TooltipProvider>
        <Tooltip>
          {categories.length > maxCategories && (
            <>
              <TooltipTrigger asChild>
                <span className="my-auto ml-1 text-xs">
                  + {categories.length - maxCategories} more
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-left dark:bg-zinc-700">
                {categories.slice(maxCategories).map((category, i) => (
                  <p key={i}>{t(`category.value.${category}`)}</p>
                ))}
              </TooltipContent>
            </>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
