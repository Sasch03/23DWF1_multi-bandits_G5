"use client"

import { Bar, BarChart, Line, LineChart, XAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import {ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const chartConfig = {
    manual: { label: "Manual", color: "var(--chart-1)" },
    greedy: { label: "Greedy", color: "var(--chart-2)" },
    epsilonGreedy: { label: "Epsilon-Greedy", color: "var(--chart-3)" },
};


function makeLineData({ manualRewards = [], greedyRewards = [], epsilonGreedyRewards = [] }) {
    const data = [{ try: 0, manual: 0, greedy: 0, epsilonGreedy: 0 }]; // Start bei 0
    const maxLength = Math.max(manualRewards.length, greedyRewards.length, epsilonGreedyRewards.length);

    for (let i = 0; i < maxLength; i++) {
        const entry = { try: i + 1 };

        if (i < manualRewards.length) entry.manual = manualRewards[i];
        if (i < greedyRewards.length) entry.greedy = greedyRewards[i];
        if (i < epsilonGreedyRewards.length) entry.epsilonGreedy = epsilonGreedyRewards[i];

        data.push(entry);
    }

    return data;
}


export default function BanditResultsCharts({ game, cumulativeRewards }) {
    console.log(game);
    console.log("Cumulative rewards:", cumulativeRewards);

    const barData = (game.bernoulliProbabilities ?? []).map((p, idx) => ({
        arm: `Arm ${idx + 1}`,
        probability: p
    }));

    return (
        <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full">
                {/* BarChart Card */}
                <Card className="flex-1 bg-muted/30 border border-muted/30">
                    <CardHeader>
                        <CardTitle>Tatsächliche Wahrscheinlichkeiten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="overflow-hidden">
                            <ResponsiveContainer width="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="arm" axisLine={false} tickLine={false} />
                                    {/* Custom tooltip for showing percentage */}
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                hideLabel
                                                formatter={(value, name) => (
                                                    <div className="text-muted-foreground flex min-w-[100px] items-center text-xs">
                                                        {chartConfig[name]?.label || name}
                                                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                                            {Math.round(value * 100)}
                                                            <span className="text-muted-foreground font-normal">%</span>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                        }
                                    />
                                    <Bar dataKey="probability" fill="var(--chart-1)" radius={8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* LineChart Card */}
                <Card className="flex-1 bg-muted/30 border border-muted/30">
                    <CardHeader>
                        <CardTitle>Erfolg</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="overflow-hidden">
                            <ResponsiveContainer width="100%">
                                <LineChart data={makeLineData(cumulativeRewards)}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="try" axisLine={false} tickLine={false} />
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                formatter={(value, name) => {
                                                    if (game?.chosenDistribution === "Gaussian") {
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

                                    <ChartLegend content={<ChartLegendContent />} />

                                    {Object.entries(chartConfig).map(([key, cfg]) => (
                                        <Line
                                            key={key}
                                            type="linear"
                                            dataKey={key}
                                            stroke={cfg.color}
                                            strokeWidth={2}
                                            dot={false}
                                            name={cfg.label}
                                        />
                                    ))}
                                </LineChart>

                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}