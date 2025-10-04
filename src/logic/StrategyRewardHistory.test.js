import { describe, it, expect, beforeEach } from 'vitest';
import StrategyRewardHistory from './StrategyRewardHistory.js';

describe('StrategyRewardHistory', () => {
    let history;

    beforeEach(() => {
        history = new StrategyRewardHistory();
    });

    it('adds integer rewards correctly', () => {
        history.addReward(history.manualRewards, 1);
        history.addReward(history.manualRewards, 0);
        expect(history.manualRewards).toEqual([1, 1]);
    });

    it('allows floating point rewards (current implementation)', () => {
        history.addReward(history.greedyRewards, 0.5);
        history.addReward(history.greedyRewards, 3.14);
        expect(history.greedyRewards).toEqual([0.5, 3.64]);
    });

    it('allows negative numbers', () => {
        history.addReward(history.epsilonGreedyRewards, -2);
        expect(history.epsilonGreedyRewards).toEqual([-2]);
    });

    it('throws error if non-numeric value is passed', () => {
        // Die Funktion, die einen Fehler werfen soll, muss in eine anonyme Funktion gekapselt werden.
        expect(() => history.addReward(history.manualRewards, 'reward')).toThrow();
        expect(() => history.addReward(history.manualRewards, null)).toThrow();
        expect(() => history.addReward(history.manualRewards, { value: 1 })).toThrow();
        expect(() => history.addReward(history.manualRewards, undefined)).toThrow();

        // Zusätzlich wird sichergestellt, dass das Array nach den fehlgeschlagenen Versuchen leer bleibt.
        expect(history.manualRewards).toEqual([]);
    });

    it('throws error if non-managed array is passed', () => {
        const fakeArray = [];
        expect(() => history.addReward(fakeArray, 42)).toThrow();
    });

    it('resets all arrays', () => {
        history.addReward(history.manualRewards, 1);
        history.addReward(history.greedyRewards, 2.5);
        history.addReward(history.epsilonGreedyRewards, -5);

        history.reset();

        expect(history.manualRewards).toEqual([]);
        expect(history.greedyRewards).toEqual([]);
        expect(history.epsilonGreedyRewards).toEqual([]);
    });
});
