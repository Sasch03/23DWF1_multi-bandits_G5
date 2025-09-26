import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter.jsx";
import "@testing-library/jest-dom";


describe("Counter Component", () => {
    it("displays the initial value", () => {
        render(<Counter value={5} onChange={() => {}} />);
        expect(screen.getByText("5")).toBeDefined();
    });

    it("calls onChange when incrementing", () => {
        const onChange = vi.fn();
        render(<Counter value={5} onChange={onChange} />);

        fireEvent.click(screen.getByText("+"));
        expect(onChange).toHaveBeenCalledWith(6);
    });

    it("calls onChange when decrementing", () => {
        const onChange = vi.fn();
        render(<Counter value={5} onChange={onChange} />);

        fireEvent.click(screen.getByText("-"));
        expect(onChange).toHaveBeenCalledWith(4);
    });

    it("respects the min value", () => {
        const onChange = vi.fn();
        render(<Counter value={0} min={0} onChange={onChange} />);

        fireEvent.click(screen.getByText("-"));
        expect(onChange).toHaveBeenCalledWith(0);
    });

    it("respects the max value", () => {
        const onChange = vi.fn();
        render(<Counter value={10} max={10} onChange={onChange} />);

        fireEvent.click(screen.getByText("+"));
        expect(onChange).toHaveBeenCalledWith(10);
    });

    it("disables buttons when disabled=true", () => {
        const onChange = vi.fn();
        render(<Counter value={5} onChange={onChange} disabled />);

        const plusButton = screen.getByText("+");
        const minusButton = screen.getByText("-");

        expect(plusButton).toBeDisabled();
        expect(minusButton).toBeDisabled();

        fireEvent.click(plusButton);
        fireEvent.click(minusButton);
        expect(onChange).not.toHaveBeenCalled();
    });
});
