import { DistributionTyp } from '/Enumeration/DistributionTyp.js';
import { AlgorithmTypes } from '/Enumeration/AlgorithmTyp.js';

/*
 * TODO Hier Doku
 * TODO Logging implementieren
 */
class CurrentGame {
    #numberOfArms;
    #numberOfTries;
    #choosenDistribution;
    #choosenAlgorithms;
    #tableOfRewards;

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
            throw new Error("ChoosenAlgorithms muss ein Array mit gültigen AlgorithmTypes sein.");
        }
        this.choosenAlgorithms = value;
    }

    this.tableOfRewards = this.generateTable(
        choosenDistribution,
        numberOfArms,
        numberOfTries
    );

    createTable(){
        //TODO Hier Implementierung von Methode
    }
}