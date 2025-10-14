// GreedyAlgorithm is technically just ε-Greedy with ε = 0, always select the arm with the highest estimated reward.

import ValueBasedAlgorithm from "@/logic/algorithm/ValueBasedAlgorithm.js";

/**
 * Greedy algorithm (special case of ε-Greedy with ε = 0).
 *
 * Always chooses the arm with the maximum expected value.
 * Exists as a separate class for clarity and clean hierarchy.
 */
export default class Greedy extends ValueBasedAlgorithm {}