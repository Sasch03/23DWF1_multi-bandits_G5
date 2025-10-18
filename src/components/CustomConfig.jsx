import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlgorithmTyp } from "@/logic/enumeration/AlgorithmTyp.js";
import SliderWithButtons from "@/components/shared/SliderWithButtons.jsx";

export default function CustomConfig({ running, createCustomAlgorithm }) {
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

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {/* --- Trigger Button --- */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">Erweiterte Einstellungen</span>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? "Verbergen" : "Anzeigen"}
                    </Button>
                </PopoverTrigger>
            </div>

            {/* --- Popover Content --- */}
            <PopoverContent
                className="w-80 mb-2 space-y-4"
                side="top"
                align="end"
                avoidCollisions={false} // verhindert automatisches Flippen
            >
                {/* --- Algorithm Selection --- */}
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-foreground">Algorithmus</Label>
                    <Select
                        value={algorithm}
                        onValueChange={setAlgorithm}
                        disabled={running}
                    >
                        <SelectTrigger className="bg-background border border-border">
                            <SelectValue placeholder="Wähle einen Algorithmus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={AlgorithmTyp.GRADIENT_BANDIT}>Gradient Bandit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* --- Algorithm-specific UI --- */}
                {algorithm === AlgorithmTyp.GRADIENT_BANDIT && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Learning Rate (α)</Label>
                        <div className="flex flex-col gap-1">
                            <SliderWithButtons
                                value={alpha}
                                onChange={setAlpha}
                                min={0.1}
                                max={1}
                                step={0.01}
                                disabled={running}
                                label="alpha"
                            />
                            <span className="text-xs text-muted-foreground text-center">
                                {alpha.toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}

                {/* --- Save/Apply Button --- */}
                <div className="flex justify-end pt-2">
                    <Button
                        size="sm"
                        disabled={running}
                        onClick={() => createCustomAlgorithm(algorithm, customParams)}
                    >
                        Add
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
