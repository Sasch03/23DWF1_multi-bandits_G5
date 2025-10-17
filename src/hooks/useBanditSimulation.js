import { useState, useRef, useEffect } from "react";
import CurrentGame from "@/logic/CurrentGame.js";
import { DistributionTyp } from "@/logic/enumeration/DistributionTyp.js";
import ManualAlgorithm from "@/logic/algorithm/strategies/rule-based/Manual.js";
import Greedy from "@/logic/algorithm/strategies/value-based/Greedy.js";
import EpsGreedy from "@/logic/algorithm/strategies/value-based/EpsGreedy.js";
import UCB from "@/logic/algorithm/strategies/value-based/UCB.js";
import GradientBandit from "@/logic/algorithm/strategies/gradient-based/GradientBandit.js";
import StrategyRewardHistory from "@/logic/StrategyRewardHistory.js";
import { DEFAULT_ARMS, DEFAULT_ITERATIONS, ALPHA_DEFAULT, NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM } from "@/constants.js";

/**
 * Custom React hook to manage a multi-armed bandit simulation.
 *
 * Provides state management, algorithm initialization, arm pulls,
 * reward tracking, logging, and winner calculation.
 *
 * @param {number} [initialArms=DEFAULT_ARMS] - Initial number of arms in the bandit.
 * @param {number} [initialIterations=DEFAULT_ITERATIONS] - Maximum number of iterations/pulls.
 *
 * @returns {object} Simulation state and control functions.
 */
