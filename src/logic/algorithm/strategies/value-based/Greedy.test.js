import { describe, it, expect, beforeEach } from 'vitest';
import Greedy from '@/logic/algorithm/strategies/value-based/Greedy.js';

describe('Greedy Algorithm', () => {
    let algo;
    const opts = { numberOfArms: 3, numberOfTries: 100 };

    beforeEach(() => {
        algo = new Greedy(opts);
    });

    it('should initialize with zero expected rewards', () => {
        const rewards = algo.getExpectedRewards();
        expect(rewards.length).toBe(opts.numberOfArms);
        expect(rewards.every(q => q === 0)).toBe(true);
    });

    it('should select the arm with the highest expected reward (Exploitation)', () => {
        algo.expectedRewards = [10, 50, 20];

        expect(algo.selectArm()).toBe(1);

        algo.expectedRewards = [99, 50, 20];
        expect(algo.selectArm()).toBe(0);

        algo.expectedRewards = [10, 50, 100];
        expect(algo.selectArm()).toBe(2);
    });

    it('should select the first arm if all rewards are equal', () => {
        expect(algo.selectArm()).toBe(0);

        algo.expectedRewards = [10, 10, 10];
        expect(algo.selectArm()).toBe(0);
    });

    it('should update Q-value correctly after one update (incremental mean)', () => {
        let arm = algo.selectArm();
        expect(arm).toBe(0);

        algo.update({ arm: 0, observedReward: 10 });

        let rewards = algo.getExpectedRewards();
        expect(rewards[0]).toBe(10);
        expect(rewards[1]).toBe(0);
        expect(rewards[2]).toBe(0);
        expect(algo.numberOfPulls[0]).toBe(1);
    });

    it('should update Q-value correctly after multiple updates', () => {
        algo.update({ arm: 0, observedReward: 10 });

        algo.update({ arm: 0, observedReward: 2 });

        let rewards = algo.getExpectedRewards();
        expect(rewards[0]).toBe(6);
        expect(algo.numberOfPulls[0]).toBe(2);

        algo.update({ arm: 1, observedReward: 9 });

        rewards = algo.getExpectedRewards();
        expect(rewards[0]).toBe(6);
        expect(rewards[1]).toBe(9);
        expect(algo.numberOfPulls[1]).toBe(1);
    });
});