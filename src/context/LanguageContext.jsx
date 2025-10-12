import React, { createContext, useContext, useState } from "react";

// Context erzeugen
const LanguageContext = createContext();

// Provider-Komponente
export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState("de"); // Standard: Deutsch

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hilfsfunktion zum Verwenden des Contexts
export const useLanguage = () => {
    return useContext(LanguageContext);
};