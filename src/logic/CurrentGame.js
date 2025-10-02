import { DistributionTyp } from '@/logic/enumeration/DistributionTyp.js';
import { AlgorithmTyp } from '@/logic/enumeration/AlgorithmTyp.js';

/*
 * This class represents a k-armed bandit game configuration and environment.
 * It allows to set the number of arms and trials, select a reward distribution
 * (Bernoulli or Gaussian), and chose algorithms to be used for action selection.
 * The environment generates reward tables for each arm according to the chosen
 * distribution and stores them for later use.
 */
export default class CurrentGame {
    chosenDistribution;
    chosenAlgorithms;
    tableOfRewards;

    /**
     * Sets the number of arms for the bandit game.
     * @param {number} value - Number of arms, must be an integer > 0.
     */
    setNumberOfArms(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("numberOfArms has to be a number > 0.");
        }
        this.numberOfArms = value;
        console.log(`Number of arms set to ${value}.`);
    }

    /**
     * Sets the number of iterations for the bandit game.
     * @param {number} value - Number of iterations, must be an integer > 0.
     */
    setNumberOfTries(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("numberOfTries has to be a number > 0.");
        }
        this.numberOfTries = value;
        console.log(`Number of trials set to ${value}.`);
    }

    /**
     * Sets the distribution type for the bandit game.
     * @param {DistributionTyp} value - Must be a valid distribution type (BERNOULLI or GAUSSIAN).
     */
    setChosenDistribution(value) {
        if (!Object.values(DistributionTyp).includes(value)) {
            throw new Error("ChosenDistribution has to be a distribution typ.");
        }
        this.chosenDistribution = value;
        console.log(`Chosen distribution set to ${value}.`);
    }

    /**
     * Sets the algorithms to be used in the bandit game.
     * @param {AlgorithmTyp[]} value - Array of valid algorithm types.
     */
    setChosenAlgorithms(value) {
        if (!Array.isArray(value) || value.some(alg => !Object.values(AlgorithmTyp).includes(alg))) {
            throw new Error("ChosenAlgorithms must be an array of valid AlgorithmTypes.");
        }
        this.chosenAlgorithms = value;
        console.log(`Chosen algorithms set to: ${value.join(", ")}.`);
    }

    /**
     * Creates the reward table for the current game configuration.
     * Validates that all required properties are set and then generates the table.
     */
    createTable() {
        // Ensure all required properties are set before table creation.
        if (!this.chosenDistribution || this.numberOfArms <= 0 || this.numberOfTries <= 0) {
            throw new Error("Please set all properties (distribution, arms, tries) before creating the table.");
        }

        // Generate and assign the reward table for the current configuration.
        this.tableOfRewards = this.#generateTable(
            this.chosenDistribution,
            this.numberOfArms,
            this.numberOfTries
        );
        console.log("Table of rewards created and stored.");
    }

    /**
     * Generates the reward table for all arms and trials based on the chosen distribution.
     * - Bernoulli: Each arm has a fixed probability of reward (0 or 1).
     * - Gaussian: Each arm has a fixed mean µ and a shared standard deviation σ.
     *
     * @param {DistributionTyp} chosenDistribution - Selected distribution type.
     * @param {number} numberOfArms - Number of arms to generate.
     * @param {number} numberOfTries - Number of iterations per arm.
     * @returns {number[][]} Reward table as a 2D array.
     */
    #generateTable(chosenDistribution, numberOfArms, numberOfTries) {
        console.log(`Generating table: distribution=${chosenDistribution}, arms=${numberOfArms}, tries=${numberOfTries}.`);
        const table = [];

        switch (chosenDistribution) {
            case DistributionTyp.BERNOULLI: {
                // For Bernoulli bandits: assign each arm a fixed success probability.
                const bernoulliProbabilities = Array.from({ length: numberOfArms }, () => Math.random());
                console.log("Bernoulli probabilities:", bernoulliProbabilities);
                this.bernoulliProbabilities = bernoulliProbabilities;

                // Generate rewards for each arm across all trials.
                for (let i = 0; i < numberOfArms; i++) {
                    const rewardsForArm = [];
                    for (let j = 0; j < numberOfTries; j++) {
                        // Reward is 1 if random number < probability of this arm, otherwise 0.
                        const reward = Math.random() < bernoulliProbabilities[i] ? 1 : 0;
                        rewardsForArm.push(reward);
                    }
                    table.push(rewardsForArm);
                }
                break;
            }

            case DistributionTyp.GAUSSIAN: {
                // For Gaussian bandits: assign each arm a fixed mean µ (between 0 and 10).
                const gaussianMeans = Array.from({ length: numberOfArms }, () => Math.random() * 10);
                const gaussianStdDev = 2.0;
                console.log("Gaussian means:", gaussianMeans, "StdDev:", gaussianStdDev);

                // Generate normally distributed rewards for each arm.
                for (let i = 0; i < numberOfArms; i++) {
                    const rewardsForArm = [];
                    let generated = 0;

                    // Generate rewards until the number of trials is reached.
                    while (generated < numberOfTries) {
                        // Box-Muller transform to generate two independent normal(0,1) values.
                        let u = 0, v = 0;
                        while (u === 0) u = Math.random();
                        while (v === 0) v = Math.random();

                        const mag = Math.sqrt(-2.0 * Math.log(u));
                        const z1 = mag * Math.cos(2.0 * Math.PI * v);
                        const z2 = mag * Math.sin(2.0 * Math.PI * v);

                        // First normally distributed reward value.
                        if (generated < numberOfTries) {
                            rewardsForArm.push(z1 * gaussianStdDev + gaussianMeans[i]);
                            generated++;
                        }
                        // Second normally distributed reward value.
                        if (generated < numberOfTries) {
                            rewardsForArm.push(z2 * gaussianStdDev + gaussianMeans[i]);
                            generated++;
                        }
                    }
                    table.push(rewardsForArm);
                }
                break;
            }

            default:
                // Throw error if the distribution type is not recognized.
                throw new Error("Unknown distribution type.");
        }

        console.log("Reward table generated successfully.");
        return table;
    }
}
