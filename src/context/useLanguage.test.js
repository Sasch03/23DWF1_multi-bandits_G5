import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { LanguageContext } from "./LanguageContext.js";
import { useLanguage } from "./useLanguage.js";

describe("useLanguage", () => {
    it("should return the context value when used inside a LanguageProvider", () => {
        const mockValue = { lang: "de", setLang: () => {} };

        const wrapper = ({ children }) =>
            React.createElement(
                LanguageContext.Provider,
                { value: mockValue },
                children
            );

        const { result } = renderHook(() => useLanguage(), { wrapper });
        expect(result.current).toEqual(mockValue);
    });
});
