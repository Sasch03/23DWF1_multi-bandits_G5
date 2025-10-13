import React from "react";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink
} from "@/components/ui/navigation-menu";

export default function NavigationBar({ algo, setAlgo, running, lang }) {
    const navItems = [
        {
            value: "Bernoulli",
            label_de: "Bernoulli",
            label_en: "Bernoulli"
        },
        {
            value: "Gaussian",
            label_de: "Gaußsche",
            label_en: "Gaussian"
        }
    ];

    return (
        <div className="mb-6 w-full text-center">
            <NavigationMenu className="bg-card border border-border rounded-md shadow-sm px-4 py-2 inline-block">
                <NavigationMenuList className="justify-center space-x-4">
                    {navItems.map((item) => (
                        <NavigationMenuItem key={item.value}>
                            <NavigationMenuLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (running) return; // nichts tun, wenn gerade läuft
                                    setAlgo(item.value);
                                }}
                                className={`px-3 py-1 rounded font-medium transition-colors 
                                    ${algo === item.value
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-primary/20 hover:text-primary"} 
                                    ${running ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {lang === "de" ? item.label_de : item.label_en}
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Erklärungstext, abhängig vom ausgewählten Algo */}
            <div className="mt-4 text-sm text-muted-foreground">
                {algo === "Bernoulli" && (
                    <p>
                        {lang === "de"
                            ? <>
                                Im Mafia-Phishing-Use-Case beschreibt sie, ob eine einzelne Kampagne erfolgreich Geld bringt (1) oder scheitert (0) – also ein reines Ja/Nein-Ergebnis.
                                Um mehr über die Bernoulli-Verteilung zu erfahren, drücke{" "}
                                <a href="https://de.wikipedia.org/wiki/Bernoulli-Verteilung" target="_blank" rel="noopener noreferrer" className="underline text-primary">
                                    hier
                                </a>.
                            </>
                            : "The Bernoulli bandit works with discrete payouts (0 or 1), based on fixed probabilities for each arm."}
                    </p>
                )}

                {algo === "Gaussian" && (
                    <p>
                        {lang === "de"
                            ? <>
                                Sie beschreibt, wie stark die Erträge erfolgreicher Kampagnen um einen typischen Durchschnitt schwanken – manche bringen ein bisschen mehr, andere etwas weniger.
                                Um mehr über die Gaußsche Verteilung zu erfahren, drücke{" "}
                                <a href="https://de.wikipedia.org/wiki/Normalverteilung" target="_blank" rel="noopener noreferrer" className="underline text-primary">
                                    hier
                                </a>.
                            </>
                            : "The Gaussian bandit uses continuous payouts, drawn from a normal distribution for each arm."}
                    </p>
                )}

            </div>
        </div>
    );
}