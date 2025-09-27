import { useState, useRef } from "react";
import CurrentGame from "@/logic/CurrentGame.js";
import {DistributionTyp} from "@/logic/Enumeration/DistributionTyp.js";

/**
 * Custom hook to manage the logic of a multi-armed bandit game.
 * Encapsulates state (arms, iterations, logs, etc.) and functions (pull, reset, change arm count).
 *
 * @param {number} [initialArms=5] - Initial number of arms (slots).
 * @param {number} [initialIterations=10] - Initial number of maximum iterations.
 * @returns {object} An object containing state variables and functions to control the game.
 */
export function useBanditGame(initialArms = 5, initialIterations = 10) {
    const [type, setType] = useState(DistributionTyp.BERNOULLI);
    const [arms, setArms] = useState(
        Array.from({ length: initialArms }, (_, i) => ({ id: i, pulls: 0, lastReward: 0 }))
    );
    const [iterations, setIterations] = useState(initialIterations);
    const [totalPulls, setTotalPulls] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [logs, setLogs] = useState([]);
    const [running, setRunning] = useState(false);
    const [rewardTable, setRewardTable] = useState([]);

    const gameRef = useRef(null);

    // === Start Simulation ===
    const startGame = () => {
        if (running) return;

        const game = new CurrentGame();
        game.setNumberOfArms(arms.length);
        game.setNumberOfTries(iterations);
        game.setChosenDistribution(type);
        game.createTable();

        gameRef.current = game;
        setRewardTable(game.tableOfRewards);

        // Reset Counters
        setArms(prev => prev.map(a => ({ ...a, pulls: 0, lastReward: 0 })));
        setTotalPulls(0);
        setTotalReward(0);
        setLogs([]);

        setRunning(true);
    };

    /**
     * Resets all game state variables to their initial values.
     */
    const resetAll = () => {
        setArms(Array.from({ length: initialArms }, (_, i) => ({ id: i, pulls: 0, lastReward: 0 })));
        setIterations(initialIterations);
        setTotalPulls(0);
        setTotalReward(0);
        setLogs([]);
        setRewardTable([]);
        gameRef.current = null;
        setRunning(false);
    };

    /**
     * Adjusts the number of arms dynamically.
     * Adds new arms or removes existing arms based on the given count.
     *
     * @param {number} count - The new number of arms.
     */
    const setArmCount = (count) => {
        const current = arms.length;
        if (count > current) {
            const extra = Array.from({ length: count - current }, (_, i) => ({
                id: current + i, pulls: 0, lastReward: 0
            }));
            setArms(prev => [...prev, ...extra]);
        } else {
            setArms(prev => prev.slice(0, count));
        }
    };

    /**
     * Performs a pull on the specified arm (like pulling a slot machine lever).
     * Updates arm state, total pulls, total rewards, and logs the action.
     *
     * @param {number} idx - The index of the arm to pull.
     */
    const handlePull = (idx) => {
        if (!running || !gameRef.current || rewardTable.length === 0) {
            console.log("Game not started yet!");
            return;
        }

        if (totalPulls >= iterations) {
            console.log(`Limit reached: ${iterations} pulls`);
            return;
        }

        const armPulls = arms[idx].pulls;
        if (armPulls >= iterations) return;

        const reward = rewardTable[idx][armPulls];

        setArms(prev => prev.map((a, i) => i === idx ? { ...a, pulls: a.pulls + 1, lastReward: reward } : a));
        setTotalPulls(tp => tp + 1);
        setTotalReward(tr => tr + reward);

        setLogs(prev => [`Timestep: ${totalPulls + 1}, Arm: ${idx + 1}, Reward: ${reward}`, ...prev]);
    };

    return {
        type, setType,
        arms,
        iterations, setIterations,
        totalPulls,
        totalReward,
        logs,
        running,
        startGame,
        resetAll,
        setArmCount,
        handlePull,
    };
}
