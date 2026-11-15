import express from "express";
import { testRunner } from "../services/testRunner.js";
import { dataStore } from "../services/dataStore.js";

const router = express.Router();

// GET all 26 test cases with their latest status
router.get("/cases", (req, res) => {
  const cases = testRunner.getTestCases();
  const history = dataStore.getTestHistory();
  const latestRun = history.length > 0 ? history[0] : null;

  const enrichedCases = cases.map(c => {
    let latestStatus = "PENDING";
    let lastDurationMs = null;
    let lastError = null;
    let lastRunTimestamp = null;

    if (latestRun && latestRun.results) {
      const match = latestRun.results.find(r => r.testId === c.id);
      if (match) {
        latestStatus = match.status;
        lastDurationMs = match.durationMs;
        lastError = match.error;
        lastRunTimestamp = match.timestamp;
      }
    }

    return {
      ...c,
      status: latestStatus,
      durationMs: lastDurationMs,
      error: lastError,
      lastRun: lastRunTimestamp
    };
  });

  const total = enrichedCases.length;
  const passed = enrichedCases.filter(c => c.status === "PASSED").length;
  const failed = enrichedCases.filter(c => c.status === "FAILED").length;
  const pending = enrichedCases.filter(c => c.status === "PENDING").length;

  res.json({
    success: true,
    total,
    passed,
    failed,
    pending,
    successRate: (passed + failed) > 0 ? Math.round((passed / (passed + failed)) * 100) : 0,
    testCases: enrichedCases
  });
});

// POST execute tests (all or specific test IDs)
router.post("/run", async (req, res) => {
  const { testIds, delayMs } = req.body;
  try {
    const result = await testRunner.runTests(testIds, { delayMs });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Server-Sent Events (SSE) live progress stream
router.get("/run-stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);

  const unsubscribe = testRunner.subscribe((type, payload) => {
    res.write(`data: ${JSON.stringify({ type, payload })}\n\n`);
  });

  req.on("close", () => {
    unsubscribe();
  });
});

// GET execution history
router.get("/history", (req, res) => {
  const history = dataStore.getTestHistory();
  res.json({ success: true, count: history.length, history });
});

// GET current runner status
router.get("/status", (req, res) => {
  res.json({
    success: true,
    isRunning: !!testRunner.activeRun,
    activeRun: testRunner.activeRun
  });
});

export default router;
