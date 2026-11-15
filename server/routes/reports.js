import express from "express";
import { dataStore } from "../services/dataStore.js";
import { testCases } from "../services/testCases.js";

const router = express.Router();

router.get("/summary", (req, res) => {
  const history = dataStore.getTestHistory();
  const latestRun = history.length > 0 ? history[0] : null;

  let totalRuns = history.length;
  let totalTestsExecuted = history.reduce((acc, h) => acc + (h.total || 0), 0);
  let totalPassed = history.reduce((acc, h) => acc + (h.passed || 0), 0);
  let totalFailed = history.reduce((acc, h) => acc + (h.failed || 0), 0);
  let overallSuccessRate = totalTestsExecuted > 0 ? Math.round((totalPassed / totalTestsExecuted) * 100) : 0;

  // Module breakdown based on latest run or test cases
  const moduleKeys = [
    { key: "bus_train", label: "Bus & Train Reservation" },
    { key: "movie", label: "Movie Ticket Booking" },
    { key: "cab", label: "Cab Booking" },
    { key: "event", label: "Event Registration" }
  ];

  const moduleBreakdown = moduleKeys.map(m => {
    const totalInModule = testCases.filter(c => c.module === m.key).length;
    let passedInModule = 0;
    let failedInModule = 0;

    if (latestRun && latestRun.results) {
      const modResults = latestRun.results.filter(r => r.module === m.key);
      passedInModule = modResults.filter(r => r.status === "PASSED").length;
      failedInModule = modResults.filter(r => r.status === "FAILED").length;
    }

    return {
      moduleKey: m.key,
      moduleLabel: m.label,
      total: totalInModule,
      passed: passedInModule,
      failed: failedInModule,
      successRate: totalInModule > 0 ? Math.round((passedInModule / totalInModule) * 100) : 0
    };
  });

  res.json({
    success: true,
    summary: {
      totalRuns,
      totalTestsExecuted,
      totalPassed,
      totalFailed,
      overallSuccessRate,
      latestRun,
      moduleBreakdown
    }
  });
});

// CSV Export Download
router.get("/export/csv", (req, res) => {
  const history = dataStore.getTestHistory();
  const rows = [
    ["Run ID", "Run Timestamp", "Test Case ID", "Module", "Test Title", "Status", "Duration (ms)", "Error Message"]
  ];

  if (history.length === 0) {
    // If no history yet, export test cases table
    for (const tc of testCases) {
      rows.push([
        "NOT_EXECUTED",
        new Date().toISOString(),
        tc.id,
        tc.moduleTitle,
        `"${tc.title.replace(/"/g, '""')}"`,
        "PENDING",
        "0",
        ""
      ]);
    }
  } else {
    for (const run of history) {
      if (run.results && run.results.length > 0) {
        for (const r of run.results) {
          rows.push([
            run.runId,
            run.timestamp,
            r.testId,
            r.moduleTitle || r.module,
            `"${(r.title || "").replace(/"/g, '""')}"`,
            r.status,
            r.durationMs || 0,
            `"${(r.error || "").replace(/"/g, '""')}"`
          ]);
        }
      }
    }
  }

  const csvContent = rows.map(r => r.join(",")).join("\r\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="TravelTest_Automation_Report_${Date.now()}.csv"`);
  res.send(csvContent);
});

export default router;
