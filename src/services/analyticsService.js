// For now we’ll use localStorage as backend simulation
// Later you can replace with a real API (Node/Django/etc.)

const STORAGE_KEY = "analytics_events";

export const sendEvent = (event) => {
    let events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    events.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const getAnalytics = async () => {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Aggregate clicks by page
    const pageClicks = {};
    const shares = {};

    events.forEach((e) => {
        if (e.type === "page_click") {
            const page = e.details.page || "Unknown";
            pageClicks[page] = (pageClicks[page] || 0) + 1;
        }
        if (e.type === "share_click") {
            const platform = e.details.platform || "Other";
            shares[platform] = (shares[platform] || 0) + 1;
        }
    });

    return {
        pageClicks: Object.entries(pageClicks).map(([page, count]) => ({
            page,
            count,
        })),
        shares: Object.entries(shares).map(([platform, count]) => ({
            platform,
            count,
        })),
    };
};
