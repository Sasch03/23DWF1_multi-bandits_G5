import { describe, it, expect, beforeEach } from 'vitest';
import GradientBandit from '@/logic/algorithm/strategies/gradient-based/GradientBandit.js';

describe('GradientBandit', () => {
    let gb;

    beforeEach(() => {
        // create with 3 arms for simple arithmetic
        gb = new GradientBandit({ numberOfArms: 3, numberOfTries: 100, alpha: 0.1 });
    });

    it('initializes with zero preferences and zero baseline', () => {
        expect(Array.isArray(gb.preferences)).toBe(true);
        expect(gb.preferences.length).toBe(3);
        expect(gb.preferences.every(v => v === 0)).toBe(true);
        expect(typeof gb.averageReward).toBe('number');
        expect(gb.averageReward).toBe(0);
    });

    it('softmax probabilities sum to 1 and are non-negative', () => {
        // all zeros -> uniform distribution
        const probs = gb.getActionProbabilities();
        expect(probs.length).toBe(3);
        const sum = probs.reduce((s, v) => s + v, 0);
        expect(sum).toBeCloseTo(1, 8);
        probs.forEach(p => expect(p).toBeGreaterThanOrEqual(0));
    });

    it('selectArm returns the arm with (approximately) highest preference when extreme', () => {
        // make preference[0] overwhelmingly large so probability ~1
        gb.preferences = [1000, -1000, -1000];
        const chosen = gb.selectArm();
        expect(chosen).toBe(0);
    });

    it('update adjusts preferences according to the gradient update (from zero init)', () => {
        // initial prefs are zero -> softmax probs uniform = 1/3
        const k = 3;
        const r = 1;
        const alpha = 0.1;
        gb.alpha = alpha;

        // call update for arm = 1 with observedReward = 1
        gb.update({ arm: 1, observedReward: r });

        // expected change from formula:
        // chosen arm a: H_a += alpha * (r - baseline) * (1 - pi_a)
        // other arms b: H_b -= alpha * (r - baseline) * pi_b
        const pi = 1 / k;
        const expectedChosen = alpha * r * (1 - pi); // baseline initially 0
        const expectedOther = -alpha * r * pi;

        expect(gb.preferences[1]).toBeCloseTo(expectedChosen, 6);
        expect(gb.preferences[0]).toBeCloseTo(expectedOther, 6);
        expect(gb.preferences[2]).toBeCloseTo(expectedOther, 6);

        // baseline should have been updated to a sensible number (for first step: equal to r)
        // we check it is finite and between 0 and r (inclusive)
        expect(Number.isFinite(gb.averageReward)).toBe(true);
        expect(gb.averageReward).toBeGreaterThanOrEqual(0);
        expect(gb.averageReward).toBeLessThanOrEqual(r + 1e-9);
    });

    it('multiple updates accumulate and change preferences (sanity)', () => {
        // two updates on different arms should alter preferences further
        gb.update({ arm: 0, observedReward: 1 });
        const prefsAfter1 = gb.getPreferences();

        gb.update({ arm: 2, observedReward: 0 });
        const prefsAfter2 = gb.getPreferences();

        // prefsAfter2 should not equal prefsAfter1
        const same = prefsAfter1.every((v, i) => Math.abs(v - prefsAfter2[i]) < 1e-12);
        expect(same).toBe(false);
    });

    it('update throws when observedReward is not a number', () => {
        expect(() => gb.update({ arm: 0, observedReward: 'a' })).toThrow();
        expect(() => gb.update({ arm: 0, observedReward: "§" })).toThrow();
        expect(() => gb.update({ arm: 0, observedReward: null })).toThrow();
    });

    it('reset clears preferences and baseline', () => {
        // set non-zero state
        gb.preferences = [1, 2, -1];
        gb.averageReward = 3.14;

        gb.reset();

        expect(gb.preferences.every(v => v === 0)).toBe(true);
        expect(gb.averageReward).toBe(0);
    });
});
