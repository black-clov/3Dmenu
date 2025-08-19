// index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import admin from "firebase-admin";

// --- Firebase Admin SDK initialization (using JSON data directly)
const serviceAccount = {
    type: "service_account",
    project_id: "presentation3d-12c49",
    private_key_id: "27663ef4e9ef4ed6d4498db2733b7d2a31acb8da",
    private_key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCjdhWX2SqSWVQN
yeTAM7u+V/tgIUNv6yW7UcKaj0OYl6PJabwTMV2SnTdJEc18F6IOqG3QgQZEkfpp
3sEia3F6mbL9Yx3WB/lkrNqaSd9ZQfCogt5SktxSRgaEsegherGZsrK1+MbX1mip
Eaw+cy0DNut3edYpm5oGokyxJOkbOTM6WbTM4zHtM6ahERmcYBM9anRCGbdJu0cq
34FAGD2sF2Y8TLC5xCLrCCh6JKV0Gj60rx8VsBFoHxIVjbCVa3NhHNYOjPimJ00K
ThbMFBq5VLdrSDYRsjpCYYcVJu+oU9+BPsYs3G3ak4cDywb+dgvu4GOq0P3/oawm
iwDSqKBpAgMBAAECggEACM5DModx6ilixE1kg9AlpIbj1VVlZyGRSkqIw7/FAfLl
UWPfTF9j7ZKHmGmbmrxBMC31oH5a4pXEmjB0UhDcr6CZClptEIskbb58FkS1gf7x
4noOVP9xXANGtZ5J5YfRCnkcdH4e5CC6SaVYlJKq0ZoDTE/lcB9gSEw0+nQFFMDF
i0/QSQBTMUais7rR2pbfoJI6iDheG+XWV6jKbU3JCLpSfJpDK8hIIkNOURnk1dk/
c0UjMH/5XpSHpnuLtr5CGmyP2I+WNR5HdHvQ/i9QGEpHt83P6OYOCuyFYNtgCL9p
N2f1Ox+iaVk4N7osgf9EtW8H6UzcmDSpqs9SgouOAQKBgQDS6RmHNq6nxGxnkPqV
4dbV3En38Z9EBBsjL6UF2Ahi5dBeHynVrLossoZZwGs8Ud3A7IXCMdNRDc2SDYka
GghYphk0dg/Flu68rz9ASyxUx03kxvP1P4FjPsDPtUy0AN2BjQvtWQQ/anvShy52
ZMIPPt3MCNJb6SEl3QXjgCOTgQKBgQDGaCNiWhXtDpP7kJywp+JgVW1EaYB7KAuD
CyKME8Cl6b7pvLb5ytb+HwYZF5xWoDfUNrK84nkFohNE3IiLJjmaX3UE0WpBLym6
5oyladxnrHYgZ2Gm+UbZ6ojNUV4/RVKfJ49cbdTOnaf/P9rxiQFp8mmtixj/n0Z9
HdU3Sndg6QKBgQCt/dCqhEjnbBqGActHtIyX1uhKnFDoOn7ssxRvUr3wYGhaDVlk
xd68mvZMunl8xIis7DKYdqQ+nKV3FKWDG/DAuR3X8oGmXpJKpEQI1TsYIWc4EY0W
SDKEXjOP5qAFayVRB7vMLQBdFIpbrlt9HjgdfZ5aAPkRC6zl4IVIHeC7gQKBgE71
7u8bbxJy9M3vVYywo9U26k+JtUpOO5ahfdRFoCvnhMU9B40N/tYPvruJu/x1swJP
6n5lm0h0ojqLkgPe6JnZV5bdSO48ON1bF6pVIRRZfIGU4zYyitH7FwqvUVTY3/Lb
KaDdTQ4VjGB3J0ls/xUNFqWsb/x7hPASSWLBzhTRAoGAOEqqrq614aBEJJPp7QLZ
8u6El8rjnldJnpaEAh6f+GsGn8etoNbOL11rzTYYiSv+AWxiCKW3jazrCULgCklg
ezk5oUgcrbqwF0gNwBSCc6SZKgpSULZ+NQ6roWoY19j0etuamMpP0mQFfjaFZqfB
Tv1uRp+8Hl75xsxKXU7Ebgw=
-----END PRIVATE KEY-----\n`,
    client_email: "firebase-adminsdk-fbsvc@presentation3d-12c49.iam.gserviceaccount.com",
    client_id: "102300972914428749465",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40presentation3d-12c49.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://presentation3d-12c49-default-rtdb.firebaseio.com/"
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

// --- Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
