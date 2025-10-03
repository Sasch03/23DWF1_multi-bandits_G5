// src/logic/algorithm/strategies/manual/Manual.test.js
import { describe, it, expect } from "vitest";
import Manual from "@/logic/algorithm/strategies/rule-based/Manual.js";

describe("ManualAlgorithm", () => {
    it("throws if selectArm is called before setNextArm", () => {
        const manual = new Manual({ numberOfArms: 3, numberOfTries: 5 });
        expect(() => manual.selectArm()).toThrow("next arm not set");
    });

    it("returns the arm set via setNextArm", () => {
        const manual = new Manual({ numberOfArms: 3, numberOfTries: 5 });
        manual.setNextArm(1);
        expect(manual.selectArm()).toBe(1);
    });

    it("consumes the arm after one selectArm", () => {
        const manual = new Manual({ numberOfArms: 3, numberOfTries: 5 });
        manual.setNextArm(2);
        manual.selectArm();
        expect(() => manual.selectArm()).toThrow("next arm not set");
    });

    it("update records reward and increments step", () => {
        const manual = new Manual({ numberOfArms: 2, numberOfTries: 2 });
        manual.setNextArm(0);
        const a = manual.selectArm();
        manual.update({ arm: a, observedReward: 1 });
        expect(manual.step).toBe(1);
        expect(manual.numberOfPulls[0]).toBe(1);
        expect(manual.observedRewards[0]).toBe(1);
    });

    it("reset clears state", () => {
        const manual = new Manual({ numberOfArms: 2, numberOfTries: 2 });
        manual.setNextArm(0);
        manual.update({ arm: manual.selectArm(), observedReward: 1 });
        manual.reset();
        expect(manual.step).toBe(0);
        expect(manual.numberOfPulls.every(x => x === 0)).toBe(true);
        expect(manual.selectedArms.every(x => x === null)).toBe(true);
    });
});
