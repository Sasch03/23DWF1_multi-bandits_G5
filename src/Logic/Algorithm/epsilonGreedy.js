//
export default class Algorithm {
    constructor({ armCount, tryCount }) {
        if (!Number.isInteger(armCount) || armCount <= 0) throw new Error('armCount>0');
        if (!Number.isInteger(tryCount)  || tryCount  <= 0) throw new Error('tryCount>0');
        this.step = 0; // текущий шаг t
        // history[a][t] = reward | null
        this.history = Array.from({ length: armCount }, () => Array(tryCount).fill(null));
    }