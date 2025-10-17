"use client"

import React, { useState } from "react"
import { LineChart, Line, XAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

/**
 * Converts raw cumulative reward arrays into chart-ready data.
 *
 * @param {Object} rewards - Object containing reward arrays for each algorithm.
 * @param {number[]} [rewards.manualRewards] - Rewards from manual actions.
 * @param {number[]} [rewards.greedyRewards] - Rewards from greedy algorithm.
 * @param {number[]} [rewards.epsilonGreedyRewards] - Rewards from epsilon-greedy algorithm.
 * @param {number[]} [rewards.UpperConfidenceBoundRewards] - Rewards from UCB algorithm.
 * @param {number[]} [rewards.GradientBanditRewards] - Rewards from gradient bandit algorithm.
 * @returns {Array<Object>} Array of objects with cumulative rewards per try.
 */
function makeLineData({
                          manualRewards = [],
                          greedyRewards = [],
                          epsilonGreedyRewards = [],
                          UpperConfidenceBoundRewards = [],
                          GradientBanditRewards = []
                      }) {

    const data =
        [{ try: 0, manual: 0, greedy: 0, epsilonGreedy: 0, upperConfidenceBound: 0, gradientBandit: 0 }];

    const maxLength = Math.max(
        manualRewards.length,
        greedyRewards.length,
        epsilonGreedyRewards.length,
        UpperConfidenceBoundRewards.length,
        GradientBanditRewards.length);

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

const chartConfig = {
    manual: { label: { de: "Du", en: "You" }, color: "var(--chart-1)" },
    greedy: { label: { de: "Greedy", en: "Greedy" }, color: "var(--chart-2)" },
    epsilonGreedy: { label: { de: "Epsilon-Greedy", en: "Epsilon-Greedy" }, color: "var(--chart-3)" },
    upperConfidenceBound: { label: { de: "UCB", en: "UCB" }, color: "var(--chart-4)" },
    gradientBandit: { label: { de: "Gradient Bandit", en: "Gradient Bandit" }, color: "var(--chart-5)" },
};

/**
 * CumulativeLineChart Component
 *
 * Renders a line chart showing cumulative rewards for multiple algorithms over time.
 * Supports toggling individual algorithm lines on and off.
 *
 * @component
 *
 * @param {object} props
 * @param {Object} props.cumulativeRewards - Object containing reward arrays per algorithm.
 * @param {"Bernoulli"|"Gaussian"} props.chosenDistribution - Type of reward distribution.
 * @param {"de"|"en"} props.lang - Language code for labels.
 * @returns {JSX.Element} Rendered cumulative rewards chart.
 */
export default function CumulativeLineChart({
                                                cumulativeRewards,
                                                chosenDistribution,
                                                lang
                                            }) {



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
                    <LineChart data={makeLineData(cumulativeRewards)}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="try" axisLine={false} tickLine={false} />

                        <ChartTooltip
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;

                                return (
                                    <div className="rounded-md border bg-background p-2 shadow-sm w-[200px]">
                                        <div className="font-medium text-sm mb-1">
                                            {lang === "de" ? "Versuch" : "Attempt"} #{label}
                                        </div>
                                        {payload.map((entry) => {
                                            const name = entry.dataKey;
                                            const value = entry.value;
                                            const config = chartConfig[name];
                                            return (
                                                <div
                                                    key={name}
                                                    className="text-muted-foreground flex min-w-[150px] items-center text-xs"
                                                >
                                                    {config?.label[lang] || name}
                                                    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                                        {chosenDistribution === "Gaussian"
                                                            ? `${value.toFixed(2)} €`
                                                            : value}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }}
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
                                name={cfg.label[lang]}
                            />
                        ))}
                    </LineChart>
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
                            <span className="text-xs">{cfg.label[lang]}</span>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
