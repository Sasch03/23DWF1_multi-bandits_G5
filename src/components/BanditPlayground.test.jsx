import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BanditPlayground from "./BanditPlayground";

describe("BanditPlayground Component", () => {
    const arms = [
        { id: 0, pulls: 0 },
        { id: 1, pulls: 3 },
        { id: 2, pulls: 1 },
    ];

    it("renders all arms with correct pulls", () => {
        render(<BanditPlayground arms={arms} onPull={() => {}} disabled={false} />);

        arms.forEach(a => {
            expect(screen.getByText(`Campaign #${a.id + 1}`)).toBeInTheDocument();
            expect(screen.getByText(`Attempts: ${a.pulls}`)).toBeInTheDocument();
        });
    });

    it("calls onPull with correct id when button clicked", () => {
        const onPull = vi.fn();
        render(<BanditPlayground arms={arms} onPull={onPull} disabled={false} />);

        const firstArmButton = screen.getByText("Campaign #1").closest("button");
        fireEvent.click(firstArmButton);

        expect(onPull).toHaveBeenCalledWith(0);
    });

    it("disables all buttons when disabled=true", () => {
        render(<BanditPlayground arms={arms} onPull={() => {}} disabled={true} />);

        arms.forEach(a => {
            const button = screen.getByText(`Campaign #${a.id + 1}`).closest("button");
            expect(button).toBeDisabled();
        });
    });
});
