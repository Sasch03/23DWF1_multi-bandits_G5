// === Global constants used across the project ===

// --- Default Game Settings ---
export const DEFAULT_ARMS = 5;
export const DEFAULT_ITERATIONS = 10;

// --- Epsilon / Exploration ---
export const EPSILON_DEFAULT = 0.1;
//export const EPSILON_MIN = 0.01;
export const EPSILON_MODES = {
    CONSTANT: "constant",
    LINEAR: "linear",
    EXP: "exp",
};