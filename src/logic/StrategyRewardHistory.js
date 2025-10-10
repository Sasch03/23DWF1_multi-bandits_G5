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
     * The arrRef must be exactly one of the instance arrays.
     *
     * @param {Array} arrRef - Reference to the target cumulative array.
     * @param {Object} obj - Object containing an observedRewards array.
     */
    addReward(arrRef, obj) {
        console.log(`Starting addReward for ${arrRef} from object ${obj}.`);

        // Validate target array.
        if (arrRef !== this.manualRewards && arrRef !== this.greedyRewards && arrRef !== this.epsilonGreedyRewards) {
            throw new Error("Provided array is not managed by StrategyRewardHistory.");
        }

        // Validate source object.
        if (!obj || !Array.isArray(obj.observedRewards)) {
            throw new Error("Provided object must contain an observedRewards array.");
        }

        const src = obj.observedRewards;
        const dest = arrRef;

        if (dest.length === src.length)
        {
            console.info("The arrays are already synchronized. No action required.");
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

            if (typeof reward !== 'number') {
                throw new Error(`Invalid reward value at index ${i}. Must be a number.`);
            }

            runningTotal += reward;
            console.log(`Successfully added ${runningTotal} as a new reward.`);
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
        console.log("The arrays have been reset.");
    }
}
