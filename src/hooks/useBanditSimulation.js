import { useState, useRef, useEffect } from "react";
import CurrentGame from "@/logic/CurrentGame.js";
import { DistributionTyp } from "@/logic/enumeration/DistributionTyp.js";
import ManualAlgorithm from "@/logic/algorithm/strategies/rule-based/Manual.js";
import { Greedy } from "@/logic/algorithm/strategies/value-based/Greedy.js";
import EpsGreedy from "@/logic/algorithm/strategies/value-based/EpsGreedy.js";
import { DEFAULT_ARMS, DEFAULT_ITERATIONS, ALPHA_DEFAULT } from "@/constants.js";
import StrategyRewardHistory from "@/logic/StrategyRewardHistory.js";
import GradientBandit from "@/logic/algorithm/strategies/gradient-based/GradientBandit.js";
import UCB from "@/logic/algorithm/strategies/value-based/UCB.js";

/**
 * Custom hook to manage a multi-armed bandit simulation.
 * Handles game state, arm pulls, total reward, logs, and algorithm updates.
 *
 * @param {number} [initialArms=DEFAULT_ARMS] - Initial number of arms in the bandit.
 * @param {number} [initialIterations=DEFAULT_ITERATIONS] - Maximum number of iterations/pulls.
 * @returns {object} - Returns the current state and actions to control the simulation.
 */
