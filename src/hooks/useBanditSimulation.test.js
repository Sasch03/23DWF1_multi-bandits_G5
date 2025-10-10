import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBanditGame } from "./useBanditSimulation.js";

describe("useBanditGame Hook", () => {
    it("initializes with default values", () => {
        const { result } = renderHook(() => useBanditGame());
        expect(result.current.arms.length).toBe(4);
        expect(result.current.iterations).toBe(10);
        expect(result.current.totalPulls).toBe(0);
        expect(result.current.totalReward).toBe(0);
        expect(result.current.logs).toEqual([]);
        expect(result.current.type).toBe("Bernoulli");
    });

    it("can set arm count up", () => {
        const { result } = renderHook(() => useBanditGame(4));
        act(() => {
            result.current.setArmCount(5);
        });
        expect(result.current.arms.length).toBe(5);
        expect(result.current.arms[4]).toEqual({ id: 4, pulls: 0, lastReward: 0 });
    });


    it("can set arm count down", () => {
        const { result } = renderHook(() => useBanditGame(5));
        act(() => {
            result.current.setArmCount(2);
        });
        expect(result.current.arms.length).toBe(2);
    });

    it("handles pulls correctly and updates logs", () => {
        const { result } = renderHook(() => useBanditGame(2, 2));

        act(() => {
            result.current.startGame();
        });

        act(() => {
            result.current.handlePull(0);
        });

        expect(result.current.arms[0].pulls).toBe(1);
        expect(result.current.totalPulls).toBe(1);
        expect(result.current.logs.length).toBe(1);

        act(() => {
            result.current.handlePull(1);
        });

        expect(result.current.arms[1].pulls).toBe(1);
        expect(result.current.totalPulls).toBe(2);
        expect(result.current.logs.length).toBe(2);

        // Pull beyond iterations should not change anything
        const prevLogs = result.current.logs;
        act(() => {
            result.current.handlePull(0);
        });
        expect(result.current.totalPulls).toBe(2);
        expect(result.current.logs).toEqual(prevLogs);
    });

    it("resets all state with resetAll", () => {
        const { result } = renderHook(() => useBanditGame(2, 3));
        act(() => {
            result.current.handlePull(0);
            result.current.handlePull(1);
            result.current.resetAll();
        });

        expect(result.current.totalPulls).toBe(0);
        expect(result.current.totalReward).toBe(0);
        expect(result.current.logs).toEqual([]);
        expect(result.current.arms).toEqual([
            { id: 0, pulls: 0, lastReward: 0 },
            { id: 1, pulls: 0, lastReward: 0 },
        ]);
        expect(result.current.iterations).toBe(3);
    });

    it("can set type", () => {
        const { result } = renderHook(() => useBanditGame());
        act(() => {
            result.current.setType("Bernoulli");
        });
        expect(result.current.type).toBe("Bernoulli");
    });

    it("tracks cumulative rewards correctly", () => {
        const { result } = renderHook(() => useBanditGame(2, 5));

        act(() => {
            result.current.startGame();
        });

        // simulate 2 pulls with manual algorithm
        act(() => {
            result.current.handlePull(0);
            result.current.handlePull(1);
        });

        const rewards = result.current.getCumulativeRewards();

        expect(Array.isArray(rewards.greedyRewards)).toBe(true);
        expect(Array.isArray(rewards.epsilonGreedyRewards)).toBe(true);

        expect(rewards.manualRewards.length).toBe(2);
        expect(rewards.manualRewards[0]).toBeGreaterThanOrEqual(0);
        expect(rewards.manualRewards[1]).toBeGreaterThanOrEqual(rewards.manualRewards[0]);
    });

});
