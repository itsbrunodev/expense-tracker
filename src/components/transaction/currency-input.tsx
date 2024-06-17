"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

import { formatNumber, parseCurrency } from "@/lib/utils";

interface CurrencyInputProps {
  rawValue: number;
  onChange: ({
    rawValue,
    formattedValue,
  }: {
    rawValue: number;
    formattedValue: string;
  }) => void;
}

export function CurrencyInput({ rawValue, onChange }: CurrencyInputProps) {
  const locale = useLocale();

  const [value, setValue] = useState<string>(
    formatNumber({
      value: rawValue || 0, // default value to 0 if undefined
      locale,
    }).formattedValue
  );
  const [inputWidth, setInputWidth] = useState<number>(0);

  const inputRef = useRef<MaskedInput>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  /**
   * Update the inputWidth state when the value state changes.
   * Calculate the new width by adding a small buffer to the offsetWidth of the span element.
   */
  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 10);
    }
  }, [value]);

  const formattedCurrency = formatNumber({
    value: rawValue || 0,
    locale,
  });

  const currencyMask = createNumberMask(formattedCurrency.options);

  return (
    <>
      <span
        ref={spanRef}
        className="invisible absolute whitespace-nowrap text-6xl font-semibold"
      >
        {value}
      </span>
      <MaskedInput
        className="bg-transparent text-center text-6xl font-semibold outline-none"
        type="text"
        mask={currencyMask}
        ref={inputRef}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;

          if (newValue === "") {
            setValue(formattedCurrency.formattedValue);
          } else {
            setValue(newValue);
          }

          onChange({
            rawValue: parseCurrency(newValue, {
              decimalSymbol: formattedCurrency.options.decimalSymbol,
              thousandsSeparatorSymbol:
                formattedCurrency.options.thousandsSeparatorSymbol,
            }),
            formattedValue: newValue,
          });
        }}
        style={{ width: `${inputWidth}px` }}
      />
    </>
  );
}
