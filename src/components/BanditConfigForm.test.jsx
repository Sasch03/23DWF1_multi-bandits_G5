import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BanditConfig from "./BanditConfigForm.jsx";

describe("BanditConfig Component", () => {
    const setup = (overrides = {}) => {
        const props = {
            type: "bernoulli",
            setType: vi.fn(),
            arms: Array.from({ length: 5 }),
            setArmCount: vi.fn(),
            iterations: 10,
            setIterations: vi.fn(),
            startAuto: vi.fn(),
            resetAll: vi.fn(),
            running: false,
            ...overrides,
        };
        render(<BanditConfig {...props} />);
        return props;
    };

    it("renders all labels and buttons", () => {
        setup();
        expect(screen.getByText("Bandit-Typ")).toBeInTheDocument();
        expect(screen.getByText("Anzahl Arme")).toBeInTheDocument();
        expect(screen.getByText("Anzahl Iterationen")).toBeInTheDocument();
        expect(screen.getByText("Start")).toBeInTheDocument();
        expect(screen.getByText("Zurücksetzen")).toBeInTheDocument();
    });

    it("calls setType when selecting a bandit type", () => {
        const props = setup();

        const selectTrigger = screen.getByRole("combobox");
        fireEvent.click(selectTrigger);

        const gaussianOption = screen.getByText("Gaussian");
        fireEvent.click(gaussianOption);

        expect(props.setType).toHaveBeenCalledWith("gaussian");
    });


    it("calls setArmCount when Counter changes", () => {
        const props = setup();
        const armCounter = screen.getByText("5"); // initial arms.length
        fireEvent.click(armCounter.nextSibling); // simulate '+' click
        expect(props.setArmCount).toHaveBeenCalled();
    });

    it("calls setIterations when Counter changes", () => {
        const props = setup();
        const iterationCounter = screen.getByText("10");
        fireEvent.click(iterationCounter.nextSibling); // simulate '+' click
        expect(props.setIterations).toHaveBeenCalled();
    });

    it("calls startAuto and resetAll buttons", () => {
        const props = setup();
        const startButton = screen.getByText("Start");
        const resetButton = screen.getByText("Zurücksetzen");

        fireEvent.click(startButton);
        expect(props.startAuto).toHaveBeenCalled();

        fireEvent.click(resetButton);
        expect(props.resetAll).toHaveBeenCalled();
    });

    it("disables controls when running=true", () => {
        setup({ running: true });
        const startButton = screen.getByText("Running");
        expect(startButton).toBeDisabled();

        const armCounter = screen.getByText("5");
        const iterationCounter = screen.getByText("10");
        expect(armCounter.nextSibling).toBeDisabled();
        expect(iterationCounter.nextSibling).toBeDisabled();
    });
});
