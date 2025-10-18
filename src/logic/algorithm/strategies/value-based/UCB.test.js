import { describe, test, expect, vi } from "vitest";
import UCB from "@/logic/algorithm/strategies/value-based/UCB.js";

const make = (k = 3, T = 100, c = 2, q0 = null) => {
    const provider = { getC: vi.fn(() => c) };
    const algo = new UCB({ numberOfArms: k, numberOfTries: T, expectedRewardsBegin: q0 }, provider);
    return { algo, provider, T };
};


describe("UCB", () => {
    test("cold-start: pulls each untried arm once (in order)", () => {
        const { algo } = make(4);
        const seq = [];
        for (let i = 0; i < 4; i++) {
            const arm = algo.selectArm();
            seq.push(arm);
            algo.update({ arm, observedReward: 0 });
        }
        expect(seq).toEqual([0, 1, 2, 3]);
    });

    test("uses provider.getC(step, total)", () => {
        const { algo, provider } = make(3, 50, 1.5);
        for (let i = 0; i < 3; i++) algo.update({ arm: algo.selectArm(), observedReward: 0 });
        provider.getC.mockClear();
        algo.selectArm();
        expect(provider.getC).toHaveBeenCalledWith(algo.getStep(), 50);
        expect(provider.getC).toHaveBeenCalledTimes(1);
    });

    test("with equal Q, prefers fewer pulls (bigger bonus)", () => {
        const { algo } = make(3, 100, 2);
        for (let i = 0; i < 3; i++) algo.update({ arm: i, observedReward: 0.5 });
        algo.setExpectedRewards([0.5, 0.5, 0.5]);
        algo.numberOfPulls = [10, 1, 10];
        algo.step = 21;
        expect(algo.selectArm()).toBe(1);
    });

    test("with c=0 reduces to greedy on Q", () => {
        const { algo } = make(3, 100, 0);
        for (let i = 0; i < 3; i++) algo.update({ arm: i, observedReward: 0 });
        algo.setExpectedRewards([1, 3, 2]);
        algo.numberOfPulls = [5, 5, 5];
        algo.step = 16;
        expect(algo.selectArm()).toBe(1);
    });

    test("optimistic init biases early choice", () => {
        const { algo } = make(3, 100, 1, [10, 0, 0]);
        for (let i = 0; i < 3; i++) algo.update({ arm: i, observedReward: 0 });
        algo.numberOfPulls = [1, 1, 1];
        algo.step = 3;
        expect(algo.selectArm()).toBe(0);
    });

    test("incremental average in update", () => {
        const { algo } = make(2, 10, 2);
        const a = 0;
        algo.update({ arm: a, observedReward: 10 });
        algo.update({ arm: a, observedReward: 0 });
        expect(algo.getExpectedRewards()[0]).toBeCloseTo(5, 6);
        expect(algo.getNumberOfPulls()[0]).toBe(2);
        expect(algo.getStep()).toBe(2);
    });

    test("reset clears history and Q", () => {
        const { algo } = make(2, 10, 2);
        algo.update({ arm: 0, observedReward: 1 });
        algo.update({ arm: 1, observedReward: 2 });
        algo.reset();
        expect(algo.getStep()).toBe(0);
        expect(algo.getSelectedArms()).toEqual(Array(10).fill(null));
        expect(algo.getObservedRewards()).toEqual(Array(10).fill(null));
        expect(algo.getNumberOfPulls()).toEqual([0, 0]);
        expect(algo.getExpectedRewards()).toEqual([0, 0]);
    });
});
