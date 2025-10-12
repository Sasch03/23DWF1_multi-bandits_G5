import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import Counter from "@/components/shared/Counter.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

/**
 * BanditConfig Component
 *
 * A configuration panel for multi-armed bandit simulations.
 * Allows the user to select the bandit type, the number of arms,
 * the number of iterations, and to start or reset the simulation.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.arms - Array describing the individual arms.
 * @param {function} props.setArmCount - Callback to update the number of arms.
 * @param {number} props.iterations - The number of simulation iterations.
 * @param {function} props.setIterations - Callback to update the iteration count.
 * @param {function} props.startSimulation - Callback to start the simulation.
 * @param {function} props.resetAll - Callback to reset all settings to default.
 * @param {boolean} props.running - Whether the simulation is currently running.
 * @returns {JSX.Element} The rendered configuration panel.
 */
export default function BanditConfig({
                                         arms, setArmCount,
                                         iterations, setIterations,
                                         startSimulation, resetAll, running, showPlot, setShowPlot
                                     }) {
    return (
        <Card className="w-1/3 flex flex-col bg-muted/30 gap-4 shadow-xl p-4">
            <CardHeader>
                <CardTitle className="text-2xl">Configuration</CardTitle>
                <CardDescription>Select a bandit type, number of campaigns and attempts</CardDescription>
            </CardHeader>

            <TooltipProvider>
                {/* Number of campaigns with tooltip */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <label className="text-sm font-bold mt-4">Number of campaigns</label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Total number of arms/options available in the current bandit game.</p>
                    </TooltipContent>
                </Tooltip>
                <Counter
                    value={arms.length}
                    onChange={setArmCount}
                    min={2}
                    max={50}
                    disabled={running}
                    className="mb-3"
                />

                {/* Number of attempts with tooltip */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <label className="text-sm font-bold mt-4">Number of attempts</label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Total number of trials the simulation will perform.</p>
                    </TooltipContent>
                </Tooltip>
                <Counter
                    value={iterations}
                    onChange={setIterations}
                    min={1}
                    max={100}
                    disabled={running}
                />
            </TooltipProvider>

            <div className="flex gap-2 mt-8">
                {running ? (
                    <Button variant="secondary" disabled className="flex items-center gap-2">
                        <Spinner className="size-4" /> Running
                    </Button>
                ) : (
                    <Button onClick={startSimulation}>Start</Button>
                )}
                {!showPlot && running && (
                    <Button variant="secondary" onClick={() => setShowPlot(true)}>Plot</Button>
                )}
                <Button variant="secondary" onClick={resetAll}>Reset</Button>
            </div>
        </Card>
    );
}