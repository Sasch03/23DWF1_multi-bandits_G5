import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner.jsx";
import SliderWithButtons from "@/components/shared/SliderWithButtons.jsx";

/**
 * BanditConfig Component
 *
 * This component renders a configuration panel for a Multi-Armed Bandit simulation.
 * It allows users to set the number of campaigns (arms), the number of attempts (iterations),
 * and control the simulation process (start, reset, show results).
 *
 * The UI adjusts dynamically based on the simulation state (`running`).
 *
 * @component
 *
 * @param {Object[]} arms - Array of current bandit arms representing campaigns.
 * @param {Function} setArmCount - Callback to update the number of arms (campaigns).
 * @param {number} iterations - Number of total simulation iterations representing attempts.
 * @param {Function} setIterations - Callback to update the number of iterations (attempts).
 * @param {Function} startSimulation - Function to start the bandit simulation.
 * @param {Function} resetAll - Function to reset the entire simulation state.
 * @param {boolean} running - Indicates whether the simulation is currently running.
 * @param {boolean} showPlot - Whether the result plot is currently visible.
 * @param {Function} setShowPlot - Function to toggle result plot visibility.
 * @param {"en"|"de"} lang - Language code for displayed text.
 * @returns {JSX.Element} Rendered configuration UI for the Bandit simulation.
 */
export default function BanditConfig({
                                         arms,
                                         setArmCount,
                                         iterations,
                                         setIterations,
                                         startSimulation,
                                         resetAll,
                                         running,
                                         showPlot,
                                         setShowPlot,
                                         lang,
                                     }) {
    return (
        <Card className="w-1/3 flex flex-col bg-muted/30 gap-4 p-4">

            {/* Header */}
            <CardHeader>
                <CardTitle className="text-2xl">
                    {lang === "de" ? "Konfiguration" : "Configuration"}
                </CardTitle>
                <CardDescription>
                    {lang === "de"
                        ? "Wähle die Anzahl der Kampagnen und Versuche"
                        : "Select a number of campaigns and attempts"}
                </CardDescription>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex flex-col gap-5">

                {/* Number of campaigns */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <Label className="font-bold">
                            {lang === "de" ? "Anzahl Kampagnen" : "Number of campaigns"}
                        </Label>

                        {/* Tooltip */}
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle
                                        className="size-4 text-muted-foreground/70
                                        hover:text-foreground cursor-pointer translate-y-[1px]"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {lang === "de"
                                        ? "Gesamtzahl der verfügbaren Arme/Kampagnen im Bandit-Spiel."
                                        : "Total number of arms/campaigns available in the current bandit game."}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <SliderWithButtons
                        value={arms.length}
                        onChange={setArmCount}
                        min={2}
                        max={50}
                        disabled={running}
                        label="campaigns"
                    />

                    <div className="text-center text-sm text-muted-foreground">{arms.length}</div>
                </div>

                {/* number of attempts */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <Label className="font-bold">
                            {lang === "de" ? "Anzahl Versuche" : "Number of attempts"}
                        </Label>

                        {/* Tooltip */}
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="size-4 text-muted-foreground/70 hover:text-foreground cursor-pointer translate-y-[1px]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {lang === "de"
                                        ? "Gesamtzahl der Versuche in dieser Simulation."
                                        : "Total number of trials the simulation will perform."}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <SliderWithButtons
                        value={iterations}
                        onChange={setIterations}
                        min={1}
                        max={100}
                        disabled={running}
                        label="attempts"
                    />

                    <div className="text-center text-sm text-muted-foreground">{iterations}</div>
                </div>
            </CardContent>

            {/* Footer with buttons */}
            <CardFooter className="flex flex-col gap-2 mt-auto">
                {running ? (
                    <Button
                        variant="secondary"
                        disabled
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <Spinner className="size-4" />{" "}
                        {lang === "de" ? "Spiel gestartet..." : "Game started..."}
                    </Button>
                ) : (
                    <Button onClick={startSimulation} className="w-full">
                        {lang === "de" ? "Start" : "Start"}
                    </Button>
                )}

                {!showPlot && running && (
                    <Button
                        variant="secondary"
                        onClick={() => setShowPlot(true)}
                        className="w-full"
                    >
                        {lang === "de" ? "Ergebnisse" : "Results"}
                    </Button>
                )}

                <Button onClick={resetAll} variant="secondary" className="w-full">
                    {lang === "de" ? "Zurücksetzen" : "Reset"}
                </Button>
            </CardFooter>
        </Card>
    );
}
