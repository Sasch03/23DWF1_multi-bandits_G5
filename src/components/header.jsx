import React from "react";

export default function Header() {
    return (
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
                A Bandit With Many Arms
            </h1>
            <p className="text-muted-foreground mt-2">
                Imagine you are a mobster.
                Your task is to find the best email phishing campaign to deceive as many users as possible.
            </p>
            <p className="text-muted-foreground">
                Choose from various assistants (distributions) and configure your simulation to generate the highest possible profit.
            </p>
            <p className="text-muted-foreground">
                But beware: every attempt costs you time and resources!
            </p>
        </div>
    );
}
