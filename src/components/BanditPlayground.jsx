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

            {/* Render each arm as a button */}
            {arms.map(arm => (
                <button
                    key={arm.id}
                    className={`p-4 rounded-xl w-full text-left transition border
                    ${disabled
                        ? "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60"
                        : "bg-muted/40 border-muted/30 hover:bg-muted/60 hover:border-primary"
                    }`}
                    onClick={() => onPull(arm.id)}
                    disabled={disabled}
                >

                    {/* Arm details: Campaign number and pull count */ }
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">
                            {lang === "de" ? "Kampagne" : "Campaign"} #{arm.id + 1}</div>
                        <div className="text-sm text-muted-foreground">
                            {lang === "de" ? "Versuche" : "Attempts"}: {arm.pulls}</div>
                    </div>

                </button>
            ))}

        </div>
    );
}
