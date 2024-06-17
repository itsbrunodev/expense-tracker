"use client";

import { parse } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback } from "react";

import { TIMEFRAME_KEY } from "@/lib/constants";
import { capitalizeFirstLetter, getCurrentTimeframe } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export type MonthYear = {
  month: string;
  year: string;
};

type GroupedByYear = {
  [year: string]: MonthYear[];
};

function groupByYear(array: MonthYear[]): GroupedByYear {
  const grouped: GroupedByYear = {};

  for (const { year, month } of array) {
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push({ month, year });
  }

  Object.keys(grouped).forEach((year) => {
    grouped[year].sort((a, b) => {
      const dateA = parse(a.month, "MMMM", new Date());
      const dateB = parse(b.month, "MMMM", new Date());
      return dateB.getTime() - dateA.getTime();
    });
  });

  return grouped;
}

/**
 * Component for selecting a month and year.
 * @param {Object} props - The component props.
 * @param {Array<MonthYear>} props.months - The list of months and years to display.
 * @returns {JSX.Element} - The rendered component.
 */
export function MonthSelect({ months }: { months: MonthYear[] }) {
  // Get router and search params.
  const { push } = useRouter();
  const searchParams = useSearchParams();

  // Get the selected timeframe from search params or current timeframe.
  const timeframeSelected = searchParams.get(TIMEFRAME_KEY);
  const currentTimeframe = getCurrentTimeframe();

  // Group the months and years by year.
  const groupedDates = groupByYear(months.length ? months : [currentTimeframe]);

  // Get locale formatter.
  const localeFormat = useFormatter();

  /**
   * Update search params with the new timeframe value.
   * @param {string} value - The new timeframe value.
   */
  const updateSearchParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set(TIMEFRAME_KEY, value);
      push(`/home?${params.toString()}`);
    },
    [push]
  );

  return (
    <DropdownMenu>
      {/* Trigger for the dropdown menu */}
      <DropdownMenuTrigger className="flex items-center gap-2 transition-opacity hover:opacity-80">
        <div className="text-right leading-5">
          {/* Display the current selected month and year */}
          <p className="font-medium">
            {capitalizeFirstLetter(
              localeFormat.dateTime(
                new Date(
                  `${
                    timeframeSelected
                      ? timeframeSelected
                      : `${currentTimeframe.year}-${currentTimeframe.month}-01`
                  }`
                ),
                { month: "long" }
              )
            )}
          </p>
          <p className="text-xs text-zinc-900 dark:text-zinc-200">
            {localeFormat.dateTime(
              new Date(
                `${
                  timeframeSelected
                    ? timeframeSelected
                    : `${currentTimeframe.year}-${currentTimeframe.month}-01`
                }`
              ),
              { year: "numeric" }
            )}
          </p>
        </div>
        <ChevronDownIcon
          className="size-3.5 text-zinc-900 dark:text-zinc-100"
          strokeWidth={3}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end" sideOffset={5}>
        <ScrollArea>
          <ScrollBar orientation="vertical" />
          <DropdownMenuRadioGroup
            className="max-h-96"
            // Set the value of the radio group to the selected timeframe or current timeframe.
            value={
              timeframeSelected ||
              `${currentTimeframe.year}-${currentTimeframe.month.toLowerCase()}`
            }
            // Call the update search params function when the value changes.
            onValueChange={updateSearchParams}
          >
            {/* Loop through the grouped dates and display the months and years */}
            {Object.keys(groupedDates)
              .reverse()
              .map((year, i) => (
                <Fragment key={i}>
                  <DropdownMenuLabel>
                    {/* Display the year */}
                    {localeFormat.dateTime(new Date(`${year}-01-01`), {
                      year: "numeric",
                    })}
                  </DropdownMenuLabel>
                  {groupedDates[year].map((m, i) => (
                    <DropdownMenuRadioItem
                      // Set the value of each radio item to the year and month in lowercase.
                      value={`${year}-${m.month.toLowerCase()}`}
                      key={i}
                    >
                      {/* Display the month */}
                      {capitalizeFirstLetter(
                        localeFormat.dateTime(new Date(`2000-${m.month}-01`), {
                          month: "long",
                        })
                      )}
                    </DropdownMenuRadioItem>
                  ))}
                  {/* Add a separator between years */}
                  {i < Object.keys(groupedDates).length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </Fragment>
              ))}
          </DropdownMenuRadioGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
