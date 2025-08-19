// index.js
import admin from "firebase-admin";
import express from "express";
import http from "http";
import { Server } from "socket.io";

// --- Firebase Admin SDK initialization (using environment variables)
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

const db = admin.database();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://black-clov.github.io",
        methods: ["GET", "POST"],
    },
});

// --- Analytics state
let analytics = {
    totalVisitors: 0,
    pageClicks: {},
    shares: {},
    salesTrend: [],
};

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Increment total visitors
    analytics.totalVisitors += 1;
    db.ref("analytics")
        .set(analytics)
        .then(() => console.log("Total visitors updated"))
        .catch(console.error);

    socket.on("trackEvent", (data) => {
        console.log("Tracked event:", data);

        const eventWithTime = {
            ...data,
            timestamp: Date.now(),
            timeString: new Date().toISOString(),
        };

        db.ref("events")
            .push(eventWithTime)
            .then(() => console.log("Event pushed to Firebase with timestamp"))
            .catch(console.error);

        // Update analytics counters
        switch (data.eventName) {
            case "Category Click":
                analytics.pageClicks[data.categoryId] =
                    (analytics.pageClicks[data.categoryId] || 0) + 1;
                break;
            case "Share Click":
                analytics.shares[data.platform] =
                    (analytics.shares[data.platform] || 0) + 1;
                break;
            case "Business Click":
                analytics.pageClicks[data.businessId] =
                    (analytics.pageClicks[data.businessId] || 0) + 1;
                break;
            case "Item Click":
                analytics.pageClicks[data.itemId] =
                    (analytics.pageClicks[data.itemId] || 0) + 1;
                break;
            default:
                break;
        }

        db.ref("analytics")
            .set(analytics)
            .then(() => console.log("Analytics updated in Firebase"))
            .catch(console.error);

        io.emit("analyticsUpdate", analytics);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

server.listen(5000, () => {
    console.log("Backend running on port 5000");
});
