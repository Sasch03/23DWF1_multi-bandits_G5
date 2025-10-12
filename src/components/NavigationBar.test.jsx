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
            screen.getByText(/Der Bernoulli-Bandit arbeitet mit diskreten Auszahlungen/)
        ).toBeInTheDocument();
    });

    it("renders the correct explanatory text for Bernoulli in English", () => {
        render(<NavigationBar algo="Bernoulli" setAlgo={setAlgoMock} running={false} lang="en" />);

        expect(
            screen.getByText(/The Bernoulli bandit works with discrete payouts/)
        ).toBeInTheDocument();
    });

    it("renders the correct explanatory text for Gaussian in German", () => {
        render(<NavigationBar algo="Gaussian" setAlgo={setAlgoMock} running={false} lang="de" />);

        expect(
            screen.getByText(/Der Gaußsche Bandit verwendet kontinuierliche Auszahlungen/)
        ).toBeInTheDocument();
    });

    it("renders the correct explanatory text for Gaussian in English", () => {
        render(<NavigationBar algo="Gaussian" setAlgo={setAlgoMock} running={false} lang="en" />);

        expect(
            screen.getByText(/The Gaussian bandit uses continuous payouts/)
        ).toBeInTheDocument();
    });
});