// public/client.js
const socket = io("https://your-backend-url.onrender.com"); // replace with Render backend URL

// Always attach userId
const userId = getUserId();

function trackEvent(eventData) {
    socket.emit("trackEvent", {
        ...eventData,
        userId, // Attach unique userId
    });
}

// Example: track a category click
document.querySelectorAll(".category").forEach((el) => {
    el.addEventListener("click", () => {
        trackEvent({
            eventName: "Category Click",
            categoryId: el.dataset.categoryId,
            name: el.innerText,
        });
    });
});

// Example: track a share
document.querySelectorAll(".share").forEach((el) => {
    el.addEventListener("click", () => {
        trackEvent({
            eventName: "Share Click",
            platform: el.dataset.platform,
            name: el.dataset.name,
        });
    });
});

// Listen for analytics updates
socket.on("analyticsUpdate", (analytics) => {
    console.log("Updated analytics:", analytics);
});
