/**
 * Represents an enumeration with the choosable algorithm typs.
 * @type {Readonly<{GREEDY: string, EPSILON_GREEDY: string}>}
 */
export const AlgorithmTyp = Object.freeze({
    GREEDY: "Greedy",
    EPSILON_GREEDY: "Epsilon-Greedy",
    GRADIENT_BANDIT: "Gradient-Bandit",
    UPPER_CONFIDENCE_BOUND: "Upper-Confidence-Bound"
});