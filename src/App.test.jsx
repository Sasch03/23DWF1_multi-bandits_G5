import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App.jsx";

describe("App Component Integration Test", () => {
    it("renders all main components", () => {
        render(<App />);
        expect(screen.getByText("Multi-Armed Bandit Playground")).toBeInTheDocument();
        expect(screen.getByText("Configuration")).toBeInTheDocument();
        expect(screen.getByText("Total Attempts")).toBeInTheDocument();

        // Check that at least one arm button is rendered
        const armButton = screen.getByText(/Campaign #1/i).closest("button");
        expect(armButton).toBeInTheDocument();
    });

    it("can simulate a pull and reset", () => {
        render(<App />);

        const startButton = screen.getByText("Start");
        fireEvent.click(startButton);

        const firstArmButton = screen.getByText(/Campaign #1/i).closest("button");
        fireEvent.click(firstArmButton);

        const totalAttemptsElements = screen.getAllByText("1");
        expect(totalAttemptsElements[0]).toBeInTheDocument();

        const resetButton = screen.getByText("Reset");
        fireEvent.click(resetButton);

        // totalPulls should be set back to 0
        const totalResetElements = screen.getAllByText("0");
        expect(totalResetElements[0]).toBeInTheDocument();
    });
});
