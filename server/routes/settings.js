import express from "express";
import { dataStore } from "../services/dataStore.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    bugSettings: dataStore.getBugSettings(),
    executionConfig: dataStore.getExecutionConfig()
  });
});

router.post("/bugs", (req, res) => {
  const updated = dataStore.updateBugSettings(req.body);
  res.json({ success: true, bugSettings: updated });
});

router.post("/config", (req, res) => {
  const updated = dataStore.updateExecutionConfig(req.body);
  res.json({ success: true, executionConfig: updated });
});

router.post("/reset", (req, res) => {
  dataStore.reset();
  res.json({ success: true, message: "System state and test history reset to default." });
});

export default router;
