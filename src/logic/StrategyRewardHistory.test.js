import { describe, it, expect, beforeEach } from 'vitest';
import StrategyRewardHistory from './StrategyRewardHistory.js';

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

    it('resets all arrays', () => {
        history.addReward(history.manualRewards, { observedRewards: [1] });
        history.addReward(history.greedyRewards, { observedRewards: [2.5] });
        history.addReward(history.epsilonGreedyRewards, { observedRewards: [-5] });

        history.reset();

        expect(history.manualRewards).toEqual([]);
        expect(history.greedyRewards).toEqual([]);
        expect(history.epsilonGreedyRewards).toEqual([]);
    });
});
