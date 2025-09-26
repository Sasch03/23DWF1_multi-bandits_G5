import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx'
import { Button } from "@/components/ui/button.jsx";
import Counter from "@/components/shared/Counter.jsx";

export default function BanditConfig({
                                         type, setType,
                                         arms, setArmCount,
                                         iterations, setIterations,
                                         startAuto, stopAuto, resetAll, running
                                     }) {
    return (
        <Card className="w-1/3 flex flex-col bg-muted/30 gap-4 shadow-xl p-4">
            <CardHeader>
                <CardTitle className="text-2xl">Konfiguration</CardTitle>
                <CardDescription>Wähle Bandit-Typ, Anzahl der Arme und der Iterationen</CardDescription>
            </CardHeader>

            <div className="space-y-3">
                <label className="text-sm">Bandit-Typ</label>
                <Select disabled={true} onValueChange={setType} defaultValue={type}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wähle Typ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bernoulli">Bernoulli</SelectItem>
                        <SelectItem value="gaussian">Gaussian</SelectItem>
                    </SelectContent>
                </Select>

                <label className="text-sm">Anzahl Arme</label>
                <Counter value={arms.length} onChange={setArmCount} min={2} max={50} disabled={running} />

                <label className="text-sm">Anzahl Iterationen</label>
                <Counter value={iterations} onChange={setIterations} min={1} max={100} disabled={running} />


                <div className="flex gap-2">
                    {running ? (
                        <Button variant="destructive" onClick={stopAuto}>Pause</Button>
                    ) : (
                        <Button onClick={startAuto}>Start</Button>
                    )}
                    <Button onClick={resetAll}>Zurücksetzen</Button>
                </div>
            </div>
        </Card>
    );
}
