import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, setSettings } from '../utils/localStorage.js';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(() => getSettings());

  useEffect(() => {
    setSettings(settings);
  }, [settings]);

  function updateSettings(updates) {
    setSettingsState((prev) => ({ ...prev, ...updates }));
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
