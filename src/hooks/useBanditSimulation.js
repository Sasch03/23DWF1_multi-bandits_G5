import { useState } from "react";

/**
 * Custom Hook zum Verwalten der Bandit-Game-Logik.
 * Kapselt State (Arme, Iterationen, Logs etc.) und Methoden (Pull, Reset, Count ändern).
 *
 * @param {number} initialArms - Startanzahl der Arme (Slots)
 * @param {number} initialIterations - Startanzahl der maximalen Iterationen
 * @returns {object} - Enthält State-Variablen und Funktionen zur Steuerung des Spiels
 */
export function useBanditGame(initialArms = 5, initialIterations = 10) {
    const [type, setType] = useState('bernoulli');
    const [arms, setArms] = useState(() =>
        Array.from({ length: initialArms }, (_, i) => ({
            id: i,
            pulls: 0,
            lastReward: 0,
        }))
    );
    const [iterations, setIterations] = useState(initialIterations);
    const [totalPulls, setTotalPulls] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [logs, setLogs] = useState([]);

    /**
     * Setzt alle Werte zurück auf Ausgangszustand.
     */
    const resetAll = () => {
        console.log("Reset All");
        setArms(
            Array.from({ length: initialArms }, (_, i) => ({
                id: i,
                pulls: 0,
                lastReward: 0,
            }))
        );
        setIterations(initialIterations);
        setTotalPulls(0);
        setTotalReward(0);
        setLogs([]);
    };

    /**
     * Passt die Anzahl der Arme an.
     * @param {number} count - Neue Anzahl der Arme
     */
    const setArmCount = (count) => {
        console.log("Set Arm Count", count);
        const current = arms.length;
        if (count > current) {
            const extra = Array.from({ length: count - current }, (_, i) => ({
                id: current + i,
                pulls: 0,
                lastReward: 0,
            }));
            setArms((prev) => [...prev, ...extra]);
        } else {
            setArms((prev) => prev.slice(0, count));
        }
    };

    /**
     * Führt einen Pull an einem Arm aus (Zug an Slot-Machine)
     * @param {number} idx - Index des Arms
     */
    const handlePull = (idx) => {
        if (totalPulls >= iterations) {
            console.log(`Limit erreicht: ${iterations} Pulls`);
            return;
        }

        console.log("Pull Arm", idx);

        // Dummy Reward (später durch echte Logik ersetzen)
        const reward = Math.random() > 0.5 ? 1 : 0;

        // Arme updaten
        setArms((prev) =>
            prev.map((a, i) =>
                i === idx ? { ...a, pulls: a.pulls + 1, lastReward: reward } : a
            )
        );

        // Zähler updaten
        setTotalPulls((tp) => tp + 1);
        setTotalReward((tr) => tr + reward);

        // Log schreiben
        const newLog = `Timestep: ${totalPulls + 1}, Arm: ${idx + 1}, Reward: ${reward}`;
        setLogs((prev) => [newLog, ...prev]);

        console.log(newLog);
    };

    return {
        type,
        setType,
        arms,
        iterations,
        setIterations,
        totalPulls,
        totalReward,
        logs,
        resetAll,
        setArmCount,
        handlePull,
    };
}
