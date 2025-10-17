import React from "react";
import { Button } from "@/components/ui/button";

/**
 * LanguageToggle Component
 *
 * Renders a button that toggles the application's language between German ("de") and English ("en").
 * Clicking the button calls `setLang` with the alternate language code.
 *
 * @component
 *
 * @param {object} props
 * @param {"de"|"en"} props.lang - Current language code.
 * @param {function(string): void} props.setLang - Function to update the current language.
 * @returns {JSX.Element} Rendered toggle button.
 */
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