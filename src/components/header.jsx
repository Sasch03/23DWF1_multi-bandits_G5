import React from "react";

export default function Header({ lang }) {
    return (
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
                {lang === "de" ? "Ein Bandit mit vielen Armen" : "A Bandit With Many Arms"}
            </h1>
            <p className="text-muted-foreground mt-2">
                {lang === "de"
                    ? "Stell dir vor, du bist ein Mafioso. Deine Aufgabe ist es, die beste E-Mail-Phishing-Kampagne zu finden, um möglichst viele Nutzer zu täuschen."
                    : "Imagine you are a mobster. Your task is to find the best email phishing campaign to deceive as many users as possible."}
            </p>
            <p className="text-muted-foreground">
                {lang === "de"
                    ? "Wähle aus verschiedenen Gehilfen (Verteilungen) und konfiguriere deine Simulation, um möglichst großen Profit zu generieren."
                    : "Choose from various assistants (distributions) and configure your simulation to generate the highest possible profit."}
            </p>
            <p className="text-muted-foreground">
                {lang === "de"
                    ? "Doch Obacht: Jeder Versuch kostet dich Zeit und Ressourcen!"
                    : "But beware: every attempt costs you time and resources!"}
            </p>
        </div>
    );
}