/**
 * Abstract base class for k-armed bandit algorithms.
 * Purpose: keep a fixed-size history of selected arms per corresponding steps (selectedArms[t] = arm)
 * and define the contract:
 *   - selectArm(): choose the next arm using past observations only
 *   - updateHistory (selectedArms[T], t): store the observed number of arm for step t, update t
 * Concrete algorithms (e.g., Greedy, Epsilon-Greedy, (Manual????) ) extend this class.
 */

export default class Algorithm {
    constructor({ numberOfArms, numberOfTries }) {
        this.numberOfArms = numberOfArms;       // number of arms (k), valid indices: 0..k-1
        this.numberOfTries = numberOfTries;     // T, total fixed count of steps
        this.step = 0;                          // current step t (0..T-1)
        this.selectedArms = Array(numberOfTries).fill(null); // selectedArms[T] -> selectedArm
        // to do...
    }

    selectArm() { throw new Error('abstract'); }

    // to do...
    // updateHistory({ arm })
}