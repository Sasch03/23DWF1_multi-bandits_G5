import React from "react";

/**
 * BanditResults Component
 *
 * Displays the results of a multi-armed bandit simulation, including
 * the total number of pulls and a scrollable log of individual pulls.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {number} props.totalPulls - The total number of times any arm has been pulled.
 * @param {string[]} props.logs - An array of log messages describing each pull.
 * @returns {JSX.Element} A visual summary of the bandit simulation results.
 */
export default function BanditResults({ totalPulls, logs }) {
    return (
        <div className="mt-auto p-4 rounded-xl bg-muted/30 border border-muted/30 flex flex-col gap-2">
            <div>
                <div className="text-sm text-muted-foreground">Total Pulls</div>
                <div className="text-2xl font-bold">{totalPulls}</div>
            </div>
            <div>
                <div className="text-sm text-muted-foreground">Pull Logs</div>
                <div className="max-h-40 overflow-auto text-sm p-2 rounded">
                    {logs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
