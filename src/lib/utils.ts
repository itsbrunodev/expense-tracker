import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(options: {
  value: number;
  locale?: string;
  showSign?: boolean; // New option to show positive/negative sign
  formatOptions?: Intl.NumberFormatOptions;
}): {
  formattedValue: string;
  options: {
    prefix: string;
    includeThousandsSeparator: boolean;
    thousandsSeparatorSymbol: string;
    allowDecimal: boolean;
    decimalSymbol: string;
    decimalLimit: number;
    integerLimit: number;
    allowNegative: boolean;
    allowLeadingZeroes: boolean;
    showSign?: boolean; // Include the new option in the return object
  };
} {
  const {
    value,
    locale = "en",
    showSign = false,
    formatOptions = {},
  } = options;

  const numberFormatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...formatOptions,
  };

  // Format the value without currency to get the correct separators
  const formattedValue = value.toLocaleString(locale, numberFormatOptions);

  // Determine the thousands separator symbol and decimal symbol
  const numberFormat = new Intl.NumberFormat(locale);
  const formattedNumber = numberFormat.format(12345.67);
  const thousandsSeparatorSymbol = formattedNumber.match(/[\D]/g)?.[0] || " ";
  const decimalSymbol = formattedNumber.match(/[\D]/g)?.[1] || ".";

  return {
    formattedValue: showSign
      ? (value >= 0 ? "+" : "") + formattedValue
      : formattedValue,
    options: {
      prefix: "",
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol,
      allowDecimal: true,
      decimalSymbol,
      decimalLimit: numberFormatOptions.minimumFractionDigits as number,
      integerLimit: 10,
      allowNegative: false,
      allowLeadingZeroes: false,
      showSign, // Include the new option in the return object
    },
  };
}

export function parseCurrency(
  formattedValue: string,
  options: {
    thousandsSeparatorSymbol: string;
    decimalSymbol: string;
  }
): number {
  // Replace the thousands separator symbol with an empty string
  const valueWithoutThousandsSeparator = formattedValue.replace(
    new RegExp("\\" + options.thousandsSeparatorSymbol, "g"),
    ""
  );

  // Replace the decimal symbol with a dot
  const valueWithDotAsDecimal = valueWithoutThousandsSeparator.replace(
    options.decimalSymbol,
    "."
  );

  // Parse the value as a float
  return parseFloat(valueWithDotAsDecimal);
}

/* export function formatNumberWithSign(num: number): string {
  const prefix = num >= 0 ? "+" : "-";
  return `${prefix}${Math.abs(Number(num.toFixed(1)))}`;
} */

export function getCurrentTimeframe() {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear().toString();

  return {
    month,
    year,
  };
}

export function isValidMonthYearFormat(input: string) {
  // Regular expression to match the format "YYYY-Month"
  const regex =
    /^(19|20)\d{2}-(january|february|march|april|may|june|july|august|september|october|november|december)$/;

  return regex.test(input);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}-01`;
}

export function percentageDifference(a: number, b: number) {
  const diff = ((b - a) * 100) / a;

  if (Number.isFinite(diff)) return diff;
  else return 0;
}
