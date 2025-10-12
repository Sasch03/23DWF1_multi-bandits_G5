import React from "react";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink
} from "@/components/ui/navigation-menu";

export default function NavigationBar({ algo, setAlgo, running}) {
    const navItems = [
        { value: "Bernoulli", label: "Bernoulli" },
        { value: "Gaussian", label: "Gaussian" }
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
                                    if (running) return;        // nichts tun, wenn gerade läuft
                                    setAlgo(item.value);
                                }}
                                className={`px-3 py-1 rounded font-medium transition-colors 
                                    ${algo === item.value
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-primary/20 hover:text-primary"} 
                                    ${running ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                {item.label}
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Erklärungstext, abhängig vom ausgewählten Algo */}
            <div className="mt-4 text-sm text-muted-foreground">
                {algo === "Bernoulli" && (
                    <p>
                        The Bernoulli bandit works with discrete payouts (0 or 1),
                        based on fixed probabilities for each arm.
                    </p>
                )}
                {algo === "Gaussian" && (
                    <p>
                        The Gaussian bandit uses continuous payouts,
                        drawn from a normal distribution for each arm.
                    </p>
                )}
            </div>
        </div>
    );
}
