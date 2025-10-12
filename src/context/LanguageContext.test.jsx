import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import userEvent from "@testing-library/user-event";

/**
 * Test component that consumes LanguageContext using the useLanguage hook.
 * It displays the current language and has a button to toggle it.
 */
const TestConsumer = () => {
    const { lang, setLang } = useLanguage();
    return (
        <div>
            <p>Current Language: {lang}</p>
            <button onClick={() => setLang(lang === "de" ? "en" : "de")}>
                Toggle Language
            </button>
        </div>
    );
};

describe("LanguageContext", () => {
    it("provides default language 'de'", () => {
        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        expect(screen.getByText(/Current Language: de/)).toBeInTheDocument();
    });

    it("allows language change through setLang", async () => {
        const user = userEvent.setup();

        render(
            <LanguageProvider>
                <TestConsumer />
            </LanguageProvider>
        );

        await user.click(screen.getByRole("button", { name: /Toggle Language/i }));

        expect(screen.getByText(/Current Language: en/)).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /Toggle Language/i }));

        expect(screen.getByText(/Current Language: de/)).toBeInTheDocument();
    });
});