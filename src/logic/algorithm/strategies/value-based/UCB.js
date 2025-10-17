import ValueBasedAlgorithm from "@/logic/algorithm/ValueBasedAlgorithm.js";
import UCBProvider from "@/logic/algorithm/strategies/value-based/UCBProvider.js";

/**
 * UCB1 over ValueBasedAlgorithm (Q-values).
 * Score(i) = Q[i] + c * sqrt((2 * ln t) / N[i]).
 * - Pull each arm once (cold-start).
 * - Optimistic init works via initial value .
 */
export default class UCB extends ValueBasedAlgorithm {
    /**
     * Create a new UCB1 algorithm instance.
     * @param opts - Options object passed to ValueBasedAlgorithm.
     * @param provider - Exploration coefficient provider (default: constant UCB_C).
     */
    constructor(opts, provider = UCBProvider) {
        super(opts);
        this.explorationCoefficientProvider = provider; // exploration coefficient provider (c)
    }

    /**
     * Exploration coefficient provider.
     * @type {UcbCProvider}
     */
    explorationCoefficientProvider;

    /**
     * Select the next arm using UCB1.
     */
    selectArm() {
        // Cold-start: ensure every arm is tried once
        for (let i = 0; i < this.numberOfArms; i++) {
            if (this.numberOfPulls[i] === 0) return i;
        }

        // UCB1 score
        const t = Math.max(1, this.step); // guard for ln
        const c = this.explorationCoefficientProvider.getC(this.step, this.numberOfTries);

        let best = 0, bestScore = -Infinity;
        for (let i = 0; i < this.numberOfArms; i++) {
            const q = this.expectedRewards[i];       // exploitation term
            const n = this.numberOfPulls[i];         // pulls of arm i
            const bonus = c * Math.sqrt((2 * Math.log(t)) / n); // exploration term
            const score = q + bonus;
            if (score > bestScore) { bestScore = score; best = i; }
        }
        return best;
    }
}
