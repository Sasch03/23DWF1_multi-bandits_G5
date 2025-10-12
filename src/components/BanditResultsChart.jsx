"use client"

import GaussianArmsChart from "@/components/charts/GaussianArmsChart.jsx";
import BernoulliArmsChart from "@/components/charts/BernoulliArmsChart.jsx";
import CumulativeLineChart from "@/components/charts/CumulativeLineChart.jsx";

export default function BanditResultsCharts({ game, cumulativeRewards, lang }) {
    console.log(game);
    console.log("Cumulative rewards:", cumulativeRewards);

    const distributionLabel = game?.chosenDistribution === "Bernoulli"
        ? (lang === "de" ? "Bernoulli-Verteilung" : "Bernoulli distribution")
        : (lang === "de" ? "Gaußsche Verteilung" : "Gaussian distribution");

    return (
        <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl">
            <h2 className="text-lg font-bold mb-4">{distributionLabel}</h2>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full">
                {game?.chosenDistribution === "Bernoulli" ? (
                    <BernoulliArmsChart
                        probabilities={game.bernoulliProbabilities}
                        lang={lang}
                    />
                ) : (
                    <GaussianArmsChart
                        game={game}
                        points={300}
                        normalize={true}
                        lang={lang}
                    />
                )}
                <CumulativeLineChart
                    cumulativeRewards={cumulativeRewards}
                    chosenDistribution={game?.chosenDistribution}
                    lang={lang}
                />
            </div>
        </div>
    )
}