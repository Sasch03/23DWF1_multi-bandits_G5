import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./header.jsx";

describe("Header Component", () => {
    it("renders the main heading", () => {
        render(<Header />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent("Multi-Armed Bandit Playground");
    });

    it("renders the description paragraph", () => {
        render(<Header />);
        const paragraph = screen.getByText(
            "Simulate campaigns using Bernoulli and Gaussian strategies, analyze results, and gain insights into campaign effectiveness."
        );
        expect(paragraph).toBeInTheDocument();
    });
});
