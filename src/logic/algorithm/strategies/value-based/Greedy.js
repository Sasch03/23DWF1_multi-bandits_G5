import ValueBasedAlgorithm from "@/logic/algorithm/ValueBasedAlgorithm.js";

/**
 * Greedy algorithm (special case of epsilon-Greedy with epsilon = 0).
 * Always chooses the arm with the maximum expected value.
 * Exists as a separate class for clarity and clean hierarchy.
 */
export default class Greedy extends ValueBasedAlgorithm {}