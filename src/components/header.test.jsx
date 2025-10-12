import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import Header from "./header.jsx";

describe("Header component", () => {

    it("renders German text when lang='de'", () => {
        render(<Header lang="de" />);

        expect(screen.getByRole("heading", { level: 1 }))
            .toHaveTextContent("Ein Bandit mit vielen Armen");

        expect(screen.getByText(/Stell dir vor, du bist ein Mafioso/i)).toBeInTheDocument();

        expect(screen.getByText(/Wähle aus verschiedenen Gehilfen.*möglichst großen Profit/i)).toBeInTheDocument();

        expect(screen.getByText(/Doch Obacht.*Zeit und Ressourcen/i)).toBeInTheDocument();
    });

    it("renders English text when lang is not 'de'", () => {
        render(<Header lang="en" />);

        expect(screen.getByRole("heading", { level: 1 }))
            .toHaveTextContent("A Bandit With Many Arms");

        expect(screen.getByText(/Imagine you are a mobster/i)).toBeInTheDocument();

        expect(screen.getByText(/Choose from various assistants.*generate the highest possible profit/i)).toBeInTheDocument();

        expect(screen.getByText(/But beware.*time and resources/i)).toBeInTheDocument();
    });

});