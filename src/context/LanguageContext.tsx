import { createContext, useContext, useState } from "react";

type Language = "EN" | "UA";

interface LangContextType {
  lang: Language;
  toggleLang: () => void;
  setLang: (value: Language) => void;   // <-- ADD THIS
}

const LanguageContext = createContext<LangContextType>({
  lang: "EN",
  toggleLang: () => {},
  setLang: () => {},  // <-- ADD THIS
});

export const LanguageProvider = ({ children }: any) => {
  const [lang, setLang] = useState<Language>("EN");

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "UA" : "EN"));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
