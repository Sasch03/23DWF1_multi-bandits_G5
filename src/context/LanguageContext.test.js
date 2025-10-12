import { describe, it, expect } from "vitest";
import React from "react";
import { LanguageContext } from "./LanguageContext";

describe("LanguageContext", () => {
    it("should be defined", () => {
        expect(LanguageContext).toBeDefined();
    });

    it("should have a Provider property", () => {
        // Use React.createElement instead of JSX
        const element = React.createElement(LanguageContext.Provider);
        expect(React.isValidElement(element)).toBe(true);
    });

    it("should have a Consumer property", () => {
        expect(typeof LanguageContext.Consumer).toBe("object");
    });
});