export function useBanditGame(initialArms = DEFAULT_ARMS, initialIterations = DEFAULT_ITERATIONS) {

    // ================= States =================
    const [arms, setArms] = useState(Array.from({ length: initialArms }, (_, i) =>
        ({ id: i, pulls: 0, lastReward: 0 })));
    const [iterations, setIterations] = useState(initialIterations);
    const [totalPulls, setTotalPulls] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [logs, setLogs] = useState([]);
    const [running, setRunning] = useState(false);
    const [showPlot, setShowPlot] = useState(false);
    const [rewardTable, setRewardTable] = useState([]);
    const [game, setGame] = useState(null);
    const [type, setType] = useState(DistributionTyp.BERNOULLI);
    const [winner, setWinner] = useState(null);
    const [lang, setLang] = useState("de");


    // ================= Refs =================
    const gameRef = useRef(null);
    const historyRef = useRef(new StrategyRewardHistory());
    const manualObservedRewardsRef = useRef([]);
    const algorithmsRef = useRef({});


    // ================= Effects =================
    useEffect(() => {
        if (totalPulls >= iterations && running) setShowPlot(true);
    }, [totalPulls, iterations, running]);

    useEffect(() => {
        if (!running) return;
        updateWinner();
    }, [totalPulls, running]);


    // ================= Helper Functions =================

    /**
     * Safely update an algorithm instance with a new observed reward.
     * @param {object} algo - Algorithm instance with update/getStep methods.
     * @param {number} armIndex - Index of pulled arm.
     * @param {number} reward - Observed reward for the arm.
     * @returns {object|null} Step info or error object.
     */
    const safeUpdateAlgorithm = (algo, armIndex, reward) => {
        if (!algo || typeof algo.update !== "function") return null;
        try {
            algo.update({ arm: armIndex, observedReward: reward });
            return algo.getStep();
        } catch (err) {
            console.warn("Algorithm update failed:", err);
            return { error: err };
        }
    };

    /**
     * Adds a log entry for a timestep and reward.
     *
     * @param {number} timestep - Current timestep / pull count.
     * @param {number} armIndex - Index of the arm that was pulled.
     * @param {number} reward - Observed reward for that arm.
     */
    const addLog = (timestep, armIndex, reward) => {
        const roundedReward = game?.chosenDistribution === "Gaussian" ? reward.toFixed(2) : reward;
        setLogs(prev => [`Timestep: ${timestep}, Arm: ${armIndex + 1}, Reward: ${roundedReward}`, ...prev]);
    };

    /**
     * Updates the state of a single arm after a pull.
     *
     * @param {number} index - Index of the arm to update.
     * @param {number} reward - Observed reward to record.
     */
    const updateArm = (index, reward) => {
        setArms(prev => prev.map((a, i) =>
            i === index ? { ...a, pulls: a.pulls + 1, lastReward: reward } : a
        ));
    };

    /**
     * Records a reward from manual pulls into the history.
     *
     * @param {number} reward - Reward obtained manually.
     */
    const recordManualReward = (reward) => {
        manualObservedRewardsRef.current.push(reward);
        historyRef.current.addReward(
            historyRef.current.manualRewards, { observedRewards: manualObservedRewardsRef.current }
        );
    };

    /**
     * Calculates which algorithm(s) currently have the highest cumulative reward.
     */
    const updateWinner = () => {
        const cumulativeRewards = {
            Manual: manualObservedRewardsRef.current.reduce((a, b) => a + b, 0),
            Greedy: algorithmsRef.current.greedy.getObservedRewards().reduce((a, b) => a + b, 0),
            "Epsilon-Greedy": algorithmsRef.current.epsilon.getObservedRewards().reduce((a, b) => a + b, 0),
            "Gradient Bandit": algorithmsRef.current.gradientBandit.getObservedRewards().reduce((a, b) => a + b, 0),
            UCB: algorithmsRef.current.ucb.getObservedRewards().reduce((a, b) => a + b, 0),
        };

        const maxReward = Math.max(...Object.values(cumulativeRewards));
        const winners = Object.entries(cumulativeRewards)
            .filter(([, reward]) => reward === maxReward)
            .map(([name]) => name);

        setWinner(winners);
    };

    // ================= Game Control Functions =================

    /**
     * Initializes all algorithm instances for the current game.
     */
    const initializeAlgorithms = () => {
        const manualAlgo = new ManualAlgorithm({ numberOfArms: arms.length, numberOfTries: iterations });
        manualAlgo.reset();

        const greedyAlgo = new Greedy({ numberOfArms: arms.length, numberOfTries: iterations });
        greedyAlgo.reset();

        const epsAlgo = new EpsGreedy({ numberOfArms: arms.length, numberOfTries: iterations });
        epsAlgo.reset();

        const gradientAlgo = new GradientBandit({ numberOfArms: arms.length, numberOfTries: iterations, alpha: ALPHA_DEFAULT });
        gradientAlgo.reset();

        const ucbAlgo = new UCB({ numberOfArms: arms.length, numberOfTries: iterations });
        ucbAlgo.reset();

        algorithmsRef.current = { manual: manualAlgo, greedy: greedyAlgo, epsilon: epsAlgo, gradientBandit: gradientAlgo, ucb: ucbAlgo };
    };

    /**
     * Simulates a full run of each algorithm based on the game table.
     *
     * @param {CurrentGame} gameInstance - The current game object with reward table.
     */
    const simulateAlgorithmHistory = (gameInstance) => {
        const table = gameInstance.tableOfRewards;

        const simulateSingleAlgorithm = (algo, selectArmFn) => {
            for (let t = 0; t < iterations; t++) {
                const selectedArm = selectArmFn();
                if (gameInstance.chosenDistribution === "Gaussian") {
                    for (let i = 0; i < NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM; i++) {
                        const reward = table[selectedArm][t * NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM + i];
                        algo.update({ arm: selectedArm, observedReward: reward });
                    }
                } else {
                    const reward = table[selectedArm][t];
                    algo.update({ arm: selectedArm, observedReward: reward });
                }
            }
        };

        simulateSingleAlgorithm(algorithmsRef.current.greedy, () => algorithmsRef.current.greedy.selectArm());
        simulateSingleAlgorithm(algorithmsRef.current.epsilon, () => algorithmsRef.current.epsilon.selectArm());
        simulateSingleAlgorithm(algorithmsRef.current.gradientBandit, () => algorithmsRef.current.gradientBandit.selectArm());
        simulateSingleAlgorithm(algorithmsRef.current.ucb, () => algorithmsRef.current.ucb.selectArm());

        // sync history
        historyRef.current.addReward(historyRef.current.greedyRewards, { observedRewards: algorithmsRef.current.greedy.getObservedRewards() });
        historyRef.current.addReward(historyRef.current.epsilonGreedyRewards, { observedRewards: algorithmsRef.current.epsilon.getObservedRewards() });
        historyRef.current.addReward(historyRef.current.GradientBanditRewards, { observedRewards: algorithmsRef.current.gradientBandit.getObservedRewards() });
        historyRef.current.addReward(historyRef.current.UpperConfidenceBoundRewards, { observedRewards: algorithmsRef.current.ucb.getObservedRewards() });
    };

    /**
     * Resets the state of arms, pulls, rewards, and logs.
     */
    const resetState = () => {
        setArms(prev => prev.map(a => ({ ...a, pulls: 0, lastReward: 0 })));
        setTotalPulls(0);
        setTotalReward(0);
        setLogs([]);
        setShowPlot(false);
    };

    /**
     * Start a new bandit simulation.
     * Initializes the game, the reward table, and the manual algorithm.
     */
    const startGame = () => {
        if (running) return;

        resetState();

        const newGame = new CurrentGame();
        newGame.setNumberOfArms(arms.length);
        newGame.setNumberOfTries(iterations);
        newGame.setChosenDistribution(type);
        newGame.createTable();

        initializeAlgorithms();
        simulateAlgorithmHistory(newGame);

        // initialize manual observed rewards
        newGame.algorithm = algorithmsRef.current.manual;
        gameRef.current = newGame;
        setGame(newGame);
        setRewardTable(newGame.tableOfRewards);
        setRunning(true);
    };

    /**
     * Handles a pull of a Gaussian-distributed arm.
     *
     * @param {number} armIndex - Index of the arm to pull.
     */
    const handleGaussianPull = (armIndex) => {
        let totalRewardForArm = 0;
        const startIndex = arms[armIndex].pulls * NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM;

        for (let i = 0; i < NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM; i++) {
            const reward = rewardTable[armIndex][startIndex + i];
            totalRewardForArm += reward;
            safeUpdateAlgorithm(algorithmsRef.current.manual, armIndex, reward);
            recordManualReward(reward);
        }

        const avgReward = totalRewardForArm / NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM;
        updateArm(armIndex, avgReward);
        setTotalReward(prev => prev + totalRewardForArm);
        setTotalPulls(prev => prev + 1);
        addLog(totalPulls + 1, armIndex, totalRewardForArm);
    };

    /**
     * Handles a pull of a Bernoulli-distributed arm.
     *
     * @param {number} armIndex - Index of the arm to pull.
     */
    const handleBernoulliPull = (armIndex) => {
        const reward = rewardTable[armIndex][arms[armIndex].pulls];
        const timestep = safeUpdateAlgorithm(algorithmsRef.current.manual, armIndex, reward) || totalPulls + 1;

        updateArm(armIndex, reward);
        setTotalReward(prev => prev + reward);
        setTotalPulls(prev => prev + 1);
        addLog(timestep, armIndex, reward);
        recordManualReward(reward);
    };

    /**
     * Handles a pull depending on the current distribution type.
     *
     * @param {number} armIndex - Index of the arm to pull.
     */
    const handlePull = (armIndex) => {
        if (!running || !gameRef.current || rewardTable.length === 0) return;
        if (totalPulls >= iterations || arms[armIndex].pulls >= iterations) return;

        if (gameRef.current.chosenDistribution === "Gaussian") {
            handleGaussianPull(armIndex);
        } else {
            handleBernoulliPull(armIndex);
        }
    };

    /**
     * Sets the number of arms dynamically.
     *
     * @param {number} count - New number of arms.
     */
    const setArmCount = (count) => {
        const current = arms.length;
        const newArms = count > current
            ? [...arms, ...Array.from({ length: count - current }, (_, i) => ({ id: current + i, pulls: 0, lastReward: 0 }))]
            : arms.slice(0, count);
        setArms(newArms);
    };

    /**
     * Resets the entire simulation including algorithms, rewards, and logs.
     */
    const resetAll = () => {
        if (algorithmsRef.current.manual?.reset) algorithmsRef.current.manual.reset();
        setArms(Array.from({ length: initialArms }, (_, i) => ({ id: i, pulls: 0, lastReward: 0 })));
        setIterations(initialIterations);
        setTotalPulls(0);
        setTotalReward(0);
        setLogs([]);
        setRewardTable([]);
        setRunning(false);
        setShowPlot(false);
        gameRef.current = null;
        setGame(null);
        historyRef.current.reset();
        manualObservedRewardsRef.current = [];

        console.log("Simulation stopped and reset.");
    };

    /**
     * Returns cumulative rewards of all algorithms.
     *
     * @returns {object} Object containing arrays of cumulative rewards per algorithm.
     */
    const getCumulativeRewards = () => ({
        manualRewards: [...historyRef.current.manualRewards],
        greedyRewards: [...historyRef.current.greedyRewards],
        epsilonGreedyRewards: [...historyRef.current.epsilonGreedyRewards],
        UpperConfidenceBoundRewards: [...historyRef.current.UpperConfidenceBoundRewards],
        GradientBanditRewards: [...historyRef.current.GradientBanditRewards],
    });

    return {
        type, setType,
        arms,
        iterations,
        setIterations,
        totalPulls,
        totalReward,
        logs,
        running,
        showPlot,
        setShowPlot,
        game,
        winner,
        lang,
        setLang,
        getCumulativeRewards,
        startGame,
        handlePull,
        setArmCount,
        resetAll,
    };
}
