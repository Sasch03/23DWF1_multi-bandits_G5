import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BanditResultsCharts from "./BanditResultsChart";

// --- Mock Recharts (simplified for testing) ---
vi.mock("recharts", async () => {
    const actual = await vi.importActual("recharts");
    return {
        ...actual,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
        BarChart: ({ children, data }) => (
            <div data-testid="bar-chart">
                {children}
                {data?.map((_, i) => (
                    <div key={i} data-testid="arm-label">{`Arm ${i + 1}`}</div>
                ))}
            </div>
        ),
        LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
        Bar: ({ dataKey }) => <div data-testid={`bar-${dataKey}`} />,
        Line: ({ dataKey }) => <div data-testid={`line-${dataKey}`} />,
        XAxis: () => <div data-testid="x-axis" />,
        CartesianGrid: () => <div data-testid="grid" />,
    };
});

// --- Mock Data ---
const mockGame = {
    bernoulliProbabilities: [0.1, 0.5, 0.9],
    tableOfRewards: [[1, 0, 1]],
    numberOfTries: 3,
};

const mockCumulativeRewards = {
    manualRewards: [1, 2, 3],
    greedyRewards: [0, 1, 2],
    epsilonGreedyRewards: [1, 1, 2],
};

describe("BanditResultsCharts", () => {
    it("renders both card titles", () => {
        render(<BanditResultsCharts game={mockGame} cumulativeRewards={mockCumulativeRewards} />);
        expect(screen.getByText("True probabilities")).toBeInTheDocument();
        expect(screen.getByText("Success")).toBeInTheDocument();
    });

    it("renders all arm labels correctly", () => {
        render(<BanditResultsCharts game={mockGame} cumulativeRewards={mockCumulativeRewards} />);
        const arms = screen.getAllByTestId("arm-label");
        expect(arms).toHaveLength(mockGame.bernoulliProbabilities.length);
    });

    it("renders the BarChart with bars", () => {
        render(<BanditResultsCharts game={mockGame} cumulativeRewards={mockCumulativeRewards} />);
        expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
        expect(screen.getByTestId("bar-probability")).toBeInTheDocument();
    });

    it("renders the LineChart", () => {
        render(<BanditResultsCharts game={mockGame} cumulativeRewards={mockCumulativeRewards} />);
        expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("renders all lines defined in chartConfig", () => {
        render(<BanditResultsCharts game={mockGame} cumulativeRewards={mockCumulativeRewards} />);
        expect(screen.getByTestId("line-manual")).toBeInTheDocument();
        expect(screen.getByTestId("line-greedy")).toBeInTheDocument();
        expect(screen.getByTestId("line-epsilonGreedy")).toBeInTheDocument();
    });

});
