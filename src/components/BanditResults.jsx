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
 * BanditResults Component
 *
 * Renders a dashboard for a multi-armed bandit simulation. It displays key statistics
 * such as remaining attempts, total reward, and a collapsible log of recent activity.
 * Supports both Bernoulli (0/1 success) and Gaussian (continuous) reward types.
 *
 * @component
 *
 * @param {object} props
 * @param {boolean} props.running - Whether the simulation is currently running.
 * @param {number} props.iterations - Total number of iterations configured.
 * @param {number} props.totalPulls - Total number of pulls made so far.
 * @param {number} props.totalReward - Cumulative reward obtained.
 * @param {string[]} props.logs - Array of log strings formatted as `"Timestep: X, Arm: Y, Reward: Z"`.
 * @param {"Bernoulli"|"Gaussian"} props.type - Type of reward distribution.
 * @param {"en"|"de"} props.lang - Language code for display labels.
 * @returns {JSX.Element} Rendered results dashboard.
 */
export default function BanditResults({
                                          running,
                                          iterations,
                                          totalPulls,
                                          totalReward,
                                          logs,
                                          type,
                                          lang
                                      }) {

    const [open, setOpen] = useState(false);

    const remainingPulls = running ? Math.max(0, iterations - totalPulls) : 0;

    /**
     * Render a single log entry as a table row.
     *
     * @param {string} log - Log entry string.
     * @returns {JSX.Element|null} TableRow or null if log is invalid.
     */
    const renderLogTableRow = (log) => {
        const match = log.match(/Timestep: (\d+), Arm: (\d+), Reward: ([\d.-]+)/);
        if (!match) return null;
        const [, timestep, arm, reward] = match;
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
            rewardDisplay =
                rewardValue === 1
                    ? (lang === "de" ? "Erfolg" : "Success")
                    : (lang === "de" ? "Fehlschlag" : "Fail");
            rewardColor = rewardValue === 1 ? "text-emerald-500" : "text-red-500";
        }

        return (
            <TableRow key={timestep}>
                <TableCell className="text-left">
                    <Badge variant="secondary" className="font-mono">
                        #{timestep}
                    </Badge>
                </TableCell>
                <TableCell className="text-left">
                    {lang === "de" ? "Kampagne #" : "Campaign #"}
                    {arm}
                </TableCell>
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
                <TooltipProvider delayDuration={100}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="link"
                                        className="text-sm hover:text-foreground/80 text-muted-foreground"
                                    >
                                        {lang === "de"
                                            ? "Verbleibende Versuche"
                                            : "Remaining Attempts"}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {lang === "de"
                                            ? "Anzahl der verbleibenden Versuche in dieser Simulation."
                                            : "Number of attempts still remaining in this simulation."}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                            <div
                                className={`text-3xl font-bold ${
                                    remainingPulls === 0
                                        ? "text-muted-foreground"
                                        : "text-foreground"
                                }`}
                            >
                                {remainingPulls}
                            </div>
                        </div>

                        <div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="link"
                                        className="text-sm hover:text-foreground/80 text-muted-foreground"
                                    >
                                        {lang === "de" ? "Gesamtgewinn" : "Total Reward"}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {lang === "de"
                                            ? "Bisher kumulierte Belohnung aller Kampagnen."
                                            : "Cumulative total reward across all campaigns."}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                            <div
                                className={`text-3xl font-bold ${
                                    totalReward === 0
                                        ? "text-muted-foreground"
                                        : totalReward > 0
                                            ? "text-emerald-500"
                                            : "text-red-500"
                                }`}
                            >
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
                                    {lang === "de" ? "Weniger anzeigen" : "Show less"}{" "}
                                    <ChevronUp size={16} />
                                </>
                            ) : (
                                <>
                                    {lang === "de" ? "Mehr anzeigen" : "Show more"}{" "}
                                    <ChevronDown size={16} />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Full log table */}
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
                                            <TableCell
                                                colSpan={3}
                                                className="text-center text-muted-foreground py-3"
                                            >
                                                {lang === "de"
                                                    ? "Noch keine Phishing-Kampagnenaktivität"
                                                    : "No phishing campaign activity yet"}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        <>
                                            {renderLogTableRow(logs[0])}
                                            {open && logs.slice(1).map((log) => renderLogTableRow(log))}
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