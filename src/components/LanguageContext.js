// LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage if exists, else default to 'fr'
  const [language, setLanguage] = useState(() => 
    localStorage.getItem("appLanguage") || "fr"
  );

  // Persist language to localStorage on changes
  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy consumption
export const useLanguage = () => useContext(LanguageContext);
