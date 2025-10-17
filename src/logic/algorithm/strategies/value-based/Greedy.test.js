// src/logic/algorithm/strategies/value-based/Greedy_with_CurrentGame.test.js
import { describe, it, expect } from "vitest";
import CurrentGame from "@/logic/CurrentGame.js";
import { DistributionTyp } from "@/logic/enumeration/DistributionTyp.js";
import { NUMBER_OF_GAUSSIAN_DRAWS_PER_ARM } from "@/constants.js";
import Greedy from "@/logic/algorithm/strategies/value-based/Greedy.js";

function runOnTable({ table, policy }) {
    const k = table.length, T = table[0].length;
    if (policy.numberOfArms !== k || policy.numberOfTries !== T)
        throw new Error("k/T mismatch");
    policy.reset();

    const choices = [], rewards = [];
    for (let t = 0; t < T; t++) {
        const a = policy.selectArm();
        const r = table[a][t];
        policy.update({ arm: a, observedReward: r });
        choices.push(a); rewards.push(r);
    }
    return { choices, rewards, pulls: policy.numberOfPulls.slice(), Q: policy.getExpectedRewards?.() };
}

function logTable(table) {
    const rows = table.map((row, i) => {
        const o = { arm: i };
        row.forEach((v, t) => (o["t" + t] = v));
        return o;
    });
    // nice print in Vitest output
    console.table(rows);
}

describe("Greedy with generated tables", () => {
    it("Bernoulli table → runs and logs", () => {
        const k = 3, T = 12;
        const game = new CurrentGame();
        game.setNumberOfArms(k);
        game.setNumberOfTries(T);
        game.setChosenDistribution(DistributionTyp.BERNOULLI);
        game.setChosenAlgorithms([]);
        game.createTable();

        const greedy = new Greedy({ numberOfArms: k, numberOfTries: T });
        logTable(game.tableOfRewards);
        const out = runOnTable({ table: game.tableOfRewards, policy: greedy });

        console.log("choices:", out.choices.join(", "));
        console.log("pulls:", out.pulls);
        console.log("Q:", out.Q);

        expect(game.tableOfRewards.length).toBe(k);
        expect(game.tableOfRewards[0].length).toBe(T);
        expect(out.choices.length).toBe(T);
    });

    it("Gaussian table → runs and logs", () => {
        const k = 3, T = 12;
        const game = new CurrentGame();
        game.setNumberOfArms(k);
        game.setNumberOfTries(T);
        game.setChosenDistribution(DistributionTyp.GAUSSIAN);
        game.setChosenAlgorithms([]);
        game.createTable();

        const greedy = new Greedy({ numberOfArms: k, numberOfTries: T });

        logTable(game.tableOfRewards);

        const tableForRun = game.tableOfRewards.map(rewards => rewards.slice(0, T));

        const out = runOnTable({ table: tableForRun, policy: greedy });

        console.log("choices:", out.choices.join(", "));
        console.log("pulls:", out.pulls);
        console.log("Q:", out.Q);

        // table shape
        expect(game.tableOfRewards.length).toBe(k);
        // for the table we generated, the original length is larger; for run we sliced to T
        expect(tableForRun[0].length).toBe(T);

        // run output
        expect(out.choices.length).toBe(T);
    });


});