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
import { HelpCircle, Plus, Minus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner.jsx";

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

                {/* number of campaigns */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <Label className="font-bold">{lang === "de" ? "Anzahl Kampagnen" : "Number of campaigns"}</Label>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="size-4 text-muted-foreground/70 hover:text-foreground cursor-pointer translate-y-[1px]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {lang === "de" ? "Gesamtzahl der verfügbaren Arme/Kampagnen im Bandit-Spiel." : "Total number of arms/campaigns available in the current bandit game."}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            className="bg-muted hover:bg-primary/20 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-transform duration-150 ease-in-out hover:scale-105"
                            disabled={running || arms.length <= 2}
                            onClick={() => setArmCount(arms.length - 1)}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>

                        <Slider
                            value={[arms.length]}
                            onValueChange={(val) => setArmCount(val[0])}
                            min={2}
                            max={50}
                            step={1}
                            disabled={running}
                            className={`flex-1 ${running ? "opacity-50 pointer-events-none" : ""}`}
                        />

                        <Button
                            size="icon"
                            className="bg-muted hover:bg-primary/20 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-transform duration-150 ease-in-out hover:scale-105"
                            disabled={running || arms.length >= 50}
                            onClick={() => setArmCount(arms.length + 1)}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">{arms.length}</div>
                </div>

                {/* number of attempts */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <Label className="font-bold">{lang === "de" ? "Anzahl Versuche" : "Number of attempts"}</Label>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="size-4 text-muted-foreground/70 hover:text-foreground cursor-pointer translate-y-[1px]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {lang === "de" ? "Gesamtzahl der Versuche in dieser Simulation." : "Total number of trials the simulation will perform."}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            className="bg-muted hover:bg-primary/20 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-transform duration-150 ease-in-out hover:scale-105"
                            disabled={running || iterations <= 1}
                            onClick={() => setIterations(iterations - 1)}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>

                        <Slider
                            value={[iterations]}
                            onValueChange={(val) => setIterations(val[0])}
                            min={1}
                            max={100}
                            step={1}
                            disabled={running}
                            className={`flex-1 ${running ? "opacity-50 pointer-events-none" : ""}`}
                        />

                        <Button
                            size="icon"
                            className="bg-muted hover:bg-primary/20 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-transform duration-150 ease-in-out hover:scale-105"
                            disabled={running || iterations >= 100}
                            onClick={() => setIterations(iterations + 1)}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

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
                        <Spinner className="size-4" /> {lang === "de" ? "Läuft" : "Running"}
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
