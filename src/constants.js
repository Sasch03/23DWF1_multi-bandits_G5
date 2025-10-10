// === Global constants used across the project ===

// --- Gaussian standard deviation ---
/**
 * The central mean around which the true means of each bandit arm are generated.
 * A value of 0 creates a neutral baseline with both positive (gain) and negative (loss) arms.
 * @type {number}
 */
export const MEAN_OF_MEANS = 0;
/**
 * The standard deviation for generating the true means of each arm (the "signal").
 * This controls how different the arms are from each other. 50 creates a significant spread.
 * @type {number}
 */
export const GAUSSIAN_MEAN_SPREAD_STD_DEV = 50.0;
/**
 * The standard deviation for the rewards drawn from a single arm (the "noise").
 * This controls the volatility of results. Setting it equal to the signal (50)
 * creates a balanced problem where the noise is challenging but doesn't completely
 * hide the underlying signal.
 * @type {number}
 */
export const GAUSSIAN_STD_DEV = 50.0;

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

// --- Gradient Bandit ---
/**
 * The default value for the learning rate (alpha) hyperparameter.
 *
 * This value is used in the GradientBandit algorithm when no specific alpha is provided.
 * @type {number}
 */
export const ALPHA_DEFAULT = 0.1;