/**
 * Simple container for reward histories of the strategies.
 */
export default class StrategyRewardHistory {
    manualRewards = [];
    greedyRewards = [];
    epsilonGreedyRewards = [];

    /**
     * Append a reward to one of the managed arrays.
     * The arrRef must be exactly one of the instance arrays.
     *
     * @param {Array} arrRef - reference to the target array (must be one of the three internal arrays)
     * @param {number} reward - the reward value to append
     * @returns {number} new length of the array after insertion
     */
    addReward(arrRef, reward) {
        if (arrRef !== this.manualRewards && arrRef !== this.greedyRewards && arrRef !== this.epsilonGreedyRewards) {
            throw new Error('addReward: provided array is not managed by StrategyRewardHistory. Use one of the instance arrays.');
        }
        if (typeof reward !== 'number') {
            throw new Error('Reward must be a number.');
        }

        console.log(`Reward ${reward} added to array ${arrRef}.`);
        return arrRef.push(reward);
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