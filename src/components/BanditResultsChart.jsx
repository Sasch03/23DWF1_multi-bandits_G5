"use client"

import { Bar, BarChart, Line, LineChart, XAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const chartConfig = {
    efficiency: { label: "True Drug Efficiency", color: "var(--chart-1)" },
    epsilonGreedy: { label: "Epsilon-Greedy", color: "var(--chart-2)" },
    ucb: { label: "UCB", color: "var(--chart-3)" },
    thompsonSampling: { label: "Thompson Sampling", color: "var(--chart-4)" },
    regret: { label: "Regret", color: "var(--chart-5)" },
}

const lineData = [
    { arm: "Arm 1", epsilonGreedy: 2, ucb: 3, thompsonSampling: 1, regret: 0.1 },
    { arm: "Arm 2", epsilonGreedy: 4, ucb: 2, thompsonSampling: 3, regret: 0.05 },
    { arm: "Arm 3", epsilonGreedy: 3, ucb: 4, thompsonSampling: 2, regret: 0.2 },
]

export default function BanditResultsCharts({ armProbabilities }) {
    if (!armProbabilities || armProbabilities.length === 0) return null;

    const barData = armProbabilities.map((p, idx) => ({
        arm: `Arm ${idx + 1}`,
        probability: p
    }));

    return (
        <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* BarChart */}
            <ChartContainer config={chartConfig} className="flex-1 h-[250px] overflow-hidden">
                <BarChart width={300} height={250} data={barData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="arm" axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent labelKey="probability" nameKey="arm" />} />
                    <Bar dataKey="probability" fill="var(--chart-1)" radius={4} />
                </BarChart>
            </ChartContainer>

            {/* LineChart: Lives Saved */}
            <ChartContainer config={chartConfig} className="flex-1 h-[250px] overflow-hidden">
                <LineChart width={300} height={250} data={lineData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="arm" axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="epsilonGreedy" stroke="var(--chart-2)" />
                    <Line type="monotone" dataKey="ucb" stroke="var(--chart-3)" />
                    <Line type="monotone" dataKey="thompsonSampling" stroke="var(--chart-4)" />
                </LineChart>
            </ChartContainer>

            {/* LineChart: Regret */}
            <ChartContainer config={chartConfig} className="flex-1 h-[250px] overflow-hidden">
                <LineChart width={300} height={250} data={lineData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="arm" axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="regret" stroke="var(--chart-5)" />
                </LineChart>
            </ChartContainer>
        </div>

    )
}
