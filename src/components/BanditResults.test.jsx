import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BanditResults from "./BanditResults";

describe("BanditResults Component", () => {
    const defaultProps = {
        running: false,
        iterations: 10,
        totalPulls: 3,
        totalReward: 5,
        logs: [
            "Timestep: 1, Arm: 1, Reward: 1",
            "Timestep: 2, Arm: 2, Reward: 0",
            "Timestep: 3, Arm: 1, Reward: 1",
        ],
        type: "Bernoulli",
        lang: "en",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders remaining attempts correctly", () => {
        render(<BanditResults {...defaultProps} running={true} />);
        expect(screen.getByText("Remaining Attempts")).toBeInTheDocument();
        expect(screen.getByText(`${defaultProps.iterations - defaultProps.totalPulls}`)).toBeInTheDocument();
    });

    it("renders total reward correctly for Bernoulli", () => {
        render(<BanditResults {...defaultProps} />);
        expect(screen.getByText("Total Reward")).toBeInTheDocument();
        expect(screen.getByText(`${defaultProps.totalReward}`)).toBeInTheDocument();
    });

    it("renders all Bernoulli logs correctly and handles collapsible", async () => {
        const user = userEvent.setup();
        render(<BanditResults {...defaultProps} />);

        // Initially only first log
        expect(screen.getByText("#1")).toBeInTheDocument();
        expect(screen.getByText("Campaign #1")).toBeInTheDocument();
        expect(screen.getByText("Success")).toBeInTheDocument();

        // Expand
        await user.click(screen.getByRole("button", { name: /show more/i }));
        expect(screen.getByText("#2")).toBeInTheDocument();
        expect(screen.getByText("Campaign #2")).toBeInTheDocument();
        expect(screen.getByText("Fail")).toBeInTheDocument();

        // Collapse
        await user.click(screen.getByRole("button", { name: /show less/i }));
        expect(screen.getByText("#1")).toBeInTheDocument();
    });

    it("renders Gaussian rewards correctly with formatting and colors", async () => {
        const logs = [
            "Timestep: 1, Arm: 1, Reward: 5.123",
            "Timestep: 2, Arm: 2, Reward: -3.45",
            "Timestep: 3, Arm: 3, Reward: 0"
        ];
        const totalReward = 5.123 + (-3.45);
        const user = userEvent.setup();

        render(
            <BanditResults
                {...defaultProps}
                logs={logs}
                totalReward={totalReward}
                type="Gaussian"
            />
        );

        // Expand logs
        await user.click(screen.getByRole("button", { name: /show more/i }));

        const rewardCells = screen.getAllByRole("cell").filter(cell =>
            cell.textContent.includes("€")
        );

        expect(rewardCells[0]).toHaveTextContent("5.12 €");
        expect(rewardCells[1]).toHaveTextContent("-3.45 €");
        expect(rewardCells[2]).toHaveTextContent("0.00 €");

        expect(rewardCells[0].className).toContain("text-emerald-500");
        expect(rewardCells[1].className).toContain("text-red-500");
        expect(rewardCells[2].className).toContain("text-muted-foreground");
    });

    it("handles empty logs gracefully", () => {
        render(<BanditResults {...defaultProps} logs={[]} totalPulls={0} />);
        expect(screen.getByText("Remaining Attempts")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("Recent Activity")).toBeInTheDocument();
        expect(screen.getByText("No phishing campaign activity yet")).toBeInTheDocument();
    });

});
