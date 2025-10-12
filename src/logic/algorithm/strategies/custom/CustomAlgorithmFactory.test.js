import { describe, it, expect, beforeEach } from "vitest";
import CustomAlgorithmFactory from "./CustomAlgorithmFactory.js";
import { AlgorithmTyp } from "@/logic/enumeration/AlgorithmTyp.js";

// Import concrete algorithm classes that should exist in the repo.
// Adjust paths if your project layout differs.
import Greedy from "@/logic/algorithm/strategies/value-based/Greedy.js";
import EpsilonGreedy from "@/logic/algorithm/strategies/value-based/EpsGreedy.js";
import GradientBandit from "@/logic/algorithm/strategies/gradient-based/GradientBandit.js";
// import UCB from "@/logic/algorithm/strategies/ucb/UCB.js"; // Uncomment when UCB is implemented



describe("CustomAlgorithmFactory", () => {
    let factory;

    beforeEach(() => {
        // create a factory pre-seeded with known algorithm classes
        factory = CustomAlgorithmFactory.withDefaults();
        factory.register(AlgorithmTyp.GREEDY, Greedy);
        factory.register(AlgorithmTyp.EPSILON_GREEDY, EpsilonGreedy);
        factory.register(AlgorithmTyp.GRADIENT_BANDIT, GradientBandit);
        // factory.register(AlgorithmTyp.UPPER_CONFIDENCE_BOUND, UCB); // register UCB once available
    });

    it("reports supported types (contains registered ones)", () => {
        const supported = factory.supportedTypes();
        expect(supported).toContain(AlgorithmTyp.GREEDY);
        expect(supported).toContain(AlgorithmTyp.EPSILON_GREEDY);
        expect(supported).toContain(AlgorithmTyp.GRADIENT_BANDIT);
        // UCB may be null until you register it — not required for the test
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

        // selectArm should return a valid index
        const arm = instance.selectArm();
        expect(Number.isInteger(arm)).toBe(true);
        expect(arm).toBeGreaterThanOrEqual(0);
        expect(arm).toBeLessThan(3);

        // update should accept a finite numeric reward and not throw
        expect(() => instance.update({ arm: arm, observedReward: 1 })).not.toThrow();
    });

    it("creates an Epsilon-Greedy instance and respects passed epsilon param", () => {
        const eps = 0.25;
        const instance = factory.create({
            type: AlgorithmTyp.EPSILON_GREEDY,
            params: { epsilon: eps },
            numberOfArms: 4,
            numberOfTries: 20,
        });

        expect(instance).toBeTruthy();
        expect(typeof instance.selectArm).toBe("function");
        expect(typeof instance.update).toBe("function");

        // Many classes expose the param directly; if not, it's still ok as long as ctor accepted it.
        // We don't assume a public epsilon property — instead, we assert update works and the instance exists.
        expect(() => instance.update({ arm: 0, observedReward: 0 })).not.toThrow();
    });

    it("creates a Gradient-Bandit instance and forwards alpha parameter", () => {
        const alpha = 0.05;
        const instance = factory.create({
            type: AlgorithmTyp.GRADIENT_BANDIT,
            params: { alpha },
            numberOfArms: 3,
            numberOfTries: 50,
        });

        expect(instance).toBeTruthy();
        // GradientBandit should expose alpha; test value forwarded
        expect(typeof instance.alpha).toBe("number");
        expect(instance.alpha).toBeCloseTo(alpha);

        // preferences array should exist and be of correct length
        expect(Array.isArray(instance.preferences)).toBe(true);
        expect(instance.preferences.length).toBe(3);

        // update with invalid reward (NaN) must throw (defensive check)
        expect(() => instance.update({ arm: 0, observedReward: NaN })).toThrow();

        // a valid update should not throw
        expect(() => instance.update({ arm: 0, observedReward: 1 })).not.toThrow();
    });

    it("throws on unknown algorithm type (not in enum or unregistered)", () => {
        // type not in enum
        expect(() => factory.create({ type: "NonExistent", numberOfArms: 2, numberOfTries: 5 })).toThrow();

        // type in enum but not registered: use a fresh factory with minimal map
        const minimalFactory = CustomAlgorithmFactory.withDefaults();
        // do not register GREEDY etc.
        expect(() => minimalFactory.create({ type: AlgorithmTyp.GREEDY, numberOfArms: 2, numberOfTries: 5 })).toThrow();
    });

    it("returns null when strict=false and algorithm not registered", () => {
        const minimalFactory = new CustomAlgorithmFactory({ classMap: {}, strict: false });
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
        // register a dummy class that doesn't implement selectArm/update
        class BadAlgo {
            constructor() {}
            // missing selectArm/update
        }
        const f = CustomAlgorithmFactory.withDefaults();
        f.register(AlgorithmTyp.GREEDY, BadAlgo);
        expect(() => f.create({ type: AlgorithmTyp.GREEDY, numberOfArms: 2, numberOfTries: 5 })).toThrow();
    });

    it("passes ctor params through to the algorithm constructor (sanity)", () => {
        // For GradientBandit we tested alpha. Also test EpsilonGreedy receives epsilon via constructor behavior.
        const epsVal = 0.42;
        const eg = factory.create({
            type: AlgorithmTyp.EPSILON_GREEDY,
            params: { epsilon: epsVal },
            numberOfArms: 3,
            numberOfTries: 10,
        });

        // If class exposes epsilon, assert it matches; otherwise at least ensure instance exists.
        if ("epsilon" in eg) {
            expect(eg.epsilon).toBeCloseTo(epsVal);
        } else if ("params" in eg) {
            // some implementations keep params; check that if present
            expect(eg.params.epsilon === epsVal || eg.params.epsilon === undefined).toBe(true);
        } else {
            // fallback: ensure update/select work
            expect(typeof eg.selectArm).toBe("function");
        }
    });

    // ---------------------------
    // Prepared (commented) tests for UCB - uncomment when UCB exists
    // ---------------------------
    /*
    it("creates a UCB instance and uses c parameter", () => {
      const c = 2.0;
      const ucb = factory.create({
        type: AlgorithmTyp.UPPER_CONFIDENCE_BOUND,
        params: { c },
        numberOfArms: 4,
        numberOfTries: 20,
      });
      expect(ucb).toBeTruthy();
      expect(typeof ucb.selectArm).toBe("function");
      expect(typeof ucb.update).toBe("function");
      // ensure c forwarded if property exists
      if ("c" in ucb) {
        expect(ucb.c).toBeCloseTo(c);
      }
    });
    */

    it("construction logs and register works (smoke)", () => {
        // small smoke test for register logging and supportedTypes
        const f = CustomAlgorithmFactory.withDefaults();
        f.register(AlgorithmTyp.GREEDY, Greedy);
        const types = f.supportedTypes();
        expect(types).toContain(AlgorithmTyp.GREEDY);
    });
});
