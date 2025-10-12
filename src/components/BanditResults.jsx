"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

/**
 * Renders a results dashboard for a multi-armed bandit simulation.
 *
 * Displays total attempts, total reward, and a collapsible log of recent activities.
 * Supports both Bernoulli and Gaussian bandit reward types.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {number} props.totalPulls - Total number of attempts (pulls) made by the bandit.
 * @param {number} props.totalReward - The cumulative reward across all attempts.
 * @param {string[]} props.logs - Array of log strings, each formatted as `"Timestep: X, Arm: Y, Reward: Z"`.
 * @param {"Bernoulli" | "Gaussian"} props.type - The type of reward distribution used in the simulation.
 *
 * @returns {JSX.Element} The rendered BanditResults component.
 */
export default function BanditResults({ totalPulls, totalReward, logs, type , lang}) {
    const [open, setOpen] = useState(false);

    let totalRewardColor =
        totalReward > 0
            ? "text-emerald-500"
            : totalReward < 0
                ? "text-red-500"
                : "";

    const renderLogRow = (log) => {
        const match = log.match(/Timestep: (\d+), Arm: (\d+), Reward: ([\d.-]+)/);
        if (!match) return null;
        const [, ts, arm, reward] = match;
        const rewardValue = parseFloat(reward);

        let rewardDisplay;
        let rewardColor;

        if (type === "Gaussian") {
            rewardDisplay = `${rewardValue.toFixed(2)} €`;
            rewardColor =
                rewardValue > 0
                    ? "text-emerald-500"
                    : rewardValue < 0
                        ? "text-red-500"
                        : "text-muted-foreground";
        } else {
            rewardDisplay = rewardValue === 1
                ? (lang === "de" ? "Erfolg" : "Success")
                : (lang === "de" ? "Fehlschlag" : "Fail");
            rewardColor =
                rewardValue === 1
                    ? "text-emerald-500"
                    : "text-red-500";
        }

        return (
            <TableRow key={ts}>
                <TableCell className="text-left">
                    <Badge variant="secondary" className="font-mono">
                        #{ts}
                    </Badge>
                </TableCell>
                <TableCell className="text-left">
                    {lang === "de" ? "Kampagne" : "Campaign"}{arm}</TableCell>
                <TableCell
                    className={`text-right font-mono font-semibold ${rewardColor}`}
                >
                    {rewardDisplay}
                </TableCell>
            </TableRow>
        );
    };


    return (
        <Card className="mt-auto w-full bg-muted/30">
            <CardHeader></CardHeader>
            <CardContent className="flex flex-col gap-6">
                {/* Top Stats */}
                <TooltipProvider>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground">
                                        {lang === "de" ? "Gesamtversuche" : "Total Attempts"}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{lang === "de"
                                        ? "Gesamtzahl der Ziehungen im Spiel."
                                        : "Total number of times the bandit has been pulled in this simulation."}</p>
                                </TooltipContent>
                            </Tooltip>
                            <div className="text-3xl font-bold">{totalPulls}</div>
                        </div>
                        <div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground">
                                        {lang === "de" ? "Gesamtgewinn" : "Total Reward"}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {lang === "de"
                                            ? "Gesamtzahl der Ziehungen im Spiel."
                                            : "Total number of times the bandit has been pulled in this simulation."}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                            <div className={`text-3xl font-bold ${totalRewardColor}`}>
                                {type === "Gaussian"
                                    ? totalReward.toFixed(2) + " €"
                                    : totalReward}
                            </div>
                        </div>
                    </div>
                </TooltipProvider>

                <Separator />

                {/* Logs */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">
                            {lang === "de" ? "Letzte Aktivität" : "Recent Activity"}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-1"
                            disabled={logs.length === 0}
                        >
                            {open ? (
                                <>
                                    {lang === "de" ? "Verstecke alle" : "Hide all"} <ChevronUp size={16} />
                                </>
                            ) : (
                                <>
                                    {lang === "de" ? "Zeige alle" : "Show all"} <ChevronDown size={16} />
                                </>
                            )}
                        </Button>
                    </div>

                    <Collapsible open={open}>
                        <div className="overflow-hidden transition-all duration-300">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">
                                            {lang === "de" ? "Versuch" : "Attempt"}
                                        </TableHead>
                                        <TableHead>
                                            {lang === "de" ? "Kampagne" : "Campaign"}
                                        </TableHead>
                                        <TableHead className="text-right">
                                            {lang === "de" ? "Belohnung" : "Reward"}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground py-3">
                                                {lang === "de"
                                                    ? "Noch keine Phishing-Kampagnenaktivität"
                                                    : "No phishing campaign activity yet"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <>
                                            {renderLogRow(logs[0])}

                                            {open && logs.slice(1).map((log) => renderLogRow(log))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Collapsible>
                </div>
            </CardContent>
        </Card>
    );
}