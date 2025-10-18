import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {AlgorithmTyp} from "@/logic/enumeration/AlgorithmTyp.js";

export default function CustomConfig({ running, createCustomAlgorithm }) {
    const [open, setOpen] = useState(false);
    const [algorithm, setAlgorithm] = useState(AlgorithmTyp.EPSILON_GREEDY);

    // Algorithm-specific states
    const [epsilon, setEpsilon] = useState(0.1);
    const [decayMode, setDecayMode] = useState("constant");
    const [ucbC, setUcbC] = useState(2.0);
    const [alpha, setAlpha] = useState(0.1);

    // Prepare parameters dynamically based on selected algorithm
    const customParams = (() => {
        switch (algorithm) {
            case AlgorithmTyp.EPSILON_GREEDY: return { epsilon, decayMode };
            case AlgorithmTyp.UPPER_CONFIDENCE_BOUND: return { c: ucbC };
            case AlgorithmTyp.GRADIENT_BANDIT: return { alpha };
            default: return {};
        }
    })();

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            {/* --- Trigger Button --- */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">Erweiterte Einstellungen</span>
                <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
                        {open ? "Verbergen" : "Anzeigen"}
                    </Button>
                </CollapsibleTrigger>
            </div>

            {/* --- Collapsible Content --- */}
            <CollapsibleContent className="mt-3 space-y-4">
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
                            <SelectItem value={AlgorithmTyp.EPSILON_GREEDY}>ε-Greedy</SelectItem>
                            <SelectItem value={AlgorithmTyp.UPPER_CONFIDENCE_BOUND}>UCB</SelectItem>
                            <SelectItem value={AlgorithmTyp.GRADIENT_BANDIT}>Gradient Bandit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* --- Algorithm-specific UI --- */}
                {algorithm === AlgorithmTyp.EPSILON_GREEDY && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Epsilon (ε)</Label>
                        <Input
                            type="number"
                            placeholder="0.1"
                            step="0.01"
                            min="0"
                            max="1"
                            value={epsilon}
                            onChange={e => setEpsilon(parseFloat(e.target.value))}
                            disabled={running}
                        />
                        <Label className="text-sm font-semibold">Decay Mode</Label>
                        <Select value={decayMode} onValueChange={setDecayMode} disabled={running}>
                            <SelectTrigger><SelectValue placeholder="constant" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="constant">Constant</SelectItem>
                                <SelectItem value="linear">Linear</SelectItem>
                                <SelectItem value="exp">Exponential</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {algorithm === AlgorithmTyp.UPPER_CONFIDENCE_BOUND && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Exploration Coefficient (C)</Label>
                        <Input
                            type="number"
                            placeholder="2.0"
                            step="0.1"
                            min="0"
                            value={ucbC}
                            onChange={e => setUcbC(parseFloat(e.target.value))}
                            disabled={running}
                        />
                    </div>
                )}

                {algorithm === AlgorithmTyp.GRADIENT_BANDIT && (
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Learning Rate (α)</Label>
                        <Input
                            type="number"
                            placeholder="0.1"
                            step="0.01"
                            min="0"
                            value={alpha}
                            onChange={e => setAlpha(parseFloat(e.target.value))}
                            disabled={running}
                        />
                    </div>
                )}

                {/* --- Save/Apply Button --- */}
                <div className="flex justify-end pt-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={running}
                        onClick={() => createCustomAlgorithm(algorithm, customParams)}
                    >
                        Als neuen Algorithmus speichern
                    </Button>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
