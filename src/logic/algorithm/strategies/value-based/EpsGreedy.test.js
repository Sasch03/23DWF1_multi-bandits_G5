// src/logic/algorithm/strategies/value-based/EpsGreedy.test.js
import { describe, it, expect } from "vitest";
import CurrentGame from "@/logic/CurrentGame.js";
import { DistributionTyp } from "@/logic/enumeration/DistributionTyp.js";
import EpsGreedy from "@/logic/algorithm/strategies/value-based/EpsGreedy.js";
import epsilonProvider from "@/logic/algorithm/strategies/value-based/EpsilonProvider.js";
import { EPSILON_DEFAULT } from "@/constants.js";

const r2 = x => Math.round(x * 100) / 100;

function logTable(table, round=false) {
    const rows = table.map((row, i) => {
        const o = { arm: i };
        row.forEach((v, t) => (o["t"+t] = round && Number.isFinite(v) ? r2(v) : v));
        return o;
    });
    console.table(rows);
}

function runOnTable(table, policy) {
    const T = table[0].length;
    policy.reset();
    const choices = [], rewards = [];
    for (let t = 0; t < T; t++) {
        const a = policy.selectArm();
        const r = table[a][t];
        policy.update({ arm: a, observedReward: r });
        choices.push(a);
        rewards.push(r);
    }
    return { choices, rewards, pulls: policy.getNumberOfPulls?.(), Q: policy.getExpectedRewards?.() };
}

describe("EpsGreedy eyeball logs", () => {
    it("Bernoulli (rounded logs)", () => {
        const k = 3, T = 12;
        const game = new CurrentGame();
        game.setNumberOfArms(k);
        game.setNumberOfTries(T);
        game.setChosenDistribution(DistributionTyp.BERNOULLI);
        game.setChosenAlgorithms([]);
        game.createTable();

        // slice table to exact T trials per arm
        const tableForRun = game.tableOfRewards.map(rewards => rewards.slice(0, T));

        epsilonProvider.setEpsilon(0.2);
        const algo = new EpsGreedy({ numberOfArms: k, numberOfTries: T });

        console.log("=== Bernoulli table ===");
        logTable(tableForRun);
        const out = runOnTable(tableForRun, algo);

        let s = 0;
        const cum = out.rewards.map(r => (s += r, s));

        console.log("epsilon:", epsilonProvider.getEpsilon(0, T));
        console.log("choices:", out.choices.join(", "));
        console.log("rewards:", out.rewards.join(", "));
        console.log("cumulative:", cum.join(", "));
        console.log("pulls:", JSON.stringify(out.pulls));
        console.log("Q:", JSON.stringify(out.Q));

        expect(out.choices.length).toBe(T);
    });

    it("Gaussian (rounded logs)", () => {
        const k = 3, T = 12;
        const game = new CurrentGame();
        game.setNumberOfArms(k);
        game.setNumberOfTries(T);
        game.setChosenDistribution(DistributionTyp.GAUSSIAN);
        game.setChosenAlgorithms([]);
        game.createTable();

        // slice table to exact T trials per arm
        const tableForRun = game.tableOfRewards.map(rewards => rewards.slice(0, T));

        epsilonProvider.setEpsilon(0.2);
        const algo = new EpsGreedy({ numberOfArms: k, numberOfTries: T });

        console.log("=== Gaussian table (rounded) ===");
        logTable(tableForRun, true);
        const out = runOnTable(tableForRun, algo);

        let s = 0;
        const cum = out.rewards.map(r => (s += r, s)).map(r2);

        console.log("epsilon:", epsilonProvider.getEpsilon(0, T));
        console.log("choices:", out.choices.join(", "));
        console.log("rewards (r2):", out.rewards.map(r2).join(", "));
        console.log("cumulative (r2):", cum.join(", "));
        console.log("pulls:", JSON.stringify(out.pulls));
        console.log("Q (r2):", JSON.stringify(out.Q?.map(r2)));

        expect(out.choices.length).toBe(T);
    });
});
