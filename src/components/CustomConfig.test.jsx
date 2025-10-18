import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import CustomConfig from "@/components/CustomConfig.jsx";
import { AlgorithmTyp } from "@/logic/enumeration/AlgorithmTyp.js";

describe("CustomConfig Component", () => {
    const createCustomAlgorithmMock = vi.fn();
    const setAlgorithmAddedMock = vi.fn();

    const defaultProps = {
        running: false,
        createCustomAlgorithm: createCustomAlgorithmMock,
        algorithmAdded: false,
        setAlgorithmAdded: setAlgorithmAddedMock,
        lang: "en",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        render(<CustomConfig {...defaultProps} />);
        expect(screen.getByText("Advanced Settings")).toBeDefined();
    });

    it("toggles popover when show/hide button is clicked", async () => {
        render(<CustomConfig {...defaultProps} />);
        const toggleButton = screen.getByText("Show");

        fireEvent.click(toggleButton);
        expect(screen.getByText("Algorithm")).toBeDefined(); // popover content visible

        fireEvent.click(screen.getByText("Hide"));
        expect(screen.queryByText("Algorithm")).toBeNull(); // popover content hidden
    });

    it("updates algorithm selection", () => {
        render(<CustomConfig {...defaultProps} />);
        const selectTrigger = screen.getByRole("button");
        fireEvent.change(selectTrigger, { target: { value: AlgorithmTyp.GRADIENT_BANDIT } });
        expect(selectTrigger.value).toBe(AlgorithmTyp.GRADIENT_BANDIT);
    });

    it("calls createCustomAlgorithm and sets algorithmAdded when add button clicked", () => {
        render(<CustomConfig {...defaultProps} />);
        fireEvent.click(screen.getByText("Show"));
        fireEvent.click(screen.getByText("Add Custom"));

        expect(createCustomAlgorithmMock).toHaveBeenCalledWith(
            AlgorithmTyp.GRADIENT_BANDIT,
            { alpha: 0.1 }
        );
        expect(setAlgorithmAddedMock).toHaveBeenCalledWith(true);
    });

    it("disables add button when algorithmAdded is true", () => {
        render(<CustomConfig {...defaultProps} algorithmAdded={true} />);

        const toggleButton = screen.getByText("Show");
        fireEvent.click(toggleButton);

        const addButton = screen.getByRole("button", { name: /Add Custom Algorithm/i });
        expect(addButton).toBeDisabled();
    });


});
