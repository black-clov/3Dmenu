import express from "express";
import http from "http";
import { Server } from "socket.io";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

// --- Validate required environment variables
const requiredEnv = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_CLIENT_ID",
    "FIREBASE_DATABASE_URL"
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing required env variable: ${key}`);
        process.exit(1);
    }
});

// --- Firebase Admin SDK initialization
const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
    universe_domain: "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

// --- Express & Socket.io setup
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

// --- Socket.io connections
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    analytics.totalVisitors += 1;
    db.ref("analytics")
        .set(analytics)
        .then(() => console.log("Total visitors updated"))
        .catch(console.error);

    // --- Receive and store tracked events
    socket.on("trackEvent", (data) => {
        // Ensure clientId exists
        if (!data.clientId) {
            console.warn("trackEvent missing clientId, assigning 'unknown'");
            data.clientId = "unknown";
        }

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

        // --- Update analytics counters
        switch (data.eventName) {
            case "Category Click":
                analytics.pageClicks[data.categoryId] = (analytics.pageClicks[data.categoryId] || 0) + 1;
                break;
            case "Share Click":
                analytics.shares[data.platform] = (analytics.shares[data.platform] || 0) + 1;
                break;
            case "Business Click":
                analytics.pageClicks[data.businessId] = (analytics.pageClicks[data.businessId] || 0) + 1;
                break;
            case "Item Click":
                analytics.pageClicks[data.itemId] = (analytics.pageClicks[data.itemId] || 0) + 1;
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

    // --- Optional: store user socket association
    socket.on("identifyUser", (clientId) => {
        console.log(`Socket ${socket.id} identified as clientId: ${clientId}`);
        socket.clientId = clientId; // store in socket object if needed later
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// --- Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
