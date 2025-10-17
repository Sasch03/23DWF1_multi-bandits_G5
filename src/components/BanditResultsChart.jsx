import BernoulliArmsChart from "@/components/charts/BernoulliArmsChart.jsx";
import GaussianArmsChart from "@/components/charts/GaussianArmsChart.jsx";
import CumulativeLineChart from "@/components/charts/CumulativeLineChart.jsx";
import WinnerCard from "@/components/WinnerCard.jsx";

/**
 * BanditResultsCharts Component
 *
 * Displays visualizations of a multi-armed bandit simulation, including:
 * - Winner summary card
 * - Per-arm performance chart (Bernoulli or Gaussian)
 * - Cumulative reward line chart
 *
 * The component dynamically selects the appropriate arm chart based on the
 * chosen reward distribution in the simulation.
 *
 * @component
 *
 * @param {object} props
 * @param {Object} props.game - The current state of the bandit game
 * @param {Array<number>} props.cumulativeRewards - Array of cumulative rewards over time
 * @param {"en"|"de"} props.lang - Language code for displayed labels
 * @param {Array} props.winner - Winner information object for the WinnerCard
 * @returns {JSX.Element} Rendered charts and winner summary for the bandit simulation
 */
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