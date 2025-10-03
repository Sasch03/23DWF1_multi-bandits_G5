import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BanditResultsCharts from "./BanditResultsChart";

// Mock for Recharts
vi.mock("recharts", async () => {
    const actual = await vi.importActual("recharts");
    return {
        ...actual,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
        BarChart: ({ children, data }) => (
            <div data-testid="bar-chart">
                {children}
                {data?.map((_, i) => (
                    <div key={i}>{`Arm ${i + 1}`}</div>
                ))}
            </div>
        ),
        LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
        Bar: () => <div />, // leer, wird durch BarChart-Mock ersetzt
        Line: () => <div />,
        XAxis: () => <div />,
        CartesianGrid: () => <div />,
    };
});

const mockGame = {
    bernoulliProbabilities: [0.1, 0.5, 0.9],
    tableOfRewards: [[1, 0, 1]],
    numberOfTries: 3,
};

describe("BanditResultsCharts", () => {
    it("renders card titles", () => {
        render(<BanditResultsCharts game={mockGame} />);
        expect(screen.getByText("Tatsächliche Wahrscheinlichkeiten")).toBeInTheDocument();
        expect(screen.getByText("Erfolg")).toBeInTheDocument();
    });

    it("renders all arm labels", () => {
        render(<BanditResultsCharts game={mockGame} />);
        const arms = screen.getAllByText(/Arm \d+/i);
        expect(arms).toHaveLength(mockGame.bernoulliProbabilities.length);
    });

    it("renders LineChart", () => {
        render(<BanditResultsCharts game={mockGame} />);
        expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
});
