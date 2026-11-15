import React, { useRef, useEffect } from "react";
import { X, Terminal, CheckCircle2, AlertCircle, RefreshCw, Activity, Cpu } from "lucide-react";
import { useTest } from "../../context/TestContext";

export const LiveRunnerModal = () => {
  const {
    isLiveModalOpen,
    setIsLiveModalOpen,
    isRunning,
    currentTest,
    liveLogs,
    runProgress,
    latestCompletedRun
  } = useTest();

  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveLogs]);

  if (!isLiveModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => !isRunning && setIsLiveModalOpen(false)}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-base">Playwright Live Test Console</h3>
                  {isRunning ? (
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>LIVE AUTOMATION</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>IDLE / COMPLETED</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {currentTest
                    ? `[${currentTest.id}] ${currentTest.title}`
                    : isRunning
                    ? "Initializing test harness..."
                    : "Test execution finished"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiveModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Tracker Strip */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
              <span>
                Progress: {runProgress.current} / {runProgress.total} test cases
              </span>
              <span className="font-mono font-bold text-brand-400">{runProgress.percent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 via-indigo-500 to-accent-500 h-full transition-all duration-300"
                style={{ width: `${runProgress.percent}%` }}
              />
            </div>
          </div>

          {/* Terminal Logs Window */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs bg-slate-950/90 text-slate-300 space-y-1.5 select-text">
            {liveLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <Activity className="w-8 h-8 text-slate-600 animate-pulse" />
                <p>Waiting for test execution trigger...</p>
                <p className="text-[11px] text-slate-600">Click "Run All Tests" or trigger any test case.</p>
              </div>
            ) : (
              liveLogs.map((log, index) => {
                let badgeClass = "text-slate-400";
                if (log.level === "STEP") badgeClass = "text-brand-400 font-semibold";
                if (log.level === "SUCCESS") badgeClass = "text-emerald-400 font-bold";
                if (log.level === "ERROR") badgeClass = "text-rose-400 font-bold bg-rose-950/40 px-1 py-0.5 rounded";

                return (
                  <div key={index} className="flex items-start space-x-2.5 leading-relaxed hover:bg-slate-900/50 px-2 py-0.5 rounded">
                    <span className="text-slate-600 shrink-0 text-[10px] select-none">{log.time}</span>
                    <span className={`shrink-0 uppercase text-[10px] tracking-wider w-14 ${badgeClass}`}>
                      [{log.level}]
                    </span>
                    <span className="break-all">{log.msg}</span>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Bottom Execution Summary Footer */}
          <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-500" />
                <span>Playwright Node v24 • Chrome Engine</span>
              </span>
              {latestCompletedRun && !isRunning && (
                <span className="font-semibold text-emerald-400">
                  Last Run Success Rate: {latestCompletedRun.successRate}% ({latestCompletedRun.passed} passed, {latestCompletedRun.failed} failed)
                </span>
              )}
            </div>

            <button
              onClick={() => setIsLiveModalOpen(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition"
            >
              Close Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
