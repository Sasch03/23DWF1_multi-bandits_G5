import Algorithm from "@/logic/algorithm/Algorithm.js";

/**
 * Abstract subclass of Algorithm that maintains estimated (expected) rewards Q(a).
 * Serves as a base for value-based strategies.
 * Handles initialization and incremental update of expected rewards.
 */
export default class ValueBasedAlgorithm extends Algorithm {
    /**
     * @param {number} numberOfArms - Total number of arms in the bandit problem.
     * @param {number} numberOfTries - Total number of steps (T) for the simulation.
     * @param {?number[]} [expectedRewardsBegin=null] - Optional initial Q-values (optimistic start or UI input).
     */
    constructor({numberOfArms, numberOfTries, expectedRewardsBegin = null}) {
        super({numberOfArms, numberOfTries});
        this.expectedRewards = Array(this.numberOfArms).fill(0);
        // Allow overriding the default zero-initialization of Q.
        // Useful for optimistic initialization or UI-provided starting values.
        // Optional
        if (expectedRewardsBegin!= null) this.setExpectedRewards(expectedRewardsBegin);
    }

    /**
     * Total number of arms in the bandit problem.
     * @type {number}
     */
    numberOfArms;

    /**
     * Total number of steps (T) for the simulation.
     * @type {number}
     */
    numberOfTries;

    /**
     * Current estimates of expected rewards Q(a) for each arm.
     * @type {number[]}
     */
    expectedRewards;

    /**
     * Replace current expected rewards.
     * Validates array length and coerces values to numbers.
     * @param {number[]} expectedRewards - New expected rewards array, length = numberOfArms.
     */
    setExpectedRewards(expectedRewards) {
        if (!Array.isArray(expectedRewards) || expectedRewards.length !== this.numberOfArms) throw new Error('bad expectedRewards');
        this.expectedRewards = expectedRewards.map(Number);
    }

    /**
     * Returns a copy of the current expected rewards Q(a) for all arms.
     * Each value represents the current estimate of the expected reward for the corresponding arm.
     *
     * @returns {number[]} Array of expected rewards for each arm.
     */
    getExpectedRewards() {
        return this.expectedRewards.slice();
    }

    /**
     * Select the arm with the maximum expected reward (greedy choice).
     * Can be overridden for tie-breaking or stochastic selection.
     *
     * @returns {number} index of chosen arm.
     */
    selectArm() {
        return this.expectedRewards.indexOf(Math.max(...this.expectedRewards));
    }

    /**
     * Resets the internal state of the algorithm for a new run.
     * - Calls the base class reset to clear steps, selected arms, observed rewards, and pull counts.
     * - Resets all expected rewards Q(a) to 0.
     */
    reset() {
        super.reset();
        this.expectedRewards.fill(0);
    }

    /**
     * Update internal state after observing reward.
     * Applies incremental mean update:
     * Q(a) ← Q(a) + (R - Q(a)) / N(a).
     * @param {number} arm - Selected arm index.
     * @param {number} observedReward - Observed reward.
     */
    update({arm, observedReward}) {
        super.update({arm, observedReward});
        this.expectedRewards[arm] += (observedReward - this.expectedRewards[arm]) / this.numberOfPulls[arm];
    }
}