"use client"

import { Bar, BarChart, Line, LineChart, XAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const chartConfig = {
    efficiency: { label: "True Drug Efficiency", color: "var(--chart-1)" },
    epsilonGreedy: { label: "Epsilon-Greedy", color: "var(--chart-2)" },
    ucb: { label: "UCB", color: "var(--chart-3)" },
    thompsonSampling: { label: "Thompson Sampling", color: "var(--chart-4)" },
    regret: { label: "Regret", color: "var(--chart-5)" },
}

function makeLineData(cumulativeRewards) {
const rewards = cumulativeRewards ?? [];
return [{ try: 0, reward: 0 }, ...rewards.map((val, idx) => ({
    try: idx + 1,
    reward: val
}))];
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
                                <LineChart data={makeLineData(cumulativeRewards)}>                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="try" axisLine={false} tickLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="reward" stroke="var(--chart-1)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}