import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle({ lang }) {

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <Button
            onClick={toggleTheme}
            variant="outline"
            className="flex items-center gap-2"
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark
                ? lang === "de" ? "Hell" : "Light"
                : lang === "de" ? "Dunkel" : "Dark"}
        </Button>
    );
}