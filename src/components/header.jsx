import React from "react";

/**
 * Header Component
 *
 * Displays the main title and subtitle for the Multi-Armed Bandit Playground.
 * This component is purely presentational and does not manage any state.
 *
 * @component
 * @returns {JSX.Element} The header section with title and subtitle.
 */
export default function Header() {
    return (
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">Multi-Armed Bandit Playground</h1>
            <p className="text-muted-foreground mt-2">Simuliere Bernoulli- und Gaussian-Bandits und beobachte die Belohnungen in Echtzeit</p>
        </div>
    );
}
