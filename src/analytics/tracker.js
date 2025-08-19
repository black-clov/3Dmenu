import { sendEvent } from "../services/analyticsService";

// Generate a unique sessionId if not exists
const getSessionId = () => {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
};

export const trackEvent = (eventType, details = {}) => {
    const event = {
        sessionId: getSessionId(),
        type: eventType,
        details,
        timestamp: new Date().toISOString(),
    };
    sendEvent(event);
};

// Example usage in components:
// trackEvent("page_click", { page: "BusinessList" });
// trackEvent("share_click", { platform: "WhatsApp" });
