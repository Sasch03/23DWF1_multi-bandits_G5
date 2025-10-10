"use client"

import GaussianArmsChart from "@/components/charts/GaussianArmsChart.jsx";
import BernoulliArmsChart from "@/components/charts/BernoulliArmsChart.jsx";
import CumulativeLineChart from "@/components/charts/CumulativeLineChart.jsx";


export default function BanditResultsCharts({ game, cumulativeRewards }) {
    console.log(game);
    console.log("Cumulative rewards:", cumulativeRewards);

    return (
        <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full">
                {game?.chosenDistribution === "Bernoulli" ? (
                    <BernoulliArmsChart probabilities={game.bernoulliProbabilities} />
                ) : (
                    <GaussianArmsChart game={game} points={300} normalize={true} />
                )}
                {/* LineChart Card */}
                <CumulativeLineChart cumulativeRewards={cumulativeRewards} chosenDistribution={game?.chosenDistribution} />

            </div>
        </div>
    )
}