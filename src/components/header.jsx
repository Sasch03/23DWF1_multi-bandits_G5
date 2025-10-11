import React from "react";

export default function Header() {
    return (
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-foreground">
                Ein Bandit mit vielen Armen
            </h1>
            <p className="text-muted-foreground mt-2">
                Stell dir vor, du bist ein Mafioso.
                Deine Aufgabe ist es, die beste E-Mail-Phishing-Kampagne zu finden, um möglichst viele Nutzer zu täuschen.
            </p>
            <p className="text-muted-foreground">
                Wähle aus verschiedenen Gehilfen (Algorithmen) und konfiguriere deine Simulation, um möglichst großen Profit zu generieren.
            </p>
            <p className="text-muted-foreground">
                Doch Obacht: Jeder Versuch kostet dich Zeit und Ressourcen!
            </p>
        </div>
    );
}
