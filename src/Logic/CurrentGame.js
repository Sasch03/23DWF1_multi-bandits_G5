import {DistributionTyp} from '/Enumeration/DistributionTyp.js';
import {AlgorithmTypes} from '/Enumeration/AlgorithmTyp.js';

/*
 * TODO Hier Doku
 * TODO Logging implementieren
 * TODO Unit Tests
 */
class CurrentGame {
    numberOfArms;
    numberOfTries;
    choosenDistribution;
    choosenAlgorithms;
    tableOfRewards;

    setNumberOfArms(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("numberOfArms has to be a number > 0.");
        }
        this.numberOfArms = value;
    }

    setNumberOfTries(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error("numberOfTries has to be a number > 0.");
        }
        this.numberOfTries = value;
    }

    setChoosenDistribution(value) {
        if (!Object.values(DistributionTyp).includes(value)) {
            throw new Error("ChoosenDistribution has to be a distribution typ.");
        }
        this.choosenDistribution = value;
    }

    setChoosenAlgorithms(value) {
        if (!Array.isArray(value) || value.some(alg => !Object.values(AlgorithmTypes).includes(alg))) {
            throw new Error("ChoosenAlgorithms must be an array of valid AlgorithmTypes.");
        }
        this.choosenAlgorithms = value;
    }

    #generateTable(choosenDistribution, numberOfArms, numberOfTries) {
        //console.log(`Generate table for ${numberOfArms} arms, ${tries} trials with ${choosenDistribution} distribution.`);
        const table = [];

        // TODO nur diejenigen Tabellen initiiren, die benötigt werden.
        // Für jeden Arm werden die Verteilungsparameter einmalig festgelegt.
        // Bernoulli: Jeder Arm erhält eine feste, zufällige Erfolgswahrscheinlichkeit.
        const bernoulliProbabilities = Array.from({ length: numberOfArms }, () => Math.random());
        // Gaussian: Jeder Arm erhält einen festen, zufälligen Mittelwert (µ). Die Standardabweichung (σ) ist hier fix.
        const gaussianMeans = Array.from({ length: numberOfArms }, () => Math.random() * 10); // z.B. Mittelwerte zwischen 0 und 10
        const gaussianStdDev = 2.0;

        for (let i = 0; i < numberOfArms; i++) {
            const rewardsForArm = [];
            for (let j = 0; j < numberOfTries; j++) {
                let reward = 0;
                switch (choosenDistribution) {
                    case DistributionTyp.BERNOULLI:
                        // Belohnung ist 1, wenn eine Zufallszahl kleiner als die Wahrscheinlichkeit des Arms ist, sonst 0.
                        reward = Math.random() < bernoulliProbabilities[i] ? 1 : 0;
                        break;

                    case DistributionTyp.GAUSSIAN:
                        // Generiert eine normalverteilte Zufallszahl mit dem Box-Muller-Verfahren.
                        // Dies erzeugt realistischere normalverteilte Werte als einfache Näherungen.
                        let u = 0, v = 0;
                        while(u === 0) u = Math.random(); // Verhindert log(0)
                        while(v === 0) v = Math.random();
                        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
                        reward = z * gaussianStdDev + gaussianMeans[i];
                        break;

                    default:
                        // Falls eine unbekannte Verteilung gewählt wird
                        reward = 0;
                        break;
                }
                rewardsForArm.push(reward);
            }
            table.push(rewardsForArm);
        }
        return table;
    }

    createTable() {
        if (!this.choosenDistribution || this.numberOfArms <= 0 || this.numberOfTries <= 0) {
            throw new Error("Please set all properties (distribution, arms, tries) before creating the table.");
        }

        this.tableOfRewards = this.#generateTable(
            this.choosenDistribution,
            this.numberOfArms,
            this.numberOfTries
        );
    }
}
