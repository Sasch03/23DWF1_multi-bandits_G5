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

    return (
        <div className="bg-background text-foreground min-h-screen p-6 flex flex-col items-center">
            <Header />
            <div className="w-full max-w-7xl">
                <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl flex gap-6">
                    <BanditConfig
                        type={type} setType={setType}
                        arms={arms} setArmCount={setArmCount}
                        iterations={iterations} setIterations={setIterations}
                        resetAll={resetAll}
                    />
                    <div className="flex-1 flex flex-col gap-4">
                        <BanditPlayground
                            arms={arms}
                            onPull={handlePull}
                            disabled={totalPulls >= iterations}
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
