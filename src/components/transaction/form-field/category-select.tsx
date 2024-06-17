import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Badge, BadgeProps, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CATEGORIES_VALUES, DEFAULT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { CategorySliced } from "../category-sliced";
import { TTransactionForm } from "../form-schema";

export function CategorySelectField({
  form,
}: {
  form: UseFormReturn<TTransactionForm>;
}) {
  const t = useTranslations();

  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="categories"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("categories")}</FormLabel>
          <FormControl>
            <Popover open={open} modal={true} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="min-h-10 w-full justify-between px-3 font-normal hover:bg-transparent"
                >
                  {field.value.length > 0 ? (
                    <CategorySliced
                      categories={field.value as typeof CATEGORIES_VALUES}
                    />
                  ) : (
                    t("category-select")
                  )}
                  <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command
                  filter={(value, search) => {
                    // Get the translated category value and convert it to lowercase.
                    const categoryValue = t(
                      `category.value.${value as (typeof CATEGORIES_VALUES)[number]}`
                    ).toLowerCase();
                    // Check if the category value includes the search term.
                    if (categoryValue.includes(search.toLowerCase())) {
                      return 1;
                    }
                    return 0
                  }}
                >
                  <CommandInput placeholder={t("category-search")} />
                  <CommandList className="max-h-56">
                    <CommandEmpty>{t("category-not-found")}</CommandEmpty>
                    {Object.keys(DEFAULT_CATEGORIES).map(
                      (categoryParent, i) => (
                        <Fragment key={i}>
                          <CategoryItem
                            heading={
                              categoryParent as keyof typeof DEFAULT_CATEGORIES
                            }
                            categories={field.value}
                            setCategories={field.onChange}
                          />
                          {i < Object.keys(DEFAULT_CATEGORIES).length - 1 && (
                            <CommandSeparator />
                          )}
                        </Fragment>
                      )
                    )}
                  </CommandList>
                  <CommandSeparator />
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-300">
                      {field.value.length}/6
                    </span>
                    <Button
                      className="tabular-nums"
                      size="xs"
                      disabled={field.value.length === 0}
                      onClick={() => field.onChange([])}
                    >
                      {t("category-clear-all")}
                      {field.value.length > 0 && ` (${field.value.length})`}
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CategoryItem({
  heading,
  categories,
  setCategories,
}: {
  heading: keyof typeof DEFAULT_CATEGORIES;
  categories: string[];
  setCategories: (categories: string[]) => void;
}) {
  const t = useTranslations();

  return (
    <CommandGroup heading={t(`category.key.${heading}`)}>
      <div className="mx-1 flex flex-wrap gap-1 pb-1.5">
        {DEFAULT_CATEGORIES[heading].map((category, i) => (
          <CommandItem
            className={cn(
              "h-6 w-fit cursor-pointer rounded-full border px-2.5 text-xs font-semibold transition-colors",
              categories?.includes(category)
                ? "border-transparent bg-black text-white hover:bg-black/80 hover:text-white dark:bg-white dark:text-black dark:hover:bg-white/80 dark:hover:text-black"
                : "dark:border-zinc-800"
            )}
            value={category}
            onSelect={(currentValue) => {
              const newCategories = () => {
                if (categories.includes(currentValue))
                  return categories.filter((x) => x !== currentValue);
                else return [...categories, currentValue];
              };

              setCategories(newCategories());
            }}
            disabled={categories.length >= 6 && !categories.includes(category)}
            key={i}
          >
            {t(`category.value.${category}`)}
          </CommandItem>
        ))}
      </div>
    </CommandGroup>
  );
}
