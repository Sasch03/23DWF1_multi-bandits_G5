import React from "react";

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
