import React from "react";
import './App.css';
import Header from './components/header.jsx';
import BanditConfig from './components/BanditConfigForm.jsx';
import BanditPlayground from './components/BanditPlayground.jsx';
import BanditResults from './components/BanditResults.jsx';
import { useBanditGame } from "./hooks/useBanditSimulation.js";
import BanditResultsChart from "@/components/BanditResultsChart.jsx";

export default function App() {
    const {
        type, setType,
        arms,
        iterations, setIterations,
        totalPulls, totalReward,
        logs,
        running,
        showPlot, setShowPlot,
        startGame,
        armProbabilities, setArmProbabilities,
        resetAll,
        setArmCount,
        handlePull
    } = useBanditGame();

    const handleReset = () => {
        resetAll();
        console.log("Simulation stopped and reset");
    };

    return (
        <div>
            <Header />
            <div className="w-full max-w-7xl">
                <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl flex gap-6">
                    <BanditConfig
                        type={type} setType={setType}
                        arms={arms} setArmCount={setArmCount}
                        iterations={iterations} setIterations={setIterations}
                        resetAll={handleReset}
                        running={running}
                        showPlot={showPlot} setShowPlot={setShowPlot}
                        startSimulation={startGame}
                    />
                    <div className="flex-1 flex flex-col gap-4">
                        <BanditPlayground
                            arms={arms}
                            onPull={handlePull}
                            disabled={!running || totalPulls >= iterations}
                        />
                        <BanditResults
                            arms={arms}
                            totalPulls={totalPulls}
                            totalReward={totalReward}
                            logs={logs}
                        />

                    </div>
                </div>
            </div>
            <br />
            {(showPlot) && (
                <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl flex gap-6">
                    <BanditResultsChart
                    armProbabilities={armProbabilities}
                    setArmProbabilities={setArmProbabilities}
                    />
                </div>
            )}

        </div>
    );
}
