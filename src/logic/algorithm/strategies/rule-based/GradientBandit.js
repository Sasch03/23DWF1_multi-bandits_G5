import Algorithm from "@/logic/algorithm/Algorithm.js";
import { ALPHA_DEFAULT } from "@/constants.js";

/**
 * Implements the Gradient Bandit algorithm.
 *
 * This algorithm adjusts the selection probability for each arm based on its
 * performance relative to the average reward.
 *
 * It works by comparing an arm's reward to the running average. A reward
 * that is better than average increases the chosen arm's preference score,
 * while a reward that is worse than average decreases it. The scores of all
 * other arms are adjusted in the opposite direction.
 */
export default class GradientBandit extends Algorithm {
    /**
     * Creates an instance of the GradientBandit algorithm.
     *
     * @param {number} numberOfArms - The number of arms in the bandit problem.
     * @param {number} numberOfTries - The total number of trials to run.
     * @param {number} alpha - The learning rate (step-size parameter), which controls how much the preferences are updated after each step.
     */
    constructor({ numberOfArms, numberOfTries, alpha } = {}) {
        super({ numberOfArms, numberOfTries });

        // The nullish coalescing operator (??) provides a default value only if 'alpha' is null or undefined.
        this.alpha = alpha ?? ALPHA_DEFAULT;

        this.preferences = Array(this.numberOfArms).fill(0);

        this.averageReward = 0;
    }

    /**
     * The learning rate (step-size parameter), denoted as α.
     * It controls how significantly the preferences are updated after each trial.
     * @type {number}
     */
    alpha;

    /**
     * An array holding the current preference score for each arm, denoted as H_t(a).
     * These scores are not probabilities themselves but are used to compute them
     * (e.g., via a softmax function).
     * @type {number[]}
     */
    preferences;

    /**
     * The running average of all rewards received so far, denoted as R̄_t.
     * This value serves as the baseline in the update rule to judge an action's
     * performance relative to the average.
     * @type {number}
     */
    averageReward;

    /**
     * Numerically stable softmax over the preferences array.
     * @param {number[]} pref - The array of preference scores (also known as logits).
     * @returns {number[]} An array of probabilities that sum to 1.
     */
    #softmax(pref) {
        const max = Math.max(...pref);
        const exps = pref.map(p => Math.exp(p - max));
        const sum = exps.reduce((s, v) => s + v, 0);
        return exps.map(e => e / sum);
    }

    /**
     * Select an arm by sampling from the softmax distribution of preferences.
     * @returns {number} chosen arm index
     */
    selectArm() {
        const probs = this.#softmax(this.preferences);
        const r = Math.random();
        let cum = 0;
        for (let i = 0; i < probs.length; i++) {
            cum += probs[i];
            if (r < cum) return i;
        }
        // numerical edge case: return last arm
        return this.numberOfArms - 1;
    }

    /**
     * Update method called by the environment with the observed reward for the chosen arm.
     * @param {Object} params - The update information.
     * @param {number} params.arm - Index of the chosen arm (0-based).
     * @param {number} params.observedReward - Observed reward value for the chosen arm.
     */
    update({ arm, observedReward }) {
        if (typeof observedReward !== 'number') {
            throw new Error('GradientBandit.update: observedReward must be a number');
        }

        // Current action probabilities (based on current preferences)
        const probs = this.#softmax(this.preferences);

        // Baseline is the running average up to now (not including current reward)
        const baseline = this.averageReward;
        const diff = observedReward - baseline;

        // Update preferences: chosen arm increases, others decrease
        for (let a = 0; a < this.numberOfArms; a++) {
            if (a === arm) {
                this.preferences[a] += this.alpha * diff * (1 - probs[a]);
            } else {
                this.preferences[a] -= this.alpha * diff * probs[a];
            }
        }

        // Store selection and reward via base class (advances step, increments numberOfPulls)
        super.update({ arm, observedReward });

        // Update running average reward using the incremented step count step was advanced by super.update(),
        // so step is now the new number of observed rewards) guard against divide-by-zero should be unnecessary
        // because super.update() will have advanced step to >= 1
        this.averageReward += (observedReward - this.averageReward) / this.step;
    }

    /**
     * Reset algorithm internal state (preferences and baseline) in addition to base reset.
     */
    reset() {
        super.reset();
        this.preferences.fill(0);
        this.averageReward = 0;
    }

    /**
     * Get current action probabilities derived from the softmax of preferences.
     * Mainly used for analysis, visualization, or testing.
     * @returns {number[]} Current action probabilities (sum to 1).
     */
    getActionProbabilities() {
        return this.#softmax(this.preferences);
    }

    /**
     * Get a shallow copy of the current preference values.
     * Useful for unit tests and debugging.
     * @returns {number[]} Copy of preferences array.
     */
    getPreferences() {
        return [...this.preferences];
    }
}
