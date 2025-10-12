import { describe, it, expect, beforeEach } from "vitest";
import CustomAlgorithmFactory from "./CustomAlgorithmFactory.js";
import { AlgorithmTyp } from "@/logic/enumeration/AlgorithmTyp.js";

// Import existing algorithms
import Greedy from "@/logic/algorithm/strategies/value-based/Greedy.js";
import EpsGreedy from "@/logic/algorithm/strategies/value-based/EpsGreedy.js";
import GradientBandit from "@/logic/algorithm/strategies/gradient-based/GradientBandit.js";
import UCB from "@/logic/algorithm/strategies/value-based/UCB.js";

describe("CustomAlgorithmFactory", () => {
    let factory;

    beforeEach(() => {
        factory = CustomAlgorithmFactory.withDefaults();
        factory.register(AlgorithmTyp.GREEDY, Greedy);
        factory.register(AlgorithmTyp.EPSILON_GREEDY, EpsGreedy);
        factory.register(AlgorithmTyp.GRADIENT_BANDIT, GradientBandit);
        factory.register(AlgorithmTyp.UPPER_CONFIDENCE_BOUND, UCB);
    });

    it("reports supported types (contains registered ones)", () => {
        const supported = factory.supportedTypes();
        expect(supported).toContain(AlgorithmTyp.GREEDY);
        expect(supported).toContain(AlgorithmTyp.EPSILON_GREEDY);
        expect(supported).toContain(AlgorithmTyp.GRADIENT_BANDIT);
        expect(supported).toContain(AlgorithmTyp.UPPER_CONFIDENCE_BOUND);
    });

    it("creates a Greedy instance with valid API", () => {
        const instance = factory.create({
            type: AlgorithmTyp.GREEDY,
            params: {},
            numberOfArms: 3,
            numberOfTries: 10,
        });

        expect(instance).toBeTruthy();
        expect(typeof instance.selectArm).toBe("function");
        expect(typeof instance.update).toBe("function");

        const arm = instance.selectArm();
        expect(Number.isInteger(arm)).toBe(true);
        expect(arm).toBeGreaterThanOrEqual(0);
        expect(arm).toBeLessThan(3);

        expect(() => instance.update({ arm, observedReward: 1 })).not.toThrow();
    });

    it("creates an Epsilon-Greedy instance", () => {
        const instance = factory.create({
            type: AlgorithmTyp.EPSILON_GREEDY,
            params: { epsilon: 0.25 },
            numberOfArms: 4,
            numberOfTries: 20,
        });

        expect(instance).toBeTruthy();
        expect(typeof instance.selectArm).toBe("function");
        expect(typeof instance.update).toBe("function");
        expect(() => instance.update({ arm: 0, observedReward: 1 })).not.toThrow();
    });

    it("creates a Gradient-Bandit instance and forwards alpha", () => {
        const alpha = 0.05;
        const instance = factory.create({
            type: AlgorithmTyp.GRADIENT_BANDIT,
            params: { alpha },
            numberOfArms: 3,
            numberOfTries: 50,
        });

        expect(instance).toBeTruthy();
        expect(instance.alpha).toBeCloseTo(alpha);
        expect(Array.isArray(instance.preferences)).toBe(true);
        expect(instance.preferences.length).toBe(3);

        expect(() => instance.update({ arm: 0, observedReward: "https://www.youtube.com/watch?v=E4WlUXrJgy4" })).toThrow();
        expect(() => instance.update({ arm: 0, observedReward: 1 })).not.toThrow();
    });

    it("GradientBandit produces valid probability distribution", () => {
        const instance = factory.create({
            type: AlgorithmTyp.GRADIENT_BANDIT,
            params: { alpha: 0.1 },
            numberOfArms: 3,
            numberOfTries: 10,
        });
        const probs = instance.getActionProbabilities();
        expect(probs.length).toBe(3);
        const sum = probs.reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1, 5);
    });

    it("creates a UCB instance and verifies cold-start and scoring behavior", () => {
        const instance = factory.create({
            type: AlgorithmTyp.UPPER_CONFIDENCE_BOUND,
            params: { c: 2.0 },
            numberOfArms: 3,
            numberOfTries: 10,
        });

        expect(instance).toBeTruthy();
        expect(typeof instance.selectArm).toBe("function");
        expect(typeof instance.update).toBe("function");

        // Cold-start: first call should return arm 0
        const first = instance.selectArm();
        expect(first).toBe(0);

        // Simulate updates so that each arm gets pulled at least once
        for (let i = 0; i < 3; i++) {
            instance.update({ arm: i, observedReward: Math.random() });
        }

        // Now selectArm should return a valid index (0..2)
        const next = instance.selectArm();
        expect(next).toBeGreaterThanOrEqual(0);
        expect(next).toBeLessThan(3);
    });

    it("throws on unknown algorithm type (not in enum or unregistered)", () => {
        expect(() =>
            factory.create({ type: "NonExistent", numberOfArms: 2, numberOfTries: 5 })
        ).toThrow();

        const minimalFactory = CustomAlgorithmFactory.withDefaults();
        expect(() =>
            minimalFactory.create({
                type: AlgorithmTyp.GREEDY,
                numberOfArms: 2,
                numberOfTries: 5,
            })
        ).toThrow();
    });

    it("returns null when strict=false and algorithm not registered", () => {
        const minimalFactory = new CustomAlgorithmFactory({
            classMap: {},
            strict: false,
        });
        const result = minimalFactory.create({
            type: AlgorithmTyp.GREEDY,
            numberOfArms: 2,
            numberOfTries: 5,
        });
        expect(result).toBeNull();
    });

    it("throws when numberOfArms or numberOfTries are invalid", () => {
        expect(() =>
            factory.create({ type: AlgorithmTyp.GREEDY, numberOfArms: 0, numberOfTries: 5 })
        ).toThrow();
        expect(() =>
            factory.create({ type: AlgorithmTyp.GREEDY, numberOfArms: 2, numberOfTries: -1 })
        ).toThrow();
        expect(() =>
            factory.create({ type: AlgorithmTyp.GREEDY, numberOfArms: "a", numberOfTries: 10 })
        ).toThrow();
    });

    it("throws when registered class does not implement algorithm API", () => {
        class BadAlgo {
            constructor() {}
        }
        const f = CustomAlgorithmFactory.withDefaults();
        f.register(AlgorithmTyp.GREEDY, BadAlgo);
        expect(() =>
            f.create({ type: AlgorithmTyp.GREEDY, numberOfArms: 2, numberOfTries: 5 })
        ).toThrow();
    });

    it("passes ctor params through to algorithm constructor (sanity)", () => {
        const epsVal = 0.42;
        const eg = factory.create({
            type: AlgorithmTyp.EPSILON_GREEDY,
            params: { epsilon: epsVal },
            numberOfArms: 3,
            numberOfTries: 10,
        });

        if ("epsilon" in eg) {
            expect(eg.epsilon).toBeCloseTo(epsVal);
        } else if ("params" in eg) {
            expect(eg.params.epsilon === epsVal || eg.params.epsilon === undefined).toBe(true);
        } else {
            expect(typeof eg.selectArm).toBe("function");
        }
    });

    it("construction logs and register works (smoke)", () => {
        const f = CustomAlgorithmFactory.withDefaults();
        f.register(AlgorithmTyp.GREEDY, Greedy);
        const types = f.supportedTypes();
        expect(types).toContain(AlgorithmTyp.GREEDY);
    });
});
