/**
 * Abstract base class for k-armed bandit algorithms.
 * Purpose: keep a fixed-size history of selected arms per step (selectedArms[t] = arm)
 * and define the interface:
 *  - selectArm(): choose next arm using past observations only
 *  - update(): record result and advance step
 *
 * Literature:
 *  - Richard S. Sutton, Andrew G. Barto. "Reinforcement Learning: An Introduction", 2nd Ed., MIT Press, 2018.
 *  - Gangan, S., Soni, M., & Patel, D. (2021).
 *    "Survey of multi-armed bandit algorithms applied to recommendation systems."
 *    Int. J. of Computer Applications Technology and Research (IJCATR).
 */

export default class Algorithm {
    /**
     * @param {Object} params
     * @param {number} params.numberOfArms - Number of arms (k), valid indices: 0..k-1.
     * @param {number} params.numberOfTries - Total number of steps (T).
     */
    constructor({ numberOfArms, numberOfTries }) {
        //parameters:
        this.numberOfArms = numberOfArms;
        this.numberOfTries = numberOfTries;
        this.step = 0;                          // current step t (0..T-1)
        //logging (only common dates for all type of algorithms):
        this.selectedArms = Array(numberOfTries).fill(null);    // selectedArms[T] -> selectedArm, which arm was selected at each step t
        this.numberOfPulls = Array(numberOfArms).fill(0);       // counter - how many times each arm has been pulled
        this.observedRewards = Array(numberOfTries).fill(0);    // history: observed rewards at each step t
    }

    /**
     * Abstract method — must return index of next selected arm.
     * @returns {number} arm index in [0, numberOfArms)
     */
    selectArm()
    { throw new Error('abstract'); }

    /**
     * Record selected arm and observed reward for current step,
     * then advance t.
     * Validates arm range and prevents double write.
     * @param {Object} p
     * @param {number} p.arm - Arm index in [0, numberOfArms).
     * @param {number} p.observedReward - Observed reward.
     */
    update({ arm, observedReward }) {
        if (arm < 0 || arm >= this.numberOfArms) throw new Error('bad arm');
        if (this.step >= this.numberOfTries)     throw new Error('out of tries');
        if (this.selectedArms[this.step] !== null) throw new Error('already recorded');

        this.selectedArms[this.step] = arm;
        this.observedRewards[this.step] = observedReward;
        this.numberOfPulls[arm] += 1;
        this.step += 1;
    }

    /** Reset all logs and step counter for new run. */
    reset() {
        this.step = 0;
        this.selectedArms.fill(null);
        this.observedRewards.fill(null);
        this.numberOfPulls.fill(0);
        //if subclass has extra state — override and call super.reset()
    }

    // getters (read-only copies)
    getSelectedArms() {
        return this.selectedArms.slice();
    }

    getObservedRewards() {
        return this.observedRewards.slice();
    }

    getNumberOfPulls() {
        return this.numberOfPulls.slice();
    }

    getStep() {
        return this.step;
    }
}

