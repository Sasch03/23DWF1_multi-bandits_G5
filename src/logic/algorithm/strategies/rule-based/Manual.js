// src/logic/algorithm/strategies/manual/ManualAlgorithm.js
// Manual policy: UI/user decides which arm to pull next.
// Usage: algo.setNextArm(i); const a = algo.selectArm(); envReward -> algo.update({arm:a, observedReward:r})

import Algorithm from "@/logic/algorithm/Algorithm.js";

/**
 * Manual bandit algorithm.
 * Arm selection is controlled externally via setNextArm().
 * Useful also for debugging.
 */

export default class ManualAlgorithm extends Algorithm {
    constructor(opts) {
        super(opts);
        /** @private @type {?number} arm chosen manually for next step */
        this._nextArm = null;
    }

    /**
     * Set the arm to be used on the next step.
     * @param {number} arm - Must be in [0, numberOfArms).
     */
    setNextArm(arm) {
        if (!(arm >= 0 && arm < this.numberOfArms)) throw new Error("bad arm");
        this._nextArm = arm;
    }

    /**
     * Return the arm set via setNextArm().
     * Consumes the stored value (resets it to null).
     * @returns {number} chosen arm index
     */
    selectArm() {
        if (this._nextArm == null) throw new Error("next arm not set");
        const arm = this._nextArm;
        this._nextArm = null; // consume once
        return arm;
    }

    /** Reset internal state and clear pending manual arm. */
    reset() {
        super.reset();
        this._nextArm = null;
    }
}
