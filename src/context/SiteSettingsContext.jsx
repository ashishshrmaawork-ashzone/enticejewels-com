"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getFreshGeneralSettings } from "@/lib/api";
const SiteSettingsContext = createContext({});
export function SiteSettingsProvider({ children, initialSettings = {} }) {
  const [settings, setSettings] = useState(initialSettings);
  useEffect(() => { let active = true; getFreshGeneralSettings().then((data) => { if (active) setSettings(data); }).catch(() => {}); return () => { active = false; }; }, []);
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}
export function useSiteSettings() { return useContext(SiteSettingsContext); }