export function useBanditGame(initialArms = DEFAULT_ARMS, initialIterations = DEFAULT_ITERATIONS) {

    // === State variables ===
    const [arms, setArms] = useState(
        Array.from({ length: initialArms }, (_, i) => ({ id: i, pulls: 0, lastReward: 0 }))
    );
    const [iterations, setIterations] = useState(initialIterations);
    const [totalPulls, setTotalPulls] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [logs, setLogs] = useState([]);
    const [running, setRunning] = useState(false);
    const [showPlot, setShowPlot] = useState(false);
    const [rewardTable, setRewardTable] = useState([]);
    const [game, setGame] = useState(null);
    const [type, setType] = useState(DistributionTyp.BERNOULLI);
    const gameRef = useRef(null);
    const historyRef = useRef(new StrategyRewardHistory());
    const manualObservedRewardsRef = useRef([]);
    const algorithmsRef = useRef({});

    // === Effects ===
    /**
     * Automatically shows the plot when total pulls reach or exceed the iteration limit.
     */
    useEffect(() => {
        if (totalPulls >= iterations && running) setShowPlot(true);
    }, [totalPulls, iterations, running]);


    // === Helper functions ===

    /**
     * Safely update the algorithm with the observed reward for a given arm.
     * Handles exceptions and returns the timestep.
     *
     * @param {object} algo - The algorithm instance (must have update() and getStep()).
     * @param {number} armIdx - Index of the arm that was pulled.
     * @param {number} reward - Reward obtained from the arm pull.
     * @returns {number|object} - Returns the timestep or an error object.
     */
    const safeUpdateAlgorithm = (algo, armIdx, reward) => {
        if (!algo || typeof algo.update !== "function") return null;
        try {
            algo.update({ arm: armIdx, observedReward: reward });
            return algo.getStep();
        } catch (err) {
            console.warn("Algorithm update failed:", err);
            return { error: err };
        }
    };

    /**
     * Add a log entry for a single arm pull.
     *
     * @param {number} timestep - Current timestep of the simulation.
     * @param {number} idx - Index of the arm pulled.
     * @param {number} reward - Reward obtained from the arm pull.
     */
    const addLog = (timestep, idx, reward) => {
        const roundedReward =
            game?.chosenDistribution === "Gaussian" ? reward.toFixed(2) : reward;

        setLogs(prev => [
            `Timestep: ${timestep}, Arm: ${idx + 1}, Reward: ${roundedReward}`,
            ...prev
        ]);
    };


    /**
     * Update the state of a single arm after a pull.
     *
     * @param {number} idx - Index of the arm.
     * @param {number} reward - Reward received for the pull.
     */
    const updateArm = (idx, reward) => {
        setArms(prev => prev.map((a, i) =>
            i === idx ? { ...a, pulls: a.pulls + 1, lastReward: reward } : a
        ));
    };


    // === Game control functions ===

    /**
     * Reset all internal state variables for a new simulation
     * without touching the game instance itself.
     */
    const resetState = () => {
        setArms(prev => prev.map(a => ({ ...a, pulls: 0, lastReward: 0 })));
        setTotalPulls(0);
        setTotalReward(0);
        setLogs([]);
        setShowPlot(false);
    };

    const getCumulativeRewards = () => ({
        manualRewards: [...historyRef.current.manualRewards],
        greedyRewards: [...historyRef.current.greedyRewards],
        epsilonGreedyRewards: [...historyRef.current.epsilonGreedyRewards],
        UpperConfidenceBoundRewards: [...historyRef.current.UpperConfidenceBoundRewards],
        GradientBanditRewards: [...historyRef.current.GradientBanditRewards],
    });

    /**
     * Start a new bandit simulation.
     * Initializes the game, the reward table, and the manual algorithm.
     */
    const startGame = () => {
        if (running) return;

        // Reset state first
        resetState();

        // Initialize new game instance
        const newGame = new CurrentGame();
        newGame.setNumberOfArms(arms.length);
        newGame.setNumberOfTries(iterations);
        newGame.setChosenDistribution(type);
        newGame.createTable();

        // algorithms setup
        const manualAlgo = new ManualAlgorithm({ numberOfArms: arms.length, numberOfTries: iterations });
        manualAlgo.reset();

        const greedyAlgo = new Greedy({ numberOfArms: arms.length, numberOfTries: iterations });
        greedyAlgo.reset();

        const epsAlgo = new EpsGreedy({ numberOfArms: arms.length, numberOfTries: iterations });
        epsAlgo.reset();

        const gbAlgo = new GradientBandit({ numberOfArms: arms.length, numberOfTries: iterations, alpha: ALPHA_DEFAULT });
        gbAlgo.reset();

        const ucbAlgo = new UCB({ numberOfArms: arms.length, numberOfTries: iterations });
        ucbAlgo.reset();

        algorithmsRef.current = { manual: manualAlgo, greedy: greedyAlgo, epsilon: epsAlgo, gradientBandit: gbAlgo, ucb: ucbAlgo };

        // algo simulations for history tracking
        const table = newGame.tableOfRewards;
        for (let t = 0; t < iterations; t++) {
            const gArm = greedyAlgo.selectArm();
            const gReward = table[gArm][t];
            greedyAlgo.update({ arm: gArm, observedReward: gReward });

            const eArm = epsAlgo.selectArm();
            const eReward = table[eArm][t];
            epsAlgo.update({ arm: eArm, observedReward: eReward });

            const gbArm = gbAlgo.selectArm();
            const gbReward = table[gbArm][t];
            gbAlgo.update({ arm: gbArm, observedReward: gbReward });

            const ucbArm = ucbAlgo.selectArm();
            const ucbReward = table[ucbArm][t];
            ucbAlgo.update({ arm: ucbArm, observedReward: ucbReward });
        }

        // sync history
        historyRef.current.addReward(historyRef.current.greedyRewards, { observedRewards: greedyAlgo.getObservedRewards() });
        historyRef.current.addReward(historyRef.current.epsilonGreedyRewards, { observedRewards: epsAlgo.getObservedRewards() });
        historyRef.current.addReward(historyRef.current.GradientBanditRewards, { observedRewards: gbAlgo.getObservedRewards() });
        historyRef.current.addReward(historyRef.current.UpperConfidenceBoundRewards, { observedRewards: ucbAlgo.getObservedRewards() });


        // initialize manual observed rewards
        newGame.algorithm = manualAlgo;
        gameRef.current = newGame;
        setGame(newGame);
        setRewardTable(newGame.tableOfRewards);
        setRunning(true);
    };


    /**
     * Handle a single pull of a given arm.
     * Updates arm state, total reward, total pulls, and logs.
     *
     * @param {number} idx - Index of the arm to pull.
     */
    const handlePull = (idx) => {
        if (!running || !gameRef.current || rewardTable.length === 0) return;
        if (totalPulls >= iterations || arms[idx].pulls >= iterations) return;

        const reward = rewardTable[idx][arms[idx].pulls];
        const timestep = safeUpdateAlgorithm(algorithmsRef.current.manual, idx, reward) || totalPulls + 1;

        // --- State Updates ---
        updateArm(idx, reward);
        setTotalReward(prev => prev + reward);
        setTotalPulls(prev => prev + 1);
        addLog(timestep, idx, reward);

        // save observed reward for history tracking
        manualObservedRewardsRef.current.push(reward);

        // sync history
        historyRef.current.addReward(historyRef.current.manualRewards, {
            observedRewards: manualObservedRewardsRef.current
        });
    };


    /**
     * Change the number of arms in the simulation.
     * Can increase or decrease the arm count dynamically.
     *
     * @param {number} count - Desired number of arms.
     */
    const setArmCount = (count) => {
        const current = arms.length;
        let newArms;
        if (count > current) {
            const extra = Array.from({ length: count - current }, (_, i) => ({
                id: current + i,
                pulls: 0,
                lastReward: 0
            }));
            newArms = [...arms, ...extra];
        } else {
            newArms = arms.slice(0, count);
        }
        setArms(newArms);
    };

    /**
     * Reset all game state to initial defaults.
     * Resets arms, iterations, total pulls, reward, logs, and plot visibility.
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
    };

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
        getCumulativeRewards,
        startGame,
        handlePull,
        setArmCount,
        resetAll,
    };
}
