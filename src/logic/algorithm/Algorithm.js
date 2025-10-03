/*Abstract base class for k-armed bandit algorithms.
 * Purpose: keep a fixed-size history of selected arms per corresponding steps (selectedArms[t] = arm)
 * and define the contract:
 *   - selectArm(): choose the next arm using past observations only
 *   - update(selectedArms[T], t): store the observed number of arm for step t and update t
 * Concrete algorithms (e.g., Greedy, Epsilon-Greedy, (Manual????) ) extend this class.
 *
 * Literature:
 * Richard S. Sutton, Andrew G. Barto.
 * Reinforcement Learning: An Introduction (2nd Edition, MIT Press, 2018).
 * Gangan, S., Soni, M., & Patel, D. (2021).
 * Survey of multi-armed bandit algorithms applied to recommendation systems.
 * In International Journal of Computer Applications Technology and Research (IJCATR).
 */


export default class Algorithm {
    constructor({ numberOfArms, numberOfTries }) {
        //parameters:
        this.numberOfArms = numberOfArms;       // number of arms (k), valid indices: 0..k-1
        this.numberOfTries = numberOfTries;     // T, total fixed count of steps
        this.step = 0;                          // current step t (0..T-1)
        //logging (only common dates for all algorithms):
        this.selectedArms = Array(numberOfTries).fill(null);    // selectedArms[T] -> selectedArm, which arm was selected at each step t
        this.numberOfPulls = Array(numberOfArms).fill(0);       // counter - how many times each arm has been pulled
        this.observedRewards = Array(numberOfTries).fill(0);    // history: observed rewards at each step t
    }


    /* Abstract method, that returns the index of the next selected arm. */
    /*    @returns {number} index in [0, numberOfArms) */
    selectArm()
    { throw new Error('abstract'); }


    /**
     * Record the selected arm for the current step and update t (make t=t+1).
     * Validates arm range, step bounds, and prevents double-writing.
     * @param {{arm:number}} param - Arm index in [0, numberOfArms).
     * @throws {Error} If arm is out of range, no tries left, or already recorded.
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


    /** Reset algorithm state: clear history and step for a new game. */
    reset() {
        this.step = 0;
        this.selectedArms.fill(null);
        this.observedRewards.fill(null);
        this.numberOfPulls.fill(0);
        //if subclass has extra state — override and call super.reset()
    }
}

