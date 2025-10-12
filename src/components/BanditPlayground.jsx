import React from "react";

/**
 * BanditPlayground Component
 *
 * Renders a grid of buttons representing each arm of a multi-armed bandit.
 * Users can "pull" an arm by clicking a button, triggering the `onPull` callback.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array<{id: number, pulls: number}>} props.arms - Array of arms with unique IDs and pull counts.
 * @param {function} props.onPull - Callback function called with the ID of the arm that is pulled.
 * @param {boolean} props.disabled - If true, disables all arm buttons.
 * @returns {JSX.Element} The rendered grid of bandit arms.
 */
export default function BanditPlayground({ arms, onPull, disabled, lang }) {
    return (
        <div className="grid grid-cols-2 gap-4 max-h-[36vh] overflow-auto pr-2">
            {arms.map(a => (
                <button
                    key={a.id}
                    className={`p-4 rounded-xl bg-muted/40 border border-muted/30 w-full text-left transition ${
                        !disabled ? "hover:bg-muted/60" : ""
                    }`}
                    onClick={() => onPull(a.id)}
                    disabled={disabled}
                >
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">
                            {lang === "de" ? "Kampagne" : "Campaign"} #{a.id + 1}</div>
                        <div className="text-sm text-muted-foreground">
                            {lang === "de" ? "Versuche" : "Attempts"}: {a.pulls}</div>
                    </div>
                </button>
            ))}
        </div>
    );
}
