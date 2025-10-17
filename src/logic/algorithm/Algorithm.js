/**
 * Abstract base class for k-armed bandit algorithms.
 * Used as a foundation for specific strategies.
 * This class has the purpose to stores common state (arms, pulls, rewards, step history).
 */
export default class Algorithm {
    /**
     * The constructor initializes the algorithm with the specified number of arms and tries.
     *
     * @param {number} numberOfArms - Total number of arms in the bandit problem.
     * @param {number} numberOfTries - Total number of steps (T) for the simulation.
     */
    constructor({ numberOfArms, numberOfTries }) {
        //parameters:
        this.numberOfArms = numberOfArms;
        this.numberOfTries = numberOfTries;
        this.step = 0;
        //logging (only common dates for all type of algorithms):
        this.selectedArms = Array(numberOfTries).fill(null);
        this.numberOfPulls = Array(numberOfArms).fill(0);
        this.observedRewards = Array(numberOfTries).fill(0);
    }

    /**
     * Total number of arms in the bandit problem.
     * @type {number}
     */
    numberOfArms;

    /**
     * Total number of steps (T) for the simulation.
     * @type {number}
     */
    numberOfTries;

    /**
     * Current step.
     * @type {number}
     */
    step;

    /**
     * Array storing the arm selected at each step.
     * selectedArms[t] = index of arm chosen at step t.
     * @type {Array<number|null>}
     */
    selectedArms;

    /**
     * Array storing the number of times each arm was pulled.
     * numberOfPulls[armIndex] = count of pulls for that arm.
     * @type {Array<number>}
     */
    numberOfPulls;

    /**
     * Array of observed rewards at each step.
     * observedRewards[t] = reward obtained at step t.
     * @type {Array<number>}
     */
    observedRewards;

    /**
     * Abstract method — must return index of next selected arm.
     * @returns {number} arm index in [0, numberOfArms).
     */
    selectArm(){
        throw new Error("Calling a method of an abstract class");
    }

    /**
     * Record selected arm and observed reward for current step,
     * then advance t.
     * Validates arm range and prevents double write.
     * @param {number} arm - Index of the selected arm [0, numberOfArms).
     * @param {number} observedReward - Reward observed for the selected arm.
     */
    update({ arm, observedReward }) {
        if (arm < 0 || arm >= this.numberOfArms) throw new Error('bad arm');

        this.selectedArms[this.step] = arm;
        this.observedRewards[this.step] = observedReward;
        this.numberOfPulls[arm] += 1;
        this.step += 1;
    }

    /**
     * Reset all logs and step counter for new run.
     */
    reset() {
        this.step = 0;
        this.selectedArms.fill(null);
        this.observedRewards.fill(null);
        this.numberOfPulls.fill(0);
        //if subclass has extra state — override and call super.reset()
    }

    /**
     * Returns a copy of the array containing the selected arm indices for each step.
     *
     * @returns {(number|null)[]} Array of selected arm indices; null if no arm was selected at a step.
     */
    getSelectedArms() {
        return this.selectedArms.slice();
    }

    /**
     * Returns a copy of the array containing the observed rewards for each step.
     *
     * @returns {number[]} Array of observed rewards at each step.
     */
    getObservedRewards() {
        return this.observedRewards.slice();
    }

    /**
     * Returns a copy of the array containing the number of times each arm has been pulled.
     *
     * @returns {number[]} Array where each index corresponds to an arm and its value is the pull count.
     */
    getNumberOfPulls() {
        return this.numberOfPulls.slice();
    }

    /**
     * Returns the current step index in the simulation.
     *
     * @returns {number} Current step.
     */
    getStep() {
        return this.step;
    }
}

