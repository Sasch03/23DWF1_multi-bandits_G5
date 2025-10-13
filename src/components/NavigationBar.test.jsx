import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/components/ui/navigation-menu", () => {
    return {
        NavigationMenu: ({ children, ...props }) => <div {...props}>{children}</div>,
        NavigationMenuList: ({ children, ...props }) => <div {...props}>{children}</div>,
        NavigationMenuItem: ({ children, ...props }) => <div {...props}>{children}</div>,
        NavigationMenuLink: ({ children, ...props }) => <a {...props}>{children}</a>,
    };
});

import NavigationBar from "./NavigationBar";

describe("NavigationBar component", () => {
    const setAlgoMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders German labels when lang='de'", () => {
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgoMock} running={false} lang="de" />);

        expect(screen.getByText("Bernoulli")).toBeInTheDocument();
        expect(screen.getByText("Gaußsche")).toBeInTheDocument();
    });

    it("renders English labels when lang!='de'", () => {
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgoMock} running={false} lang="en" />);

        expect(screen.getByText("Bernoulli")).toBeInTheDocument();
        expect(screen.getByText("Gaussian")).toBeInTheDocument();
    });

    it("calls setAlgo with correct value when clicked and running=false", () => {
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgoMock} running={false} lang="en" />);

        const gaussianLink = screen.getByText("Gaussian").closest("a");
        fireEvent.click(gaussianLink);

        expect(setAlgoMock).toHaveBeenCalledTimes(1);
        expect(setAlgoMock).toHaveBeenCalledWith("Gaussian");
    });

    it("does not call setAlgo when running=true", () => {
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgoMock} running={true} lang="en" />);

        const gaussianLink = screen.getByText("Gaussian").closest("a");
        fireEvent.click(gaussianLink);

        expect(setAlgoMock).not.toHaveBeenCalled();
    });

    it("renders the correct explanatory text for Bernoulli in German", () => {
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgoMock} running={false} lang="de" />);

        expect(
            screen.getByText("Die Bernoulli-Verteilung beschreibt, ob eine einzelne Kampagne erfolgreich Geld bringt (1) oder fehlschlägt (0) – also ein reines Ja/Nein-Ergebnis.")
        ).toBeInTheDocument();
    });

    it("renders the correct explanatory text for Bernoulli in English", () => {
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgoMock} running={false} lang="en" />);

        expect(
            screen.getByText("The Bernoulli distribution describes whether a single campaign successfully generates money (1) or fails (0) – in other words, a pure yes/no result.")
        ).toBeInTheDocument();
    });

    it("renders the correct explanatory text for Gaussian in German", () => {
        render(<NavigationBar algo="Gaussian" setAlgo={setAlgoMock} running={false} lang="de" />);

        expect(
            screen.getByText("Die gaußsche Verteilung beschreibt, wie stark die Resultate einzelner Kampagnen um einen typischen Durchschnitt schwanken – sie können sowohl positive als auch negative Werte aufweisen.")
        ).toBeInTheDocument();
    });

    it("renders the correct explanatory text for Gaussian in English", () => {
        render(<NavigationBar algo="Gaussian" setAlgo={setAlgoMock} running={false} lang="en" />);

        expect(
            screen.getByText("The Gaussian distribution describes how much the results of individual campaigns fluctuate around a typical average – they can have both positive and negative values.")
        ).toBeInTheDocument();
    });
});