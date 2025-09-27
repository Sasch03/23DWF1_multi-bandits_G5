import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BanditResults from "./BanditResults";

describe("BanditResults Component", () => {
    it("renders total pulls correctly", () => {
        render(<BanditResults totalPulls={7} logs={[]} />);
        expect(screen.getByText("Total Pulls")).toBeInTheDocument();
        expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("renders all logs correctly", () => {
        const logs = [
            "Timestep: 1, Arm: 1, Reward: 1",
            "Timestep: 2, Arm: 2, Reward: 0",
            "Timestep: 3, Arm: 1, Reward: 1",
        ];
        render(<BanditResults totalPulls={3} logs={logs} />);

        expect(screen.getByText("Pull Logs")).toBeInTheDocument();

        logs.forEach(log => {
            expect(screen.getByText(log)).toBeInTheDocument();
        });
    });

    it("handles empty logs", () => {
        render(<BanditResults totalPulls={0} logs={[]} />);
        expect(screen.getByText("Total Pulls")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("Pull Logs")).toBeInTheDocument();
    });
});
