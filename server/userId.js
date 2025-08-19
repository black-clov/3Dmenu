// public/userId.js
// Utility to get/create a persistent unique userId

function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        // Generate a random UUIDv4
        userId = crypto.randomUUID();
        localStorage.setItem("userId", userId);
    }
    return userId;
}

// Expose globally for other scripts
window.getUserId = getUserId;
