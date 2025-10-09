/**
 * Simple container for reward histories of the strategies.
 */
export default class StrategyRewardHistory {
    /**
     * Stores cumulative rewards for the manual strategy.
     * Each index represents the running total up to that point.
     * @type {number[]}
     */
    manualRewards = [];
    /**
     * Stores cumulative rewards for the greedy strategy.
     * Each index represents the running total up to that point.
     * @type {number[]}
     */
    greedyRewards = [];
    /**
     * Stores cumulative rewards for the epsilon greedy strategy.
     * Each index represents the running total up to that point.
     * @type {number[]}
     */
    epsilonGreedyRewards = [];

    /**
     * Synchronizes one of the cumulative reward arrays with the observedRewards of a given object.
     * The arrRef must be exactly one of the instance arrays (manualRewards, greedyRewards, epsilonGreedyRewards).
     *
     * @param {Array} arrRef - reference to the target cumulative array (one of the three internal arrays)
     * @param {Object} obj - object containing an observedRewards array
     */
    addReward(arrRef, obj) {
        // --- Validate target array ---
        if (arrRef !== this.manualRewards && arrRef !== this.greedyRewards && arrRef !== this.epsilonGreedyRewards) {
            throw new Error('addReward: provided array is not managed by StrategyRewardHistory.');
        }

        // --- Validate source object ---
        if (!obj || !Array.isArray(obj.observedRewards)) {
            throw new Error('addReward: provided object must contain an observedRewards array.');
        }

        const src = obj.observedRewards;
        const dest = arrRef;

        // If source and destination already have the same length → nothing to do
        if (dest.length === src.length) return;

        // If source has fewer elements than destination → inconsistent
        if (src.length < dest.length) {
            throw new Error('addReward: observedRewards array is shorter than cumulative array — cannot sync.');
        }

        // Continue cumulatively from the last known sum
        let runningTotal = dest.length > 0 ? dest[dest.length - 1] : 0;

        // Process new rewards
        for (let i = dest.length; i < src.length; i++) {
            const reward = src[i];

            if (typeof reward !== 'number' || !Number.isFinite(reward)) {
                throw new Error(`addReward: invalid reward value at index ${i}. Must be a finite number.`);
            }

            runningTotal += reward;
            dest.push(runningTotal);
        }
    }

    /**
     * Reset all three histories by clearing their contents in-place.
     * This preserves array identity (useful if other code holds references).
     */
    reset() {
        this.manualRewards.length = 0;
        this.greedyRewards.length = 0;
        this.epsilonGreedyRewards.length = 0;
        console.log(`The arrays have been reset.`);
    }
}
