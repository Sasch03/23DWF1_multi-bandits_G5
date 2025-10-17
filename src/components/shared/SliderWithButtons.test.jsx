import { render, screen, fireEvent } from "@testing-library/react";
import SliderWithButtons from "./SliderWithButtons";
import { vi, describe, it, expect } from "vitest";

describe("SliderWithButtons", () => {
    const setup = (props = {}) => {
        const defaultProps = {
            value: 5,
            onChange: vi.fn(),
            min: 0,
            max: 10,
            step: 1,
            disabled: false,
        };
        return render(<SliderWithButtons {...defaultProps} {...props} />);
    };

    it("renders decrease and increase buttons", () => {
        setup();
        expect(screen.getByLabelText("decrease")).toBeInTheDocument();
        expect(screen.getByLabelText("increase")).toBeInTheDocument();
    });

    it("calls onChange with value - 1 when decrease button is clicked", () => {
        const onChange = vi.fn();
        setup({ value: 5, onChange });
        const decreaseBtn = screen.getByLabelText("decrease");
        fireEvent.click(decreaseBtn);
        expect(onChange).toHaveBeenCalledWith(4);
    });

    it("calls onChange with value + 1 when increase button is clicked", () => {
        const onChange = vi.fn();
        setup({ value: 5, onChange });
        const increaseBtn = screen.getByLabelText("increase");
        fireEvent.click(increaseBtn);
        expect(onChange).toHaveBeenCalledWith(6);
    });

    it("disables decrease button at minimum value", () => {
        setup({ value: 0, min: 0 });
        expect(screen.getByLabelText("decrease")).toBeDisabled();
    });

    it("disables increase button at maximum value", () => {
        setup({ value: 10, max: 10 });
        expect(screen.getByLabelText("increase")).toBeDisabled();
    });

    it("disables both buttons and slider when disabled is true", () => {
        setup({ disabled: true });
        expect(screen.getByLabelText("decrease")).toBeDisabled();
        expect(screen.getByLabelText("increase")).toBeDisabled();
        const slider = screen.getByRole("slider");
        expect(slider).toHaveAttribute("data-disabled");
        });
});
