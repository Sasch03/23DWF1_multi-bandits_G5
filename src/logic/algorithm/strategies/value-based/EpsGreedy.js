// EpsGreedy.js
// ε-greedy algorithm that retrieves epsilon values from the global EpsilonProvider.
// At the moment, exploration probability is constant, but the service can be extended later.

import ValueBasedAlgorithm from "@/logic/algorithm/ValueBasedAlgorithm.js";
import epsilonProvider from "@/logic/algorithm/strategies/value-based/EpsilonProvider.js";

/**
 * ε-Greedy algorithm.
 * Balances exploration (random choice with prob. ε) and exploitation (best arm).
 * Uses EpsilonProvider to obtain ε per step.
 */
export default class EpsGreedy extends ValueBasedAlgorithm {
    /**
     * @param {Object} opts - Algorithm parameters (numberOfArms, numberOfTries, etc.).
     * @param {EpsilonProvider} [provider=epsilonProvider] - Source of ε values.
     */
    constructor(opts, provider = epsilonProvider) {
        super(opts);
        /** @type {EpsilonProvider} - Shared epsilon provider. */
        this.epsSvc = provider;
    }

    /**
     * Choose arm according to ε-Greedy rule.
     * @returns {number} selected arm index.
     */
    selectArm() {
        const eps = this.epsSvc.getEpsilon(this.step, this.numberOfTries);
        if (Math.random() < eps) {
            // Exploration: choose a random arm.
            return (Math.random() * this.numberOfArms) | 0;
        }
        // Exploitation: choose the best-known arm.
        return super.selectArm();
    }
}
