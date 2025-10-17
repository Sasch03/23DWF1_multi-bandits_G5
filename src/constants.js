// === Global constants used across the project ===
/**
 * Default number of arms for a new bandit game.
 * Used when no custom number of arms is specified by the user.
 *
 * @type {number}
 */
export const DEFAULT_ARMS = 4;

/**
 * Default number of iterations (trials) for a new bandit game.
 * Used when no custom number of trials is specified by the user.
 *
 * @type {number}
 */
export const DEFAULT_ITERATIONS = 10;

// --- Gaussian standard deviation ---
/**
 * The number of Gaussian values generated for each arm per trial.
 * This number of draws is also performed per draw.
 * @type {number}
 */
export const NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM = 50
/**
 * The central mean around which the true means of each bandit arm are generated.
 * A value of 0 creates a neutral baseline with both positive (gain) and negative (loss) arms.
 * @type {number}
 */
export const MEAN_OF_MEANS = 10.0;
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
export const GAUSSIAN_STD_DEV = 60.0;

// --- Epsilon ---
/**
 * Default value for epsilon used in epsilon-greedy algorithms.
 * Determines the probability of exploring a random arm instead of exploiting
 * the current best-known arm.
 *
 * @type {number}
 */
export const EPSILON_DEFAULT = 0.1;

// --- UCB ---
/**
 * Exploration coefficient for UCB1.
 * Controls how strongly unexplored arms are favored.
 * Typical values: 1–3.
 * @type {number}
 */
export const UCB_C = 2;

// --- Gradient Bandit ---
/**
 * The default value for the learning rate (alpha) hyperparameter.
 *
 * This value is used in the GradientBandit algorithm when no specific alpha is provided.
 * @type {number}
 */
export const ALPHA_DEFAULT = 0.1;