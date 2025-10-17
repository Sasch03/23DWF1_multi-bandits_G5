import { EPSILON_DEFAULT } from "@/constants.js";

/**
 * Provides epsilon values for epsilon-greedy or similar algorithms.
 * Default: constant Epsilon from configuration.
 */
export class EpsilonProvider {
    /**
     * Creates a new EpsilonProvider with default epsilon.
     */
    constructor() {
        this.epsilon = EPSILON_DEFAULT;
    }

    /**
     * Current epsilon value (0 ≤ Epsilon ≤ 1).
     * @type {number}
     */
    epsilon;

    /**
     * Returns the epsilon value for the given step.
     * Currently constant.
     * @returns {number} Epsilon value.
     */
    getEpsilon() {
        return this.epsilon;
    }

    /**
     * Set new epsilon value for exploration.
     * @param {number} epsilon - Must be in [0,1].
     */
    setEpsilon(epsilon) {
        if (typeof epsilon !== "number" || epsilon < 0 || epsilon > 1) {
            throw new Error("epsilon must be 0..1");
        }
        this.epsilon = epsilon;
    }
}

/**
 * Shared singleton instance.
 * @type {EpsilonProvider}
 */
const epsilonProvider = new EpsilonProvider();
export default epsilonProvider;