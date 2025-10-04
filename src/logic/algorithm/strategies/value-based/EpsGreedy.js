// EpsGreedy.js
// ε-greedy algorithm that retrieves epsilon values from the global EpsilonService.
// At the moment, exploration probability is constant, but the service can be extended later.

import ValueBasedAlgorithm from "@/logic/algorithm/ValueBasedAlgorithm.js";
import epsilonProvider from "@/logic/algorithm/strategies/value-based/EpsilonProvider.js";


export default class EpsGreedy extends ValueBasedAlgorithm {
    constructor(opts, provider = epsilonProvider) {
        super(opts);
        /** @type {EpsilonProvider} - Shared epsilon provider. */
        this.epsSvc = provider;
    }

    /** Selects an arm according to ε-greedy strategy. */
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
