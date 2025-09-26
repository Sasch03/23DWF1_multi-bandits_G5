import React from "react";
import './App.css';
import Header from './components/header.jsx';
import BanditConfig from './components/BanditConfigForm.jsx';
import BanditPlayground from './components/BanditPlayground.jsx';
import BanditResults from './components/BanditResults.jsx';
import { useBanditGame } from "./hooks/useBanditSimulation.js";

export default function App() {
    const {
        type, setType,
        arms,
        iterations, setIterations,
        totalPulls, totalReward,
        logs,
        resetAll, setArmCount, handlePull
    } = useBanditGame();

    const [running, setRunning] = React.useState(false);
    const startSimulation = () => {
        setRunning(true);
        console.log("Simulation started");
    }


    const handleReset = () => {
        resetAll();
        setRunning(false);
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
                        startSimulation={startSimulation}
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
        </div>
    );
}
