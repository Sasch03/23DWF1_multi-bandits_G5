import { describe, it, expect, beforeEach } from 'vitest';
import { DistributionTyp } from '@/logic/enumeration/DistributionTyp.js';
import { AlgorithmTyp } from '@/logic/enumeration/AlgorithmTyp.js';
import CurrentGame from './CurrentGame.js';

describe('CurrentGame (updated tests for Gaussian generation)', () => {
    let game;

    beforeEach(() => {
        game = new CurrentGame();
    });

    it('sets number of arms correctly', () => {
        game.setNumberOfArms(5);
        expect(game.numberOfArms).toBe(5);
    });

    it('throws error for invalid number of arms', () => {
        expect(() => game.setNumberOfArms(0)).toThrow();
        expect(() => game.setNumberOfArms(-1)).toThrow();
        expect(() => game.setNumberOfArms('a')).toThrow();
    });

    it('sets number of tries correctly', () => {
        game.setNumberOfTries(10);
        expect(game.numberOfTries).toBe(10);
    });

    it('throws error for invalid number of tries', () => {
        expect(() => game.setNumberOfTries(0)).toThrow();
        expect(() => game.setNumberOfTries(-1)).toThrow();
        expect(() => game.setNumberOfTries('a')).toThrow();
    });

    it('sets chosen distribution correctly', () => {
        game.setChosenDistribution(DistributionTyp.BERNOULLI);
        expect(game.chosenDistribution).toBe(DistributionTyp.BERNOULLI);
    });

    it('throws error for invalid distribution', () => {
        expect(() => game.setChosenDistribution('INVALID')).toThrow();
    });

    it('sets chosen algorithms correctly', () => {
        game.setChosenAlgorithms([AlgorithmTyp.GREEDY, AlgorithmTyp.EPSILON_GREEDY]);
        expect(game.chosenAlgorithms).toEqual([AlgorithmTyp.GREEDY, AlgorithmTyp.EPSILON_GREEDY]);
    });

    it('throws error for invalid algorithms', () => {
        expect(() => game.setChosenAlgorithms(['INVALID'])).toThrow();
        expect(() => game.setChosenAlgorithms(AlgorithmTyp.EPSILON_GREEDY)).toThrow();
    });

    it('creates Bernoulli reward table and stores probabilities', () => {
        game.setNumberOfArms(3);
        game.setNumberOfTries(7);
        game.setChosenDistribution(DistributionTyp.BERNOULLI);

        game.createTable();

        // table shape
        expect(game.tableOfRewards.length).toBe(3);
        expect(game.tableOfRewards[0].length).toBe(7);

        // rewards are 0 or 1
        expect(game.tableOfRewards.flat().every(r => r === 0 || r === 1)).toBe(true);

        // bernoulliProbabilities were stored and have correct length & range
        expect(Array.isArray(game.bernoulliProbabilities)).toBe(true);
        expect(game.bernoulliProbabilities.length).toBe(3);
        expect(game.bernoulliProbabilities.every(p => typeof p === 'number' && p >= 0 && p <= 1)).toBe(true);
    });

    it('creates Gaussian reward table with expected structural properties', () => {
        const arms = 4;
        const tries = 9;
        game.setNumberOfArms(arms);
        game.setNumberOfTries(tries);
        game.setChosenDistribution(DistributionTyp.GAUSSIAN);

        game.createTable();

        // table shape
        expect(game.tableOfRewards.length).toBe(arms);
        expect(game.tableOfRewards[0].length).toBe(tries);

        // gaussianMeans must exist, have correct length and be finite numbers
        expect(Array.isArray(game.gaussianMeans)).toBe(true);
        expect(game.gaussianMeans.length).toBe(arms);
        expect(game.gaussianMeans.every(m => typeof m === 'number' && Number.isFinite(m))).toBe(true);

        // Variation check instead of sorting check
        const distinctMeans = new Set(game.gaussianMeans.map(m => m.toFixed(10)));
        expect(distinctMeans.size).toBeGreaterThan(1); // not all means equal

        // rewards are numbers and finite
        const flat = game.tableOfRewards.flat();
        expect(flat.every(v => typeof v === 'number' && Number.isFinite(v))).toBe(true);
    });


    it('throws error if properties are missing before table creation', () => {
        expect(() => game.createTable()).toThrow();
        game.setNumberOfArms(2);
        expect(() => game.createTable()).toThrow();
        game.setNumberOfTries(5);
        expect(() => game.createTable()).toThrow();
    });
});
