"use client"

import { Bar, BarChart, XAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";

const chartConfig = {
    manual: { label: "Manual", color: "var(--chart-1)" },
    greedy: { label: "Greedy", color: "var(--chart-2)" },
    epsilonGreedy: { label: "Epsilon-Greedy", color: "var(--chart-3)" },
};

export default function BernoulliArmsChart({ probabilities, lang }) {
    const barData = (probabilities ?? []).map((p, idx) => ({
        arm: `${idx + 1}`,
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
                        <BarChart data={barData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="arm" axisLine={false} tickLine={false} />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        labelFormatter={(label) => `${lang === "de" ? "Kampagne" : "Campaign"} #${label}`}
                                        formatter={(value) => (
                                            <div className="flex justify-between text-xs w-full">
                                                <span className="text-muted-foreground">
                                                    {lang === "de" ? "Wahrscheinlichkeit" : "Probability"}
                                                </span>
                                                <span className="text-foreground font-mono font-medium tabular-nums">
                                                    {Math.round(value * 100)}%
                                                </span>
                                            </div>
                                        )}
                                    />
                                }
                            />
                            <Bar dataKey="probability" fill="var(--chart-1)" radius={8} />
                        </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
