"use client"

import React, { useState } from "react"
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const chartConfig = {
    manual: { label: "Manual", color: "var(--chart-1)" },
    greedy: { label: "Greedy", color: "var(--chart-2)" },
    epsilonGreedy: { label: "Epsilon-Greedy", color: "var(--chart-3)" },
    upperConfidenceBound: { label: "UCB", color: "var(--chart-4)" },
    gradientBandit: { label: "Gradient Bandit", color: "var(--chart-5)" },
};

function makeLineData({ manualRewards = [], greedyRewards = [], epsilonGreedyRewards = [],
                          UpperConfidenceBoundRewards = [], GradientBanditRewards = [] }) {
    const data = [{ try: 0, manual: 0, greedy: 0, epsilonGreedy: 0, upperConfidenceBound: 0, gradientBandit: 0 }];
    const maxLength = Math.max(manualRewards.length, greedyRewards.length, epsilonGreedyRewards.length, UpperConfidenceBoundRewards.length, GradientBanditRewards.length);

    for (let i = 0; i < maxLength; i++) {
        const entry = { try: i + 1 };

        if (i < manualRewards.length) entry.manual = manualRewards[i];
        if (i < greedyRewards.length) entry.greedy = greedyRewards[i];
        if (i < epsilonGreedyRewards.length) entry.epsilonGreedy = epsilonGreedyRewards[i];
        if (i < UpperConfidenceBoundRewards.length) entry.upperConfidenceBound = UpperConfidenceBoundRewards[i];
        if (i < GradientBanditRewards.length) entry.gradientBandit = GradientBanditRewards[i];

        data.push(entry);
    }

    return data;
}

export default function CumulativeLineChart({ cumulativeRewards, chosenDistribution, lang }) {

    const [hidden, setHidden] = useState({})

    const handleLegendClick = (key) => {
        setHidden((prev) => ({ ...prev, [key]: !prev[key] }))
    }


    return (
        <Card className="flex-1 bg-muted/30">
            <CardHeader>
                <CardTitle>
                    {lang === "de" ? "Kumulierte Belohnungen" : "Cumulative Rewards"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="overflow-hidden">
                    <ResponsiveContainer width="100%">
                        <LineChart data={makeLineData(cumulativeRewards)}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="try" axisLine={false} tickLine={false} />
                            <ChartTooltip
                                labelFormatter={() =>
                                    lang === "de" ? "Belohnungen" :
                                        "Rewards"
                                }
                                content={
                                    <ChartTooltipContent
                                        formatter={(value, name) => {
                                            if (chosenDistribution === "Gaussian") {
                                                return (
                                                    <div className="text-muted-foreground flex min-w-[150px] items-center text-xs">
                                                        {chartConfig[name]?.label || name}
                                                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                                            {value.toFixed(2)} €
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            return (
                                                <div className="text-muted-foreground flex min-w-[100px] items-center text-xs">
                                                    {chartConfig[name]?.label || name}
                                                    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                                        {value}
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    />
                                }
                            />
                            {Object.entries(chartConfig).map(([key, cfg]) => (
                                <Line
                                    key={key}
                                    type="linear"
                                    dataKey={key}
                                    stroke={cfg.color}
                                    strokeWidth={2}
                                    dot={false}
                                    hide={hidden[key] ?? false}
                                    name={cfg.label}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
                <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(chartConfig).map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => handleLegendClick(key)}
                            className="flex items-center gap-1 px-2 py-1 border rounded cursor-pointer whitespace-nowrap"
                            style={{ opacity: hidden[key] ? 0.3 : 1 }}
                        >
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                            <span className="text-xs">{cfg.label}</span>
                        </button>
                    ))}
                </div>

            </CardContent>
        </Card>
    )
}
