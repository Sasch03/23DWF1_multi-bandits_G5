import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { describe, it, expect } from "vitest";

describe("Header Component", () => {
    it("renders title correctly (DE)", () => {
        render(<Header lang="de" />);
        expect(screen.getByText("Multi-Armed Mafia")).toBeInTheDocument();
    });

    it("renders title correctly (EN)", () => {
        render(<Header lang="en" />);
        expect(screen.getByText("Multi-Armed Mafia")).toBeInTheDocument();
    });

    it("renders intro text in German", () => {
        render(<Header lang="de" />);
        expect(
            screen.getByText(/Diese Anwendung behandelt das/i)
        ).toBeInTheDocument();
    });

    it("renders intro text in English", () => {
        render(<Header lang="en" />);
        expect(
            screen.getByText(/This application addresses the/i)
        ).toBeInTheDocument();
    });

    it("renders all algorithm badges", () => {
        render(<Header lang="de" />);
        const algos = ["Guido", "Emilio", "Giovanni", "Umberto"];
        algos.forEach((name) => {
            expect(screen.getByText(new RegExp(name, "i"))).toBeInTheDocument();
        });
    });

    it("contains external links for algorithms", () => {
        render(<Header lang="en" />);
        const links = screen.getAllByRole("link");
        expect(links.length).toBeGreaterThan(0);
        links.forEach((link) => {
            expect(link).toHaveAttribute("href");
            expect(link.getAttribute("target")).toBe("_blank");
        });
    });
});
