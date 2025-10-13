import React from "react";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { ArrowUpRightIcon } from "lucide-react";

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
                                    if (running) return;
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

            {/* Erklärungstext */}
            <div className="mt-4 text-sm text-muted-foreground space-y-2">
                {algo === "Bernoulli" && (
                    <div>
                        <p>
                            {lang === "de"
                                ? "Die Bernoulli-Verteilung beschreibt, ob eine einzelne Kampagne erfolgreich Geld bringt (1) oder fehlschlägt (0) – also ein reines Ja/Nein-Ergebnis."
                                : "The Bernoulli bandit works with discrete payouts (0 or 1), based on fixed probabilities for each arm."}
                        </p>

                        <div className="text-muted-foreground text-xs flex items-center justify-center gap-1 mt-1">
                            <a
                                href={lang === "de"
                                    ? "https://de.wikipedia.org/wiki/Bernoulli-Verteilung"
                                    : "https://en.wikipedia.org/wiki/Bernoulli_distribution"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                            >
                                {lang === "de" ? "Mehr erfahren" : "Learn more"}
                                <ArrowUpRightIcon className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                )}

                {algo === "Gaussian" && (
                    <div>
                        <p>
                            {lang === "de"
                                ? "Die gaußsche Verteilung beschreibt, wie stark die Resultate einzelner Kampagnen um einen typischen Durchschnitt schwanken – sie können sowohl positive als auch negative Werte aufweisen."
                                : "The Gaussian bandit uses continuous payouts, drawn from a normal distribution for each arm."}
                        </p>

                        <div className="text-muted-foreground text-xs flex items-center justify-center gap-1 mt-1">
                            <a
                                href={lang === "de"
                                    ? "https://de.wikipedia.org/wiki/Normalverteilung"
                                    : "https://en.wikipedia.org/wiki/Normal_distribution"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                            >
                                Learn more
                                <ArrowUpRightIcon className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
