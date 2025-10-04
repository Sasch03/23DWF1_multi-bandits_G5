// src/logic/algorithm/strategies/manual/ManualAlgorithm.js
// Manual policy: UI/user decides which arm to pull next.
// Usage: algo.setNextArm(i); const a = algo.selectArm(); envReward -> algo.update({arm:a, observedReward:r})

import Algorithm from "@/logic/algorithm/Algorithm.js";

export default class ManualAlgorithm extends Algorithm {
    constructor(opts) {
        super(opts);
        this._nextArm = null;
    }

    /** Tell the policy which arm to pick on the next step. */
    setNextArm(arm) {
        if (!(arm >= 0 && arm < this.numberOfArms)) throw new Error("bad arm");
        this._nextArm = arm;
    }

    /** Returns the arm previously set via setNextArm(). */
    selectArm() {
        if (this._nextArm == null) throw new Error("next arm not set");
        const arm = this._nextArm;
        this._nextArm = null; // consume once
        return arm;
    }

    reset() {
        super.reset();
        this._nextArm = null;
    }
}
