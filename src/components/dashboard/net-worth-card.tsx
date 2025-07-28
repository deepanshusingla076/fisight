'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { mockNetWorthHistory } from '@/lib/mock-data';

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'hsl(var(--primary))',
  },
};

export function NetWorthCard() {
  const latestNetWorth = mockNetWorthHistory[mockNetWorthHistory.length - 1].netWorth;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Net Worth</CardTitle>
        <CardDescription>
          Your financial snapshot over the last 7 months.
        </CardDescription>
        <div className="text-4xl font-bold text-primary pt-2">
          ${latestNetWorth.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={mockNetWorthHistory}
            margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="netWorth"
              type="natural"
              fill="var(--color-netWorth)"
              fillOpacity={0.4}
              stroke="var(--color-netWorth)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
