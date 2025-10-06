"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function BanditResults({ totalPulls, totalReward, logs, game }) {
    const [open, setOpen] = useState(false);

    let totalRewardColor =
        totalReward > 0
            ? "text-emerald-500"
            : totalReward < 0
                ? "text-red-500"
                : "text-muted-foreground";

    const renderLogRow = (log) => {
        const match = log.match(/Timestep: (\d+), Arm: (\d+), Reward: ([\d.-]+)/);
        if (!match) return null;
        const [, ts, arm, reward] = match;
        const rewardValue = parseFloat(reward);
        const rewardColor =
            rewardValue > 0
                ? "text-emerald-500"
                : rewardValue < 0
                    ? "text-red-500"
                    : "text-muted-foreground";

        return (
            <TableRow key={ts}>
                <TableCell className="text-left">
                    <Badge variant="secondary" className="font-mono">
                        #{ts}
                    </Badge>
                </TableCell>
                <TableCell className="text-left">Campaign {arm}</TableCell>
                <TableCell
                    className={`text-right font-mono font-semibold ${rewardColor}`}
                >
                    {reward}
                    {game.chosenDistribution === "Gaussian" ? " €" : ""}
                </TableCell>
            </TableRow>
        );
    };

    return (
        <Card className="mt-auto w-full bg-muted/30">
            <CardHeader></CardHeader>
            <CardContent className="flex flex-col gap-6">
                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-muted-foreground">Total Attempts</span>
                        <div className="text-3xl font-bold">{totalPulls}</div>
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Total Reward</span>
                        <div className={`text-3xl font-bold ${totalRewardColor}`}>
                            {totalReward.toFixed(2)} €
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Logs */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">
                            Recent Activity
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-1"
                        >
                            {open ? (
                                <>
                                    Hide all <ChevronUp size={16} />
                                </>
                            ) : (
                                <>
                                    Show all <ChevronDown size={16} />
                                </>
                            )}
                        </Button>
                    </div>

                    <Collapsible open={open}>
                        <div className="overflow-hidden transition-all duration-300">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Attempt</TableHead>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead className="text-right">Reward</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Immer sichtbar: neuester Log */}
                                    {logs.length > 0 && renderLogRow(logs[0])}

                                    {/* Rest: sichtbar nur wenn open */}
                                    {open &&
                                        logs.slice(1).map((log) => renderLogRow(log))}
                                </TableBody>
                            </Table>
                        </div>
                    </Collapsible>
                </div>
            </CardContent>
        </Card>
    );
}
