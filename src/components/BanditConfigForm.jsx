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
import { HelpCircle } from "lucide-react";
import {Label} from "@/components/ui/label.jsx";

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
                                         startSimulation, resetAll, running, showPlot, setShowPlot, lang,
                                     }) {
    return (
        <Card className="w-1/3 flex flex-col bg-muted/30 gap-4 p-4">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {lang === "de"
                        ? "Konfiguration"
                        : "Configuration"}
                </CardTitle>
                <CardDescription>
                    {lang === "de"
                        ? "Wähle die Anzahl der Kampagnen und Versuche"
                        : "Select a number of campaigns and attempts"}
                </CardDescription>
            </CardHeader>

            <TooltipProvider delayDuration={100}>
                {/* Number of campaigns with tooltip */}

                <Tooltip>
                    <div className="flex items-center justify-center gap-1">
                        <Label

                            className="text-foreground hover:text-foreground/80 font-bold p-0"
                        >
                            {lang === "de" ? "Anzahl Kampagnen" : "Number of campaigns"}
                        </Label>
                        <TooltipTrigger asChild>
                            <HelpCircle
                                className="size-4 text-muted-foreground/70 hover:text-foreground cursor-pointer translate-y-[1px]"
                            />
                        </TooltipTrigger>
                    </div>
                    <TooltipContent>
                        <p>
                            {lang === "de"
                                ? "Gesamtzahl der verfügbaren Arme/Kampagnen im Bandit-Spiel."
                                : "Total number of arms/campaigns available in the current bandit game."}
                        </p>
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
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <Tooltip>
                    <div className="flex items-center justify-center gap-1">
                        <Label
                            className="text-foreground hover:text-foreground/80 font-bold p-0"
                        >
                            {lang === "de" ? "Anzahl Versuche" : "Number of attempts"}
                        </Label>
                        <TooltipTrigger asChild>
                            <HelpCircle
                                className="size-4 text-muted-foreground/70 hover:text-foreground cursor-pointer translate-y-[1px]"
                            />
                        </TooltipTrigger>
                    </div>
                    <TooltipContent>
                        <p>
                            {lang === "de"
                                ? "Gesamtzahl der Versuche in dieser Simulation."
                                : "Total number of trials the simulation will perform."}
                        </p>
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

            <div className="flex gap-2 mt-2">
                {running ? (
                    <Button variant="secondary" disabled className="flex items-center gap-2">
                        <Spinner className="size-4" /> {lang === "de" ? "Läuft" : "Running"}
                    </Button>
                ) : (
                    <Button onClick={startSimulation}>{lang === "de" ? "Start" : "Start"}</Button>
                )}
                {!showPlot && running && (
                    <Button variant="secondary" onClick={() => setShowPlot(true)}>
                        {lang === "de" ? "Diagramm" : "Diagram"}
                    </Button>
                )}
                <Button variant="secondary" onClick={resetAll}>
                    {lang === "de" ? "Zurücksetzen" : "Reset"}
                </Button>
            </div>
        </Card>
    );
}