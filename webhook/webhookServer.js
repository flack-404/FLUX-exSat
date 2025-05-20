import express from "express";
import http from "http";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(bodyParser.json());

// Secret key for webhook authentication (use the one from .env or generate a random one)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || generateRandomSecret();

// Log directory
const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

// Create a log file for webhook events
const logFilePath = path.join(LOG_DIR, `webhook-events-${new Date().toISOString().split("T")[0]}.log`);

// Generate a random secret key
function generateRandomSecret(length = 32) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Log event to file
function logEvent(event) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${JSON.stringify(event)}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
        }
    });
}

// Webhook endpoint
app.post("/webhook", (req, res) => {
    const requestSecret = req.query.key;
    if (requestSecret && requestSecret !== WEBHOOK_SECRET) {
        return res.status(401).json({ error: "Invalid webhook secret" });
    }

    const webhookData = req.body;
    console.log("Received webhook event:", webhookData.type);
    logEvent(webhookData);

    switch (webhookData.type) {
        case "success":
            console.log(`Payment #${webhookData.paymentId} processed successfully`);
            break;
        case "warning":
            console.log(`Warning: ${webhookData.message}`);
            break;
        case "error":
            console.error(`Error: ${webhookData.message}`);
            break;
        default:
            console.log(`Received event type: ${webhookData.type}`);
    }

    res.status(200).json({ received: true });
});

// Start the server
const PORT = process.env.WEBHOOK_PORT || 3001;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
    console.log(`Webhook URL: http://localhost:${PORT}/webhook?key=${WEBHOOK_SECRET}`);
    console.log(`Use this URL as the WEBHOOK_URL in your .env file`);
    console.log(`Events will be logged to: ${logFilePath}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.log("Shutting down webhook server...");
    server.close(() => {
        console.log("Webhook server stopped");
        process.exit(0);
    });
});
