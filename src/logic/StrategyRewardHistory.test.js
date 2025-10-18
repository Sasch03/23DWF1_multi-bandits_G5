import { describe, it, expect, beforeEach } from 'vitest';
import StrategyRewardHistory from '@/logic/StrategyRewardHistory.js';

describe('StrategyRewardHistory', () => {
    let history;

    beforeEach(() => {
        history = new StrategyRewardHistory();
    });

    it('adds integer rewards correctly from object', () => {
        const obj = { observedRewards: [1, 0, -3] };
        history.addReward(history.manualRewards, obj);
        expect(history.manualRewards).toEqual([1, 1, -2]);
    });

    it('adds floating point rewards correctly from object', () => {
        const obj = { observedRewards: [0.5, 3.14] };
        history.addReward(history.greedyRewards, obj);
        expect(history.greedyRewards).toEqual([0.5, 3.64]);
    });

    it('adds negative numbers correctly from object', () => {
        const obj = { observedRewards: [-2] };
        history.addReward(history.epsilonGreedyRewards, obj);
        expect(history.epsilonGreedyRewards).toEqual([-2]);
    });

    it('adds UpperConfidenceBound rewards correctly', () => {
        const obj = { observedRewards: [2, 1, 1] };
        history.addReward(history.UpperConfidenceBoundRewards, obj);
        expect(history.UpperConfidenceBoundRewards).toEqual([2, 3, 4]);
    });

    it('adds GradientBandit rewards correctly (floats)', () => {
        const obj = { observedRewards: [0.25, 0.75, -0.5] };
        history.addReward(history.GradientBanditRewards, obj);
        expect(history.GradientBanditRewards).toEqual([0.25, 1.0, 0.5]);
    });

    it('throws error if object does not contain an observedRewards array', () => {
        expect(() => history.addReward(history.manualRewards, null)).toThrow();
        expect(() => history.addReward(history.manualRewards, {})).toThrow();
        expect(() => history.addReward(history.manualRewards, { observedRewards: 'notArray' })).toThrow();
    });

    it('throws error if non-managed array is passed', () => {
        const fakeArray = [];
        const obj = { observedRewards: [1] };
        expect(() => history.addReward(fakeArray, obj)).toThrow();
    });

    it('throws error if observedRewards is shorter than cumulative array', () => {
        history.manualRewards.push(1, 2);
        const obj = { observedRewards: [1] };
        expect(() => history.addReward(history.manualRewards, obj)).toThrow();
    });

    it('does nothing if observedRewards length equals cumulative array length', () => {
        const obj = { observedRewards: [1, 2] };
        history.manualRewards.push(1, 3); // already cumulative sum
        history.addReward(history.manualRewards, obj);
        // Array should remain unchanged
        expect(history.manualRewards).toEqual([1, 3]);
    });

    it('resets original three arrays', () => {
        history.addReward(history.manualRewards, { observedRewards: [1] });
        history.addReward(history.greedyRewards, { observedRewards: [2.5] });
        history.addReward(history.epsilonGreedyRewards, { observedRewards: [-5] });

        history.reset();

        expect(history.manualRewards).toEqual([]);
        expect(history.greedyRewards).toEqual([]);
        expect(history.epsilonGreedyRewards).toEqual([]);
    });

    // -------------
    // Tests for the newly added arrays' behavior with edge cases
    // -------------

    it('throws if adding non-number reward into UCB array', () => {
        const obj = { observedRewards: [1, 'bad', 2] };
        expect(() => history.addReward(history.UpperConfidenceBoundRewards, obj)).toThrow();
    });

    it('throws if adding non-number reward into GradientBandit array', () => {
        const obj = { observedRewards: [0.1, 'cool'] };
        expect(() => history.addReward(history.GradientBanditRewards, obj)).toThrow();
    });

    it('handles incremental additions to UCB array correctly', () => {
        const obj1 = { observedRewards: [1, 1] };
        const obj2 = { observedRewards: [1, 1, 2] };
        history.addReward(history.UpperConfidenceBoundRewards, obj1);
        expect(history.UpperConfidenceBoundRewards).toEqual([1, 2]);
        history.addReward(history.UpperConfidenceBoundRewards, obj2);
        // new cumulative: previously [1,2], src has extra element 2 => cumulative becomes [1,2,4]
        expect(history.UpperConfidenceBoundRewards).toEqual([1, 2, 4]);
    });

    it('handles incremental additions to GradientBandit array correctly', () => {
        const obj1 = { observedRewards: [0.5] };
        const obj2 = { observedRewards: [0.5, 0.5] };
        history.addReward(history.GradientBanditRewards, obj1);
        expect(history.GradientBanditRewards).toEqual([0.5]);
        history.addReward(history.GradientBanditRewards, obj2);
        expect(history.GradientBanditRewards).toEqual([0.5, 1.0]);
    });

    it('resets all arrays including UCB and GradientBandit arrays', () => {
        history.addReward(history.manualRewards, { observedRewards: [1] });
        history.addReward(history.UpperConfidenceBoundRewards, { observedRewards: [2] });
        history.addReward(history.GradientBanditRewards, { observedRewards: [3] });

        history.reset();

        expect(history.manualRewards).toEqual([]);
        expect(history.greedyRewards).toEqual([]);
        expect(history.epsilonGreedyRewards).toEqual([]);
        expect(history.UpperConfidenceBoundRewards).toEqual([]); // requires reset() to clear it
        expect(history.GradientBanditRewards).toEqual([]); // requires reset() to clear it
    });
});
