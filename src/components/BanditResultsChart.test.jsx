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

describe("BanditResultsCharts", () => {
    it("renders Bernoulli chart when distribution is Bernoulli", () => {
        const game = { chosenDistribution: "Bernoulli", bernoulliProbabilities: [0.2, 0.5, 0.8] };
        const cumulativeRewards = { manualRewards: [], greedyRewards: [], epsilonGreedyRewards: [] };

        render(<BanditResultsCharts game={game} cumulativeRewards={cumulativeRewards} />);

        expect(screen.getByTestId("bernoulli-chart")).toBeInTheDocument();
        expect(screen.queryByTestId("gaussian-chart")).not.toBeInTheDocument();
        expect(screen.getByTestId("cumulative-chart")).toBeInTheDocument();
    });

    it("renders Gaussian chart when distribution is Gaussian", () => {
        const game = { chosenDistribution: "Gaussian", gaussianMeans: [10, 50, 90] };
        const cumulativeRewards = { manualRewards: [], greedyRewards: [], epsilonGreedyRewards: [] };

        render(<BanditResultsCharts game={game} cumulativeRewards={cumulativeRewards} />);

        expect(screen.getByTestId("gaussian-chart")).toBeInTheDocument();
        expect(screen.queryByTestId("bernoulli-chart")).not.toBeInTheDocument();
        expect(screen.getByTestId("cumulative-chart")).toBeInTheDocument();
    });
});
