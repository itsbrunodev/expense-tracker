"use client";

import { format } from "date-fns";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  LineProps,
  ReferenceLineProps,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import colors from "tailwindcss/colors";

import { formatNumber } from "@/lib/utils";

export function BalanceStatistic({
  className = "",
  data,
  keys,
  xAxisLabel,
}: {
  className?: string;
  data: any[];
  keys: {
    name: string;
    dataKey: string;
    stackId: string;
    color: [string, string];
  }[];
  xAxisLabel: string;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <ResponsiveContainer className={className} width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        outerRadius={0}
        innerRadius={0}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisLabel} />
        <YAxis />
        <Tooltip content={<TooltipComponent />} />
        <Legend />
        {keys.map((key, i) => (
          <Bar
            stackId={key.stackId}
            dataKey={key.dataKey}
            name={key.name}
            strokeWidth={3}
            stroke={resolvedTheme === "light" ? key.color[0] : key.color[1]}
            strokeOpacity={1}
            fill={resolvedTheme === "light" ? key.color[0] : key.color[1]}
            fillOpacity={0.4}
            strokeLinejoin="bevel"
            key={i}
          />
        ))}
        {/* <Line
          type="monotone"
          dataKey="Balance"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        /> */}
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}

function TooltipComponent({
  active,
  payload,
  label,
}: TooltipProps<number, NameType>) {
  if (!active) return null;

  const { Balance: balance, Currency: currency } = payload?.[0].payload;

  return (
    <div className="rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-800">
      <p className="text- font-semibold">
        {
          formatNumber({
            value: balance,
            locale: "en",
          }).formattedValue
        }{" "}
        <span className="text-xs font-normal">{currency}</span>
      </p>
      {/* <p className="text-xs">{label}</p> */}
    </div>
  );
}
