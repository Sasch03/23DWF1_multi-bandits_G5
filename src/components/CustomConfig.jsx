import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlgorithmTyp } from "@/logic/enumeration/AlgorithmTyp.js";
import SliderWithButtons from "@/components/shared/SliderWithButtons.jsx";

export default function CustomConfig({ running, createCustomAlgorithm, algorithmAdded, setAlgorithmAdded, lang }) {
    const [open, setOpen] = useState(false);
    const [algorithm, setAlgorithm] = useState(AlgorithmTyp.GRADIENT_BANDIT);

    const [epsilon, setEpsilon] = useState(0.1);
    const [decayMode, setDecayMode] = useState("constant");
    const [ucbC, setUcbC] = useState(2.0);
    const [alpha, setAlpha] = useState(0.1);

    const customParams = (() => {
        switch (algorithm) {
            case AlgorithmTyp.EPSILON_GREEDY:
                return { epsilon, decayMode };
            case AlgorithmTyp.UPPER_CONFIDENCE_BOUND:
                return { c: ucbC };
            case AlgorithmTyp.GRADIENT_BANDIT:
                return { alpha };
            default:
                return {};
        }
    })();

    const handleAddAlgorithm = () => {
        createCustomAlgorithm(algorithm, customParams);
        setAlgorithmAdded(true);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">
                    {lang === "de" ? "Erweiterte Einstellungen" : "Advanced Settings"}
                </span>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (lang === "de" ? "Verbergen" : "Hide") : (lang === "de" ? "Anzeigen" : "Show")}
                    </Button>
                </PopoverTrigger>
            </div>

            <PopoverContent
                className="w-80 mb-2 space-y-4"
                side="top"
                align="end"
                avoidCollisions={false}
            >
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-foreground">
                        {lang === "de" ? "Algorithmus" : "Algorithm"}
                    </Label>
                    <Select
                        value={algorithm}
                        onValueChange={setAlgorithm}
                        disabled={running}
                    >
                        <SelectTrigger className="bg-background border border-border">
                            <SelectValue placeholder={lang === "de" ? "Wähle einen Algorithmus" : "Select an algorithm"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={AlgorithmTyp.GRADIENT_BANDIT}>
                                {lang === "de" ? "Gradient Bandit" : "Gradient Bandit"}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {algorithm === AlgorithmTyp.GRADIENT_BANDIT && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                            {lang === "de" ? "Lernrate (α)" : "Learning Rate (α)"}
                        </Label>
                        <div className="flex flex-col gap-1">
                            <SliderWithButtons
                                value={alpha}
                                onChange={setAlpha}
                                min={0.1}
                                max={1}
                                step={0.01}
                                disabled={algorithmAdded}
                                label="alpha"
                            />
                            <span className="text-xs text-muted-foreground text-center">{alpha.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={algorithmAdded}
                        onClick={handleAddAlgorithm}
                    >
                        {algorithmAdded
                            ? (lang === "de" ? "Custom Hinzugefügt" : "Custom added")
                            : (lang === "de" ? "Custom Hinzufügen" : "Add Custom")}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
