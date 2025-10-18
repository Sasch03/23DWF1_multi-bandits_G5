import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BanditResultsCharts from "@/components/BanditResultsChart.jsx";

vi.mock("@/components/charts/GaussianArmsChart.jsx", () => ({
    default: (props) => <div data-testid="gaussian-chart" {...props} />
}));
vi.mock("@/components/charts/BernoulliArmsChart.jsx", () => ({
    default: (props) => <div data-testid="bernoulli-chart" {...props} />
}));
vi.mock("@/components/charts/CumulativeLineChart.jsx", () => ({
    default: (props) => <div data-testid="cumulative-chart" {...props} />
}));
vi.mock("@/components/WinnerCard.jsx", () => ({
    default: (props) => <div data-testid="winner-card" {...props} />
}));

describe("BanditResultsCharts", () => {
    const cumulativeRewards = { manualRewards: [1,2], greedyRewards: [2,3], epsilonGreedyRewards: [1,3] };
    const winner = ["Greedy", "UCB"];

    it("renders Bernoulli chart when distribution is Bernoulli", () => {
        const game = { chosenDistribution: "Bernoulli", bernoulliProbabilities: [0.2, 0.5, 0.8] };

        render(<BanditResultsCharts game={game} cumulativeRewards={cumulativeRewards} winner={winner} lang="en" />);

        expect(screen.getByTestId("bernoulli-chart")).toBeInTheDocument();
        expect(screen.queryByTestId("gaussian-chart")).not.toBeInTheDocument();
        expect(screen.getByTestId("cumulative-chart")).toBeInTheDocument();
        expect(screen.getByTestId("winner-card")).toBeInTheDocument();
    });

    it("renders Gaussian chart when distribution is Gaussian", () => {
        const game = { chosenDistribution: "Gaussian", gaussianMeans: [10, 50, 90] };

        render(<BanditResultsCharts game={game} cumulativeRewards={cumulativeRewards} winner={winner} lang="de" />);

        expect(screen.getByTestId("gaussian-chart")).toBeInTheDocument();
        expect(screen.queryByTestId("bernoulli-chart")).not.toBeInTheDocument();
        expect(screen.getByTestId("cumulative-chart")).toBeInTheDocument();
        expect(screen.getByTestId("winner-card")).toBeInTheDocument();
    });

});
