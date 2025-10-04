// GreedyAlgorithm is technically just ε-Greedy with ε = 0,
// so this subclass does not override any logic.
// We still keep it as an explicit class for clarity:
//   - preserves a clean algorithm hierarchy (Greedy listed alongside other strategies)
//   - makes the algorithm type explicit for configuration/UI (no need to "hack" ε = 0)

import ValueBasedAlgorithm from "@/logic/algorithm/ValueBasedAlgorithm.js";

export class Greedy extends ValueBasedAlgorithm {}