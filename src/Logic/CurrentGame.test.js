import { describe, it, expect, beforeEach } from 'vitest';
import { DistributionTyp } from './Enumeration/DistributionTyp.js';
import { AlgorithmTyp } from './Enumeration/AlgorithmTyp.js';
import CurrentGame from './CurrentGame.js';

describe('CurrentGame', () => {
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

    it('creates Bernoulli reward table', () => {
        game.setNumberOfArms(2);
        game.setNumberOfTries(5);
        game.setChosenDistribution(DistributionTyp.BERNOULLI);
        game.createTable();
        expect(game.tableOfRewards.length).toBe(2);
        expect(game.tableOfRewards[0].length).toBe(5);
        expect(game.tableOfRewards.flat().every(r => r === 0 || r === 1)).toBe(true);
    });

    it('creates Gaussian reward table', () => {
        game.setNumberOfArms(2);
        game.setNumberOfTries(5);
        game.setChosenDistribution(DistributionTyp.GAUSSIAN);
        game.createTable();
        expect(game.tableOfRewards.length).toBe(2);
        expect(game.tableOfRewards[0].length).toBe(5);
        expect(game.tableOfRewards.flat().every(r => typeof r === 'number')).toBe(true);
    });

    it('throws error if properties are missing before table creation', () => {
        expect(() => game.createTable()).toThrow();
        game.setNumberOfArms(2);
        expect(() => game.createTable()).toThrow();
        game.setNumberOfTries(5);
        expect(() => game.createTable()).toThrow();
    });
});
