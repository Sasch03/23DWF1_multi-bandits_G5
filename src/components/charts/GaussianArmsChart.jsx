"use client"

import React, { useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { GAUSSIAN_STD_DEV } from "@/constants"

function gaussianPDF(x, mean, sd) {
    const a = 1 / (sd * Math.sqrt(2 * Math.PI))
    const diff = (x - mean) / sd
    return a * Math.exp(-0.5 * diff * diff)
}

function makeGaussianLineData(means = [], sd = 50, points = 200, normalize = true) {
    if (!means || means.length === 0) return { data: [], keys: [] }

    const min = Math.min(...means) - 4 * sd
    const max = Math.max(...means) + 4 * sd
    const step = (max - min) / (points - 1)

    const keys = means.map((_, i) => `arm_${i}`)
    const data = []

    for (let i = 0; i < points; i++) {
        const x = min + i * step
        const row = { x }
        means.forEach((m, idx) => {
            row[`arm_${idx}`] = gaussianPDF(x, m, sd)
        })
        data.push(row)
    }

    if (normalize) {
        let gmax = 0
        data.forEach((r) =>
            keys.forEach((k) => {
                if (r[k] > gmax) gmax = r[k]
            })
        )
        if (gmax > 0)
            data.forEach((r) =>
                keys.forEach((k) => (r[k] = r[k] / gmax))
            )
    }

    return { data, keys }
}

function pickColor(i) {
    const palette = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
    ]
    return palette[i % palette.length]
}

export default function GaussianArmsChart({ game = {}, points = 300, normalize = true, sd = GAUSSIAN_STD_DEV, lang }) {
    const means = game?.gaussianMeans ?? []
    const { data, keys } = makeGaussianLineData(means, sd, points, normalize)

    const chartConfig = Object.fromEntries(
        means.map((m, i) => [
            `arm_${i}`,
            { label: `No. ${i + 1} (μ=${m.toFixed(2)})`, color: pickColor(i) },
        ])
    )

    const [hidden, setHidden] = useState({})

    const handleLegendClick = (key) => {
        setHidden((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <Card className="flex-1 bg-muted/30">
            <CardHeader>
                <CardTitle>
                    {lang === "de" ? "Gaußsche Arme" : "Gaussian Arms"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="overflow-hidden">
                        <LineChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="x"
                                type="number"
                                domain={["dataMin", "dataMax"]}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => v.toFixed(0)}
                            />
                            <YAxis
                                allowDecimals
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => v.toFixed(2)}
                                domain={[0, 1]}
                            />
                            <ChartTooltip
                                labelFormatter={() =>
                                    lang === "de" ? "Relative Wahrscheinlichkeitsdichte" :
                                        "Relative Probability Density"
                                }
                                content={
                                    <ChartTooltipContent
                                        formatter={(value, name) => {
                                            if (hidden[name]) return null
                                            return (
                                                <div className="text-muted-foreground flex min-w-[180px] text-xs">
                                                    {chartConfig[name]?.label || name}
                                                    <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                                        {Number(value).toFixed(4)}
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    />
                                }
                            />

                            {keys.map((k, idx) => (
                                <Line
                                    key={k}
                                    type="monotone"
                                    dataKey={k}
                                    stroke={pickColor(idx)}
                                    strokeWidth={2}
                                    dot={false}
                                    hide={hidden[k] ?? false}
                                    name={chartConfig[k].label}
                                />
                            ))}

                            {means.map((m, idx) => (
                                <ReferenceLine
                                    key={`ref_${idx}`}
                                    x={m}
                                    stroke={pickColor(idx)}
                                    strokeDasharray="4 4"
                                />
                            ))}
                        </LineChart>
                </ChartContainer>

                <div className="flex flex-wrap gap-2 mt-2">
                    {keys.map((k) => {
                        const cfg = chartConfig[k]
                        return (
                            <button
                                key={k}
                                onClick={() => handleLegendClick(k)}
                                className="flex items-center gap-1 px-2 py-1 border rounded cursor-pointer whitespace-nowrap"
                                style={{ opacity: hidden[k] ? 0.3 : 1 }}
                            >
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cfg.color }} />
                                <span className="text-xs">{cfg.label}</span>
                            </button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
