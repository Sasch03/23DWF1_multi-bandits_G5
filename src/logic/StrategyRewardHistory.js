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
     * Stores cumulative rewards for the Upper-Confidence-Bound strategy.
     * Each index represents the running total up to that point.
     * @type {number[]}
     */
    UpperConfidenceBoundRewards = [];

    /**
     * Stores cumulative rewards for the gradient bandit strategy.
     * Each index represents the running total up to that point.
     * @type {number[]}
     */
    GradientBanditRewards = [];

    // NEU: Array für den benutzerdefinierten Algorithmus
    customAlgorithmRewards = [];

    /**
     * Synchronizes one of the cumulative reward arrays with the observedRewards of a given object.
     * The arrRef must be exactly one of the instance arrays.
     *
     * @param {Array} arrRef - Reference to the target cumulative array.
     * @param {Object} obj - Object containing an observedRewards array.
     */
    addReward(arrRef, obj) {

        // Validate target array. customAlgorithmRewards HINZUGEFÜGT
        if (arrRef !== this.manualRewards && arrRef !== this.greedyRewards && arrRef !== this.epsilonGreedyRewards
            && arrRef !== this.UpperConfidenceBoundRewards && arrRef !== this.GradientBanditRewards
            && arrRef !== this.customAlgorithmRewards) { // <--- HIER ERWEITERT
            throw new Error("Provided array is not managed by StrategyRewardHistory.");
        }

        // Validate source object.
        if (!obj || !Array.isArray(obj.observedRewards)) {
            throw new Error("Provided object must contain an observedRewards array.");
        }

        const src = obj.observedRewards;
        const dest = arrRef;

        if (dest.length === src.length) {
            return;
        }

        if (src.length < dest.length) {
            throw new Error("ObservedRewards array is shorter than cumulative array — cannot sync.");
        }

        // Continue cumulatively from the last known sum.
        let runningTotal = dest.length > 0 ? dest[dest.length - 1] : 0;

        // Process new rewards.
        for (let i = dest.length; i < src.length; i++) {
            const reward = src[i];

            if (typeof reward !== "number") {
                throw new Error(`Invalid reward value at index ${i}. Must be a number.`);
            }

            runningTotal += reward;
            dest.push(runningTotal);
        }
    }

    /**
     * Reset all arrays by clearing their contents.
     */
    reset() {
        this.manualRewards.length = 0;
        this.greedyRewards.length = 0;
        this.epsilonGreedyRewards.length = 0;
        this.UpperConfidenceBoundRewards.length = 0;
        this.GradientBanditRewards.length = 0;
        this.customAlgorithmRewards.length = 0; // <--- HIER ERWEITERT
        console.log("The arrays have been reset.");
    }
}