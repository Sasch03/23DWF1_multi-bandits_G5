// src/logic/epsilon/EpsilonProvider.js
// Unified entry point for epsilon (ε) values used by exploration-based algorithms.
// Provides a constant epsilon, but can be extended later (e.g. linear or exponential decay).

import { EPSILON_DEFAULT } from "@/constants.js";

export class EpsilonProvider {
    constructor() { this.epsilon = EPSILON_DEFAULT; }

    /**
     * Returns the epsilon value for the given step.
     * Currently constant.
     * @param {number} _step - Current time step (unused).
     * @param {number} _totalSteps - Total steps (unused).
     * @returns {number} Epsilon value.
     */

    getEpsilon() {
        return this.epsilon;
    }
    setEpsilon(v) {
        if (typeof v !== "number" || v < 0 || v > 1) throw new Error("epsilon must be 0..1");
        this.epsilon = v;
    }
}

const epsilonProvider = new EpsilonProvider();
export default epsilonProvider;