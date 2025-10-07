import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import BanditResults from "./BanditResults";

describe("BanditResults Component", () => {
    it("renders total pulls correctly", () => {
        render(<BanditResults totalPulls={7} logs={[]} />);
        expect(screen.getByText("Total Attempts")).toBeInTheDocument();
        expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("renders all logs correctly", async () => {
        const logs = [
            "Timestep: 1, Arm: 1, Reward: 1",
            "Timestep: 2, Arm: 2, Reward: 0",
            "Timestep: 3, Arm: 1, Reward: 1",
        ];

        render(<BanditResults totalPulls={3} logs={logs} type="Bernoulli" />);
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /show all/i }));

        logs.forEach(log => {
            const match = log.match(/Timestep: (\d+), Arm: (\d+), Reward: (\d+)/);
            if (match) {
                const [_, ts, arm, reward] = match;

                const attemptCell = screen.getByText(new RegExp(`#${ts}`));
                expect(attemptCell).toBeInTheDocument();

                const campaignCells = screen.getAllByText(new RegExp(`Campaign\\s*${arm}`));
                expect(campaignCells.length).toBeGreaterThan(0);

                const rewardText = reward === "1" ? "Success" : "Fail";
                const rewardCells = screen.getAllByText(rewardText);
                expect(rewardCells.length).toBeGreaterThan(0);
            }
        });
    });

    it("handles empty logs", () => {
        render(<BanditResults totalPulls={0} logs={[]} />);
        expect(screen.getByText("Total Attempts")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("Recent Activity")).toBeInTheDocument();
        expect(screen.getByText("No phishing campaign activity yet")).toBeInTheDocument();
    });

    it("renders Gaussian rewards correctly with proper formatting and color", async () => {
        const logs = [
            "Timestep: 1, Arm: 1, Reward: 5.123",
            "Timestep: 2, Arm: 2, Reward: -3.45",
            "Timestep: 3, Arm: 3, Reward: 0"
        ];

        const totalReward = 5.123 + (-3.45);

        render(
            <BanditResults
                totalPulls={3}
                logs={logs}
                type="Gaussian"
                totalReward={totalReward}
            />
        );

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /show all/i }));

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

});
