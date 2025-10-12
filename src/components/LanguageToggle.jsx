import React from "react";
import { Button } from "@/components/ui/button";

export default function LanguageToggle({ lang, setLang }) {
    const toggleLang = () => {
        setLang(lang === "de" ? "en" : "de");
    };

    return (
        <Button
            onClick={toggleLang}
            variant="outline"
            className="flex items-center gap-2"
        >
            {lang === "de" ? "DE" : "EN"}
        </Button>
    );
}