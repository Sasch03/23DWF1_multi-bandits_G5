import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App.jsx";

describe("App Component Integration Test", () => {
    it("renders all main components", () => {
        render(<App />);
        expect(screen.getByText("Multi-Armed Bandit Playground")).toBeInTheDocument();
        expect(screen.getByText("Konfiguration")).toBeInTheDocument();
        expect(screen.getByText("Total Pulls")).toBeInTheDocument();

        // Check that at least one arm button is rendered
        const armButton = screen.getByText(/Arm #1/i).closest("button");
        expect(armButton).toBeInTheDocument();
    });

    it("can simulate a pull and reset", () => {
        render(<App />);

        const startButton = screen.getByText("Start");
        fireEvent.click(startButton);

        const firstArmButton = screen.getByText(/Arm #1/i).closest("button");
        fireEvent.click(firstArmButton);

        // totalPulls should update to 1
        expect(screen.getByText("1")).toBeInTheDocument();

        const resetButton = screen.getByText("Zurücksetzen");
        fireEvent.click(resetButton);

        // totalPulls should reset to 0
        expect(screen.getByText("0")).toBeInTheDocument();
    });
});
