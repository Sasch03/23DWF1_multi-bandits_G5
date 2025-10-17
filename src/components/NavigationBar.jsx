import React from "react";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { ArrowUpRightIcon } from "lucide-react";

export default function NavigationBar({ type, setType, running, lang }) {

    const navItems = [
        { value: "Bernoulli", label_de: "Bernoulli", label_en: "Bernoulli" },
        { value: "Gaussian", label_de: "Gaußsche", label_en: "Gaussian" }
    ];

    const renderDistributionExplanation = (navItem) => {
        const isBernoulli = navItem.value === "Bernoulli";
        const explanationText = isBernoulli
            ? (lang === "de"
                ? "Die Bernoulli-Verteilung beschreibt, ob eine einzelne Kampagne erfolgreich Geld bringt (1) oder fehlschlägt (0) – also ein reines Ja/Nein-Ergebnis."
                : "The Bernoulli distribution describes whether a single campaign successfully generates money (1) or fails (0) – in other words, a pure yes/no result.")
            : (lang === "de"
                ? "Die gaußsche Verteilung beschreibt, wie stark die Resultate einzelner Kampagnen um einen typischen Durchschnitt schwanken – sie können sowohl positive als auch negative Werte aufweisen."
                : "The Gaussian distribution describes how much the results of individual campaigns fluctuate around a typical average – they can have both positive and negative values.");

        const wikiLink = isBernoulli
            ? (lang === "de"
                ? "https://de.wikipedia.org/wiki/Bernoulli-Verteilung"
                : "https://en.wikipedia.org/wiki/Bernoulli_distribution")
            : (lang === "de"
                ? "https://de.wikipedia.org/wiki/Normalverteilung"
                : "https://en.wikipedia.org/wiki/Normal_distribution");

        const linkLabel = lang === "de" ? "Mehr erfahren" : "Learn more";

        return (
            <div>
                <p>{explanationText}</p>
                <div className="text-muted-foreground text-xs flex items-center justify-center gap-1 mt-1">
                    <a
                        href={wikiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                    >
                        {linkLabel}
                        <ArrowUpRightIcon className="w-3 h-3" />
                    </a>
                </div>
            </div>
        );
    };

    const handleNavClick = (navItem, e) => {
        e.preventDefault();
        if (running) return;
        setType(navItem.value);
    };

    return (
        <div className="mb-6 w-full text-center">
            {/* Navigation Menu */}
            <NavigationMenu className="bg-card border border-border rounded-md shadow-sm px-4 py-2 inline-block">
                <NavigationMenuList className="justify-center space-x-4">
                    {navItems.map((navItem) => (
                        <NavigationMenuItem key={navItem.value}>
                            <NavigationMenuLink
                                href="#"
                                onClick={(e) => handleNavClick(navItem, e)}
                                className={`px-3 py-1 rounded font-medium transition-colors 
                                    ${type === navItem.value
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-primary/20 hover:text-primary"} 
                                    ${running ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {lang === "de" ? navItem.label_de : navItem.label_en}
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Explanation text */}
            <div className="mt-4 text-sm text-muted-foreground space-y-2">
                {renderDistributionExplanation({ value: type })}
            </div>
        </div>
    );
}
