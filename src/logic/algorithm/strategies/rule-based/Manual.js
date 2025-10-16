import Algorithm from "@/logic/algorithm/Algorithm.js";

/**
 * Manual bandit algorithm.
 * Arm selection is controlled externally via setNextArm().
 * Useful also for debugging.
 */
export default class ManualAlgorithm extends Algorithm {
    /**
     * @private @type {?number} arm chosen manually for next step.
     */
    #nextArm = null;

    /**
     * Reset internal state and clear pending manual arm.
     */
    reset() {
        super.reset();
        this.#nextArm = null;
    }

    /**
     * Set the arm to be used on the next step.
     * @param {number} arm - Must be in [0, numberOfArms).
     */
    setNextArm(arm) {
        this.#nextArm = arm;
    }

    /**
     * Return the arm set via setNextArm().
     * Consumes the stored value (resets it to null).
     * @returns {number} chosen arm index.
     */
    selectArm() {
        if (this.#nextArm === null || this.#nextArm === undefined) {
            throw new Error('next arm not set');
        }
        const arm = this.#nextArm;
        this.#nextArm = null; // consume once: require new setNextArm() before next selectArm()
        return arm;
    }
}
