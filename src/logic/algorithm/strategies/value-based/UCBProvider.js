import { UCB_C } from "@/constants.js";

/**
 * Supplies the exploration coefficient `c` used in UCB1 scoring:
 * score = Q[a] + c * sqrt((2 * ln t) / N[a]).
 */
class UcbCProvider {
    /**
     * Return the coefficient c for the current step.
     * @param {number} step - Current step (unused, placeholder for future dynamic logic).
     * @param {number} total - Total steps (unused).
     * @returns {number} exploration coefficient c.
     */
    getC(step, total) {
        void step; void total;
        return UCB_C;
    }
}
export default new UcbCProvider();
