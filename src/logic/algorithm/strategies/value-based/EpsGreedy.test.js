import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import EpsGreedy from '@/logic/algorithm/strategies/value-based/EpsGreedy.js';
import epsilonProvider from '@/logic/algorithm/strategies/value-based/EpsilonProvider.js';
import { EPSILON_DEFAULT } from '@/constants.js';

afterEach(() => {
    epsilonProvider.setEpsilon(EPSILON_DEFAULT);
    vi.restoreAllMocks();
});

describe('EpsGreedy', () => {
    let algo;

    beforeEach(() => {
        algo = new EpsGreedy({ numberOfArms: 3, numberOfTries: 100 });
    });

    it('should always exploit (pick best arm) when epsilon is 0', () => {
        epsilonProvider.setEpsilon(0);

        algo.expectedRewards = [10, 50, 20];

        for (let i = 0; i < 10; i++) {
            // 4. Prüfung:
            expect(algo.selectArm()).toBe(1);
        }
    });

    it('should always explore (pick random arm) when epsilon is 1', () => {
        epsilonProvider.setEpsilon(1);
        algo.expectedRewards = [10, 50, 20];

        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0.7);

        expect(algo.selectArm()).toBe(2);

        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.9)
            .mockReturnValueOnce(0.1);

        expect(algo.selectArm()).toBe(0);
    });

    it('should correctly switch between exploring and exploiting', () => {
        epsilonProvider.setEpsilon(0.5);
        algo.expectedRewards = [10, 50, 20];

        vi.spyOn(Math, 'random').mockReturnValueOnce(0.6);

        expect(algo.selectArm()).toBe(1);


        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.4)
            .mockReturnValueOnce(0.8);

        expect(algo.selectArm()).toBe(2);
    });
});