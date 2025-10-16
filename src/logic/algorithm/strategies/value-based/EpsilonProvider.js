// Unified entry point for epsilon (ε) values used by exploration-based algorithms.
// Provides a constant epsilon, but can be extended later (e.g. linear or exponential decay).

import { EPSILON_DEFAULT } from "@/constants.js";

/**
 * Provides epsilon values for epsilon-greedy or similar algorithms.
 * Default: constant Epsilon from configuration.
 */
export class EpsilonProvider {
    constructor() {
        /**
         * @type {number} current epsilon value (0 ≤ ε ≤ 1).
         */
        this.epsilon = EPSILON_DEFAULT; }

    /**
     * Returns the epsilon value for the given step.
     * Currently constant.
     * @returns {number} epsilon value.
     */
    getEpsilon() {
        return this.epsilon;
    }

    /**
     * Set new epsilon value.
     * @param {number} v - Must be in [0,1].
     */
    setEpsilon(v) {
        if (typeof v !== "number" || v < 0 || v > 1) throw new Error("epsilon must be 0..1");
        this.epsilon = v;
    }
}

/**
 * @type {EpsilonProvider} shared singleton instance.
 */
const epsilonProvider = new EpsilonProvider();
export default epsilonProvider;