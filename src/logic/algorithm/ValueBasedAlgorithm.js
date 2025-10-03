import Algorithm from "@/Logic/Algorithm/Algorithm.js";
// ExpectedRewardsBased — intermediate (abstract) class between Algorithm and concrete strategies.
// It extends the base Algorithm by computing and storing "expected rewards" (expectedRewards) for each arm.
// Algorithms that select an arm based on these expectations (e.g., ε-Greedy, UCB, etc.)
// should inherit from this class to avoid duplicating the logic for handling expectedRewards.


export default class  ExpectedRewardsBased extends Algorithm {
    constructor({numberOfArms, numberOfTries, expectedRewardsBegin = null}) {
        super({numberOfArms, numberOfTries});
        this.expectedRewards = Array(this.numberOfArms).fill(0);
        // Allow overriding the default zero-initialization of Q.
        // Useful for optimistic initialization or UI-provided starting values.
        // Optional
        if (expectedRewardsBegin!= null) this.setExpectedRewards(expectedRewardsBegin);
    }


    //validate the length of array
    // Coerce to numbers in case values come as strings (e.g., from UI/JSON form inputs).
    // Example: ["1", "2.5"] -> [1, 2.5]
    setExpectedRewards(expectedRewards) {
        if (!Array.isArray(expectedRewards) || expectedRewards.length !== this.numberOfArms) throw new Error('bad expectedRewards');
        this.expectedRewards = expectedRewards.map(Number);
    }


    getExpectedRewards() {
        return this.expectedRewards.slice();
    }

    // By default, returns the first arm with the maximum expected reward.
    // (Optional) This could be extended to break ties randomly among arms
    // that share the same maximum value, to avoid systematic bias.
    selectArm() {
        return this.expectedRewards.indexOf(Math.max(...this.expectedRewards));
    }
    //....

    reset() {
        super.reset();
        this.expectedRewards.fill(0);
    }

    update({arm, observedReward}) {
        super.update({arm, observedReward});
        this.expectedRewards[arm] += (observedReward - this.expectedRewards[arm]) / this.numberOfPulls[arm];
    }
}