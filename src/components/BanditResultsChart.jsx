import BernoulliArmsChart from "@/components/charts/BernoulliArmsChart.jsx";
import GaussianArmsChart from "@/components/charts/GaussianArmsChart.jsx";
import CumulativeLineChart from "@/components/charts/CumulativeLineChart.jsx";
import WinnerCard from "@/components/WinnerCard.jsx";

export default function BanditResultsCharts({ game, cumulativeRewards, lang, winner }) {
    return (
        <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl flex flex-col gap-6">
            <WinnerCard
                winner={winner}
                lang={lang}
            />
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
    );
}