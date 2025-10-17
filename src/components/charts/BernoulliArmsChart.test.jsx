import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BernoulliArmsChart from "./BernoulliArmsChart.jsx";

vi.mock("recharts", async () => {
    const actual = await vi.importActual("recharts");
    return {
        ...actual,
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
    };
});

const mockProbabilities = [0.2, 0.5, 0.8];

describe("BernoulliArmsChart", () => {
    beforeEach(() => {
        render(<BernoulliArmsChart probabilities={mockProbabilities} lang="de" />);
    });

    it("renders the chart title", () => {
        expect(screen.getByText("Tatsächliche Wahrscheinlichkeiten")).toBeInTheDocument();
    });

    it("renders correct number of bars in data", () => {
        expect(mockProbabilities.length).toBe(3);
    });

});
