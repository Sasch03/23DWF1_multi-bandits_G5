"use client"

import { Bar, BarChart, XAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const chartConfig = {
    manual: { label: "Manual", color: "var(--chart-1)" },
    greedy: { label: "Greedy", color: "var(--chart-2)" },
    epsilonGreedy: { label: "Epsilon-Greedy", color: "var(--chart-3)" },
};

export default function BernoulliArmsChart({ probabilities, lang }) {
    const barData = (probabilities ?? []).map((p, idx) => ({
        arm: `No. ${idx + 1}`,
        probability: p
    }));

    return (
        <Card className="flex-1 bg-muted/30">
            <CardHeader>
                <CardTitle>
                    {lang === "de" ? "Tatsächliche Wahrscheinlichkeiten" : "True Probabilities"}
                </CardTitle>

            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="overflow-hidden">
                    <ResponsiveContainer width="100%">
                        <BarChart data={barData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="arm" axisLine={false} tickLine={false} />
                            <ChartTooltip
                                labelFormatter={() =>
                                    lang === "de" ? "Wahrscheinlichkeiten" :
                                        "Probability"
                                }
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
    )
}
