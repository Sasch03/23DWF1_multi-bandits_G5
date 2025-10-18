import React from "react";
import './App.css';
import ThemeToggle from './components/ThemeToggle.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import Header from './components/Header.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import BanditConfig from './components/BanditConfig.jsx';
import BanditPlayground from './components/BanditPlayground.jsx';
import BanditResults from './components/BanditResults.jsx';
import { useBanditGame } from "./hooks/useBanditSimulation.js";
import BanditResultsChart from "@/components/BanditResultsChart.jsx";

/**
 * Main App component for the Multi-Armed Bandit Simulation.
 *
 * Handles layout, configuration, playground, and result charts.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered App component.
 */
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
        resetAll,
        setArmCount,
        handlePull,
        game,
        lang,
        setLang,
        winner,
        createCustomAlgorithm,
        getCumulativeRewards,
    } = useBanditGame();

    return (
        <div>

            {/* Top Right Toggles */}
            <div className="flex justify-end p-4 gap-2">
                <LanguageToggle lang={lang} setLang={setLang} />
                <ThemeToggle lang={lang} />
            </div>

            {/* Header and Navigation */}
            <Header lang={lang} />
            <NavigationBar
                type={type}
                setType={setType}
                running={running}
                lang={lang}
            />

            {/* Game Area */}
            <div className="w-full max-w-7xl">
                <div className="p-6 rounded-2xl bg-card text-card-foreground shadow-2xl flex gap-6">

                    {/* Configuration Panel */}
                    <BanditConfig
                        type={type} setType={setType}
                        arms={arms} setArmCount={setArmCount}
                        iterations={iterations} setIterations={setIterations}
                        resetAll={resetAll}
                        running={running}
                        showPlot={showPlot} setShowPlot={setShowPlot}
                        startSimulation={startGame}
                        lang={lang}
                        createCustomAlgorithm={createCustomAlgorithm}
                    />

                    {/* Playground and Results */}
                    <div className="flex-1 flex flex-col gap-4">
                        <BanditPlayground
                            arms={arms}
                            onPull={handlePull}
                            disabled={!running || totalPulls >= iterations}
                            lang={lang}
                        />
                        <BanditResults
                            arms={arms}
                            totalPulls={totalPulls}
                            totalReward={totalReward}
                            iterations={iterations}
                            logs={logs}
                            type={type}
                            lang={lang}
                            running={running}
                        />
                    </div>

                </div>
            </div>

            <br />

            {/* Results Charts */}
            {(showPlot) && (
                <BanditResultsChart
                    game={game}
                    cumulativeRewards={getCumulativeRewards()}
                    lang={lang}
                    winner={winner}
                />
            )}
        </div>

    );
}