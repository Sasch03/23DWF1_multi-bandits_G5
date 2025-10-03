import { describe, it, expect } from 'vitest';
import ValueBasedAlgorithm from '@/logic/algorithm/ValueBasedAlgorithm.js';

// Minimal child to satisfy abstract selectArm()
class DummyERB extends ValueBasedAlgorithm {
    selectArm() { return 0; }
}

describe('ExpectedRewardsBased', () => {
    it('init: Q defaults to zeros', () => {
        const b = new DummyERB({ numberOfArms: 3, numberOfTries: 5 });
        expect(b.getExpectedRewards()).toEqual([0, 0, 0]);
    });

    it('init: accepts expectedRewardsBegin', () => {
        const b = new DummyERB({
            numberOfArms: 3,
            numberOfTries: 5,
            expectedRewardsBegin: [1, 2, 3],
        });
        expect(b.getExpectedRewards()).toEqual([1, 2, 3]);
    });

    it('setExpectedRewards: throws on wrong length', () => {
        const b = new DummyERB({ numberOfArms: 3, numberOfTries: 5 });
        expect(() => b.setExpectedRewards([1, 2])).toThrow(/bad expectedRewards/);
    });

    it('update: sample-average updates Q', () => {
        const b = new DummyERB({ numberOfArms: 1, numberOfTries: 3 });
        // first pull: n=1 → Q = 10
        b.update({ arm: 0, observedReward: 10 });
        expect(b.getExpectedRewards()[0]).toBe(10);
        // second pull: n=2 → Q = (10 + 0) / 2 = 5
        b.update({ arm: 0, observedReward: 0 });
        expect(b.getExpectedRewards()[0]).toBe(5);
        // third pull: n=3 → Q = (10 + 0 + 5) / 3 = 5
        b.update({ arm: 0, observedReward: 5 });
        expect(b.getExpectedRewards()[0]).toBe(5);
    });

    it('reset: clears history and Q', () => {
        const b = new DummyERB({ numberOfArms: 2, numberOfTries: 2 });
        b.update({ arm: 0, observedReward: 7 });
        b.reset();
        expect(b.step).toBe(0);
        expect(b.selectedArms).toEqual([null, null]);
        expect(b.getExpectedRewards()).toEqual([0, 0]);
    });

    it('inherits Algorithm validations (bad arm)', () => {
        const b = new DummyERB({ numberOfArms: 2, numberOfTries: 1 });
        expect(() => b.update({ arm: -1, observedReward: 0 })).toThrow(/bad arm/);
        expect(() => b.update({ arm: 2, observedReward: 0 })).toThrow(/bad arm/);
    });

    it('init: ignores expectedRewardsBegin if null/undefined', () => {
        const b1 = new DummyERB({
            numberOfArms: 2,
            numberOfTries: 3,
            expectedRewardsBegin: null,
        });
        expect(b1.getExpectedRewards()).toEqual([0, 0]);
        const b2 = new DummyERB({
            numberOfArms: 2,
            numberOfTries: 3,
            expectedRewardsBegin: undefined,
        });
        expect(b2.getExpectedRewards()).toEqual([0, 0]);
    });

    it('init: accepts [0,0,...] as valid expectedRewardsBegin', () => {
        const b = new DummyERB({
            numberOfArms: 2,
            numberOfTries: 3,
            expectedRewardsBegin: [0, 0],
        });
        expect(b.getExpectedRewards()).toEqual([0, 0]);
    });
});
