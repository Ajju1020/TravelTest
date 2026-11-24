import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import masterDataRoutes from "./routes/masterData.js";
import bookingsRoutes from "./routes/bookings.js";
import testsRoutes from "./routes/tests.js";
import reportsRoutes from "./routes/reports.js";
import settingsRoutes from "./routes/settings.js";
import paymentRoutes from "./routes/payment.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", masterDataRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/tests", testsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/settings", settingsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    name: "TravelTest Automation Platform Server",
    version: "1.1.0",
    paymentGateway: "Razorpay Test Mode Active",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});


// Serve static client assets in production
const clientDistPath = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` TravelTest Automation Server running on port ${PORT}`);
  console.log(` API Health: http://localhost:${PORT}/api/health`);
  console.log(` Payment API: http://localhost:${PORT}/api/payment/stats`);
  console.log(` Test Cases: http://localhost:${PORT}/api/tests/cases`);
  console.log(`=======================================================`);
});
