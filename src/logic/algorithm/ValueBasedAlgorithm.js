import Algorithm from "@/logic/algorithm/Algorithm.js";
/**
 * Abstract subclass of Algorithm that maintains estimated (expected) rewards Q(a).
 * Serves as a base for value-based strategies (ε-Greedy, UCB, etc.).
 * Handles initialization and incremental update of expected rewards.
 */

export default class ValueBasedAlgorithm extends Algorithm {
    /**
     * @param {Object} params.
     * @param {number} params.numberOfArms - Number of arms (k).
     * @param {number} params.numberOfTries - Total number of steps (T).
     * @param {?number[]} [params.expectedRewardsBegin=null] - Optional initial Q-values (optimistic start or UI input).
     */
    constructor({
                    numberOfArms,
                    numberOfTries,
                    /** @type {number[]} current estimates of expected rewards Q(a). */
                    expectedRewardsBegin = null}) {
        super({numberOfArms, numberOfTries});
        /** @type {number[]} current estimates of expected rewards Q(a). */
        this.expectedRewards = Array(this.numberOfArms).fill(0);
        // Allow overriding the default zero-initialization of Q.
        // Useful for optimistic initialization or UI-provided starting values.
        // Optional
        if (expectedRewardsBegin!= null) this.setExpectedRewards(expectedRewardsBegin);
    }

    /**
     * Replace current expected rewards.
     * Validates array length and coerces values to numbers.
     * @param {number[]} expectedRewards - New expected rewards array, length = numberOfArms.
     */
    setExpectedRewards(expectedRewards) {
        if (!Array.isArray(expectedRewards) || expectedRewards.length !== this.numberOfArms) throw new Error('bad expectedRewards');
        this.expectedRewards = expectedRewards.map(Number);
    }

    getExpectedRewards() {
        return this.expectedRewards.slice();
    }

    /**
     * Select the arm with the maximum expected reward (greedy choice).
     * Can be overridden for tie-breaking or stochastic selection.
     * @returns {number} index of chosen arm.
     */
    selectArm() {
        return this.expectedRewards.indexOf(Math.max(...this.expectedRewards));
    }

    reset() {
        super.reset();
        this.expectedRewards.fill(0);
    }

    /**
     * Update internal state after observing reward.
     * Applies incremental mean update:
     * Q(a) ← Q(a) + (R - Q(a)) / N(a).
     * @param {Object} p.
     * @param {number} p.arm - Selected arm index.
     * @param {number} p.observedReward - Observed reward.
     */
    update({arm, observedReward}) {
        super.update({arm, observedReward});
        this.expectedRewards[arm] += (observedReward - this.expectedRewards[arm]) / this.numberOfPulls[arm];
    }
}