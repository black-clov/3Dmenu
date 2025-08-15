import { useCallback } from "react";

const STORAGE_KEY = "analytics_events";

export function useAnalytics() {
    const logEvent = useCallback((type, details) => {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        existing.push({ type, details, timestamp: Date.now() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }, []);

    const getEvents = useCallback(() => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }, []);

    return { logEvent, getEvents };
}
