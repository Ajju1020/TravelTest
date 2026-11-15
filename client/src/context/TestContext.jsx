import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [testCases, setTestCases] = useState([]);
  const [stats, setStats] = useState({ total: 26, passed: 0, failed: 0, pending: 26, successRate: 0 });
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeRunId, setActiveRunId] = useState(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [liveLogs, setLiveLogs] = useState([]);
  const [runProgress, setRunProgress] = useState({ current: 0, total: 26, percent: 0 });
  const [latestCompletedRun, setLatestCompletedRun] = useState(null);

  const eventSourceRef = useRef(null);

  const fetchTestCases = async () => {
    try {
      const res = await fetch("/api/tests/cases");
      const json = await res.json();
      if (json.success) {
        setTestCases(json.testCases);
        setStats({
          total: json.total,
          passed: json.passed,
          failed: json.failed,
          pending: json.pending,
          successRate: json.successRate
        });
      }
    } catch (err) {
      console.error("Failed to load test cases:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/tests/history");
      const json = await res.json();
      if (json.success) {
        setHistory(json.history);
        if (json.history.length > 0 && !latestCompletedRun) {
          setLatestCompletedRun(json.history[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch test history:", err);
    }
  };

  // Setup Server-Sent Events listener
  useEffect(() => {
    fetchTestCases();
    fetchHistory();

    const connectSSE = () => {
      const es = new EventSource("/api/tests/run-stream");
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          handleSSEEvent(type, payload);
        } catch (e) {
          console.error("Error parsing SSE:", e);
        }
      };

      es.onerror = (e) => {
        // Reconnect after brief interval if lost
        es.close();
        setTimeout(connectSSE, 3000);
      };
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSSEEvent = (type, payload) => {
    switch (type) {
      case "run:start":
        setIsRunning(true);
        setActiveRunId(payload.runId);
        setIsLiveModalOpen(true);
        setLiveLogs([{ time: new Date().toLocaleTimeString(), level: "INFO", msg: `--- Test Run Started: ${payload.runId} (${payload.total} cases) ---` }]);
        setRunProgress({ current: 0, total: payload.total, percent: 0 });
        break;

      case "test:start":
        setCurrentTest({
          id: payload.testId,
          title: payload.title,
          module: payload.module,
          index: payload.index,
          total: payload.total
        });
        setRunProgress(prev => ({
          ...prev,
          current: payload.index - 1,
          percent: Math.round(((payload.index - 1) / payload.total) * 100)
        }));
        setTestCases(prev => prev.map(tc => tc.id === payload.testId ? { ...tc, status: "RUNNING" } : tc));
        break;

      case "step:log":
        setLiveLogs(prev => [...prev.slice(-200), { time: payload.time, level: payload.level, msg: payload.msg, testId: payload.testId }]);
        break;

      case "test:finish":
        setTestCases(prev => prev.map(tc => tc.id === payload.testId ? {
          ...tc,
          status: payload.status,
          durationMs: payload.durationMs,
          error: payload.error ? payload.error.message : null
        } : tc));
        setRunProgress(prev => ({
          ...prev,
          current: payload.completed,
          percent: Math.round((payload.completed / payload.total) * 100)
        }));
        break;

      case "run:complete":
        setIsRunning(false);
        setLatestCompletedRun(payload);
        fetchTestCases();
        fetchHistory();
        break;

      default:
        break;
    }
  };

  const runAllTests = async (delayMs = 200) => {
    setIsLiveModalOpen(true);
    setIsRunning(true);
    try {
      const res = await fetch("/api/tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delayMs })
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error("Run all tests error:", err);
      setIsRunning(false);
    }
  };

  const runSingleTest = async (testId, delayMs = 250) => {
    setIsLiveModalOpen(true);
    setIsRunning(true);
    try {
      const res = await fetch("/api/tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testIds: [testId], delayMs })
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(`Run single test ${testId} error:`, err);
      setIsRunning(false);
    }
  };

  const runModuleTests = async (moduleKey, delayMs = 200) => {
    const moduleCases = testCases.filter(tc => tc.module === moduleKey);
    const ids = moduleCases.map(tc => tc.id);
    setIsLiveModalOpen(true);
    setIsRunning(true);
    try {
      const res = await fetch("/api/tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testIds: ids, delayMs })
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(`Run module ${moduleKey} tests error:`, err);
      setIsRunning(false);
    }
  };

  return (
    <TestContext.Provider
      value={{
        testCases,
        stats,
        history,
        isRunning,
        activeRunId,
        isLiveModalOpen,
        setIsLiveModalOpen,
        currentTest,
        liveLogs,
        runProgress,
        latestCompletedRun,
        runAllTests,
        runSingleTest,
        runModuleTests,
        refreshCases: fetchTestCases,
        refreshHistory: fetchHistory
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => useContext(TestContext);
