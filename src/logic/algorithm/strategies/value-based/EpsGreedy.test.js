// src/logic/algorithm/strategies/value-based/EpsGreedy.test.js
import { describe, it, expect, vi, afterEach } from "vitest";
import EpsGreedy from "@/logic/algorithm/strategies/value-based/EpsGreedy.js";
import epsilonProvider from "@/logic/algorithm/strategies/value-based/EpsilonProvider.js";
import { EPSILON_DEFAULT } from "@/constants.js";

afterEach(() => {
    vi.restoreAllMocks();
    epsilonProvider.setEpsilon(EPSILON_DEFAULT);
});

describe("EpsGreedy uses global EpsilonProvider", () => {
    it("explores when epsilon=1", () => {
        epsilonProvider.setEpsilon(1);
        const seq = [0.0, 0.7]; let i = 0;
        vi.spyOn(Math, "random").mockImplementation(() => seq[(i++) % seq.length]);

        const algo = new EpsGreedy({ numberOfArms: 3, numberOfTries: 5 });
        expect(algo.selectArm()).toBe(2); // floor(0.7*3)
    });

    it("exploits when epsilon=0 (greedy path)", () => {
        epsilonProvider.setEpsilon(0);
        const algo = new EpsGreedy({
            numberOfArms: 3, numberOfTries: 5, expectedRewardsBegin: [0, 0, 1],
        });
        const picks = Array.from({ length: 3 }, () => algo.selectArm());
        expect(picks.every(a => a === 2)).toBe(true);
    });
});
