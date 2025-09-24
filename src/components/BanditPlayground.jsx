import React from "react";

export default function BanditPlayground({ arms, onPull }) {
    return (
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-auto pr-2">
            {arms.map(a => (
                <button
                    key={a.id}
                    className="p-4 rounded-xl bg-muted/40 border border-muted/30 w-full text-left hover:bg-muted/60 transition"
                    onClick={() => onPull(a.id)}
                >
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">Arm #{a.id + 1}</div>
                        <div className="text-sm text-muted-foreground">Pulls: {a.pulls}</div>
                    </div>
                </button>
            ))}
        </div>
    );
}
