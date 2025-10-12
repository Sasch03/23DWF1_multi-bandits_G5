import { useContext } from "react";
import { LanguageContext } from "./LanguageContext.js";

export const useLanguage = () => useContext(LanguageContext);
