import React from "react";

/**
 * BanditPlayground Component
 *
 * This component renders a responsive grid of buttons representing each arm (campaign)
 * in the multi-armed bandit simulation. Users can "pull" an arm by clicking
 * its button, which triggers the `onPull` callback with the arm's ID.
 *
 * Each button displays the campaign number and the number of pulls it has received.
 * Buttons are disabled when the `disabled` prop is true, and the UI adapts accordingly.
 *
 * @component
 *
 * @param {object} props
 * @param {Array<{id: number, pulls: number}>} props.arms - Array of arms, each with a unique `id` and current `pulls` count.
 * @param {function(number): void} props.onPull - Callback function called with the ID of the arm when a button is clicked.
 * @param {boolean} props.disabled - Disables all arm buttons when true.
 * @param {"en"|"de"} props.lang - Language code to determine button labels.
 * @returns {JSX.Element} A grid of buttons representing the bandit arms.
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
