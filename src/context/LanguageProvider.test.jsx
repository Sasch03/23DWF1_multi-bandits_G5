import { describe, it, expect } from "vitest";
import React, { useContext } from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils"; // <- act import
import { LanguageProvider } from "./LanguageProvider";
import { LanguageContext } from "./LanguageContext";

describe("LanguageProvider", () => {
    it("should render children", () => {
        const { getByText } = render(
            <LanguageProvider>
                <div>Test Child</div>
            </LanguageProvider>
        );

        expect(getByText("Test Child")).toBeTruthy();
    });

    it("should provide default language value", () => {
        let contextValue;

        const TestComponent = () => {
            contextValue = useContext(LanguageContext);
            return null;
        };

        render(
            <LanguageProvider>
                <TestComponent />
            </LanguageProvider>
        );

        expect(contextValue.lang).toBe("de");
        expect(typeof contextValue.setLang).toBe("function");
    });

    it("should allow changing the language", () => {
        let contextValue;

        const TestComponent = () => {
            contextValue = useContext(LanguageContext);
            return null;
        };

        render(
            <LanguageProvider>
                <TestComponent />
            </LanguageProvider>
        );

        // Wrap the state update in act
        act(() => {
            contextValue.setLang("en");
        });

        // Now the state has been updated
        expect(contextValue.lang).toBe("en");
    });
});
