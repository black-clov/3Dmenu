import express from "express";
import http from "http";
import { Server } from "socket.io";
import admin from "firebase-admin";
import dotenv from "dotenv";
import crypto from "crypto";
import cors from "cors";

dotenv.config(); // Load environment variables from .env

// Validate required environment variables
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

// Initialize Express app
const app = express();

// Enable CORS for REST API routes, including LAN frontend origin
app.use(cors({
  origin: [
    "http://192.168.43.82:5173",
    "http://localhost:5173",
    "https://black-clov.github.io"
  ],
  credentials: true,
}));

// Firebase Admin SDK initialization
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

// Create HTTP server and Socket.io instance with CORS for sockets
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://192.168.43.82:5173",
      "http://localhost:5173",
      "https://black-clov.github.io"
    ],
    methods: ["GET","POST"],
    credentials: true,
  }
});

// Analytics state
let analytics = {
  totalVisitors: 0,
  pageClicks: {},
  shares: {},
  salesTrend: [],
};

// Map socket IDs to client IDs
const socketClientMap = new Map();

// Helper to generate new token
function generateToken(length = 12) {
  return crypto.randomBytes(length).toString("hex");
}

// API to get current valid token for a table of a specific business
// If no valid token exists, generate a new one
app.get("/api/tokens/current", async (req, res) => {
  const { businessId, tableId } = req.query;
  if (!businessId || !tableId) {
    return res.status(400).json({ error: "Missing businessId or tableId parameter" });
  }
  try {
    const tokensSnapshot = await db.ref(`tokens/${businessId}/${tableId}`)
      .orderByChild("used").equalTo(false).once("value");
    const tokens = tokensSnapshot.val();

    console.log("Tokens fetched for business", businessId, "table", tableId, ":", tokens);

    const now = Date.now();

    // Filter tokens that are unused and not expired
    let validTokens = [];
    if (tokens) {
      validTokens = Object.entries(tokens).filter(
        ([token, data]) => data.expiresAt > now && data.used === false
      );
    }

    console.log("Valid tokens array:", validTokens);

    if (validTokens.length === 0) {
      // No valid tokens found, generate a new one
      const newToken = generateToken();
      const newTokenData = {
        createdAt: now,
        expiresAt: now + 60 * 60 * 1000, // valid for 1 hour
        used: false
      };
      await db.ref(`tokens/${businessId}/${tableId}/${newToken}`).set(newTokenData);
      console.log(`Generated new token ${newToken} for table ${tableId} business ${businessId}`);
      return res.json({ token: newToken, expiresAt: newTokenData.expiresAt });
    }

    const [tokenKey, tokenData] = validTokens[0];
    res.json({ token: tokenKey, expiresAt: tokenData.expiresAt });
  } catch (error) {
    console.error("Error fetching or generating token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  analytics.totalVisitors += 1;
  db.ref("analytics").set(analytics).catch(console.error);

  socket.on("identifyUser", (clientId) => {
    console.log(`Socket ${socket.id} identified as clientId: ${clientId}`);
    socket.clientId = clientId;
    socketClientMap.set(socket.id, clientId);
  });

  socket.on("trackEvent", (data) => {
    const clientId = data.clientId || socket.clientId || socketClientMap.get(socket.id) || "unknown";

    const eventWithTime = {
      ...data,
      clientId,
      tableId: data.tableId || "unknown",
      timestamp: Date.now(),
      timeString: new Date().toISOString(),
    };

    console.log("Tracked event:", eventWithTime);

    db.ref("events").push(eventWithTime)
      .then(() => console.log("Event pushed to Firebase"))
      .catch(console.error);

    switch (data.eventName) {
      case "Comment Sent":
        console.log("New Comment Sent:", eventWithTime.commentText);
        break;
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

    db.ref("analytics").set(analytics)
      .then(() => console.log("Analytics updated"))
      .catch(console.error);

    io.emit("analyticsUpdate", analytics);
  });

  socket.on("submitOrder", async (orderData) => {
    console.log("Received order:", orderData);

    const clientId = socket.clientId || "unknown";
    const { businessId, tableName, sessionToken } = orderData;

    if (!businessId || !tableName || !sessionToken) {
      socket.emit("orderError", { error: "Missing businessId, table name or session token" });
      return;
    }

    try {
      const tokenRef = db.ref(`tokens/${businessId}/${tableName}/${sessionToken}`);
      const snapshot = await tokenRef.once("value");
      const tokenData = snapshot.val();

      if (!tokenData) {
        socket.emit("orderError", { error: "Invalid session token" });
        return;
      }

      const now = Date.now();

      if (tokenData.used) {
        socket.emit("orderError", { error: "Session token has already been used" });
        return;
      }

      if (tokenData.expiresAt < now) {
        socket.emit("orderError", { error: "Session token has expired" });
        return;
      }

      const orderWithMeta = {
        ...orderData,
        userId: orderData.userId || clientId,
        timestamp: now,
        timeString: new Date().toISOString(),
      };

      const orderRef = db.ref("orders").push();
      await orderRef.set(orderWithMeta);

      await tokenRef.update({ used: true });

      const newToken = generateToken();
      const newTokenData = {
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000,
        used: false,
      };
      await db.ref(`tokens/${businessId}/${tableName}/${newToken}`).set(newTokenData);
      console.log(`Generated new token ${newToken} for table ${tableName} business ${businessId}`);

      socket.emit("orderReceived", { orderId: orderRef.key, status: "received" });
    } catch (err) {
      console.error("Failed processing order:", err);
      socket.emit("orderError", { error: "Internal server error" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    socketClientMap.delete(socket.id);
  });
});

app.get('/redirect/:businessId/:tableId', async (req, res) => {
  const { businessId, tableId } = req.params;
  if (!businessId || !tableId) {
    return res.status(400).send('Missing businessId or tableId parameter');
  }
  try {
    const now = Date.now();
    const tokensRef = db.ref(`tokens/${businessId}/${tableId}`);
    const tokensSnapshot = await tokensRef.orderByChild('used').equalTo(false).once('value');
    const tokens = tokensSnapshot.val();

    let tokenKey;
    if (!tokens) {
      tokenKey = generateToken();
      const newTokenData = {
        createdAt: now,
        expiresAt: now + 60 * 60 * 1000,
        used: false,
      };
      await tokensRef.child(tokenKey).set(newTokenData);
    } else {
      const validTokens = Object.entries(tokens).filter(
        ([token, data]) => data.expiresAt > now && data.used === false
      );
      if (validTokens.length === 0) {
        tokenKey = generateToken();
        const newTokenData = {
          createdAt: now,
          expiresAt: now + 60 * 60 * 1000,
          used: false,
        };
        await tokensRef.child(tokenKey).set(newTokenData);
      } else {
        [tokenKey] = validTokens[0];
      }
    }

    const redirectUrl = `https://black-clov.github.io/3Dmenu/#/category/restaurant/business/${businessId}/table/${tableId}?token=${tokenKey}`;
    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Error handling redirect:', error);
    return res.status(500).send('Internal server error');
  }
});

app.get('/test', (req, res) => res.send('Backend is working'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
