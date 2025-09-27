import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx'
import { Button } from "@/components/ui/button.jsx";
import Counter from "@/components/shared/Counter.jsx";

/**
 * BanditConfig Component
 *
 * A configuration panel for multi-armed bandit simulations.
 * Allows the user to select the bandit type, the number of arms,
 * the number of iterations, and to start or reset the simulation.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {"bernoulli"|"gaussian"} props.type - The currently selected bandit type.
 * @param {function} props.setType - Callback to update the bandit type.
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
                                         type, setType,
                                         arms, setArmCount,
                                         iterations, setIterations,
                                         startSimulation, resetAll, running
                                     }) {
    return (
        <Card className="w-1/3 flex flex-col bg-muted/30 gap-4 shadow-xl p-4">
            <CardHeader>
                <CardTitle className="text-2xl">Konfiguration</CardTitle>
                <CardDescription>Wähle Bandit-Typ, Anzahl der Arme und der Iterationen</CardDescription>
            </CardHeader>

            <div className="space-y-3">
                <label className="text-sm">Bandit-Typ</label>
                <Select disabled={running} onValueChange={setType} defaultValue={type}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wähle Typ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Bernoulli">Bernoulli</SelectItem>
                        <SelectItem value="Gaussian">Gaussian</SelectItem>
                    </SelectContent>
                </Select>

                <label className="text-sm">Anzahl Arme</label>
                <Counter value={arms.length} onChange={setArmCount} min={2} max={50} disabled={running} />

                <label className="text-sm">Anzahl Iterationen</label>
                <Counter value={iterations} onChange={setIterations} min={1} max={100} disabled={running} />


                <div className="flex gap-2">
                    {running ? (
                        <Button variant="destructive" disabled={true}>Running</Button>
                    ) : (
                        <Button onClick={startSimulation}>Start</Button>
                    )}
                    <Button onClick={resetAll}>Zurücksetzen</Button>
                </div>
            </div>
        </Card>
    );
}
