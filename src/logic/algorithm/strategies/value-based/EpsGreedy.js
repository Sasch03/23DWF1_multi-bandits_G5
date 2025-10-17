import ValueBasedAlgorithm from "@/logic/algorithm/ValueBasedAlgorithm.js";
import epsilonProvider from "@/logic/algorithm/strategies/value-based/EpsilonProvider.js";

/**
 * Balances exploration (random choice with prob. epsilon) and exploitation (best arm).
 * Uses EpsilonProvider to obtain epsilon per step.
 */
export default class EpsGreedy extends ValueBasedAlgorithm {
    /**
     * @param {Object} opts - Algorithm parameters (numberOfArms, numberOfTries, etc.).
     * @param {EpsilonProvider} [provider=epsilonProvider] - Source of epsilon values.
     */
    constructor(opts, provider = epsilonProvider) {
        super(opts);
        this.epsSvc = provider;
    }

    /**
     * Shared epsilon provider.
     * @type {EpsilonProvider}
     */
    epsSvc;

    /**
     * Choose arm according to epsilon-greedy rule.
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
