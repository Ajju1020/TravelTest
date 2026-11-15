import React, { useState } from "react";
import {
  Download,
  FileText,
  Printer,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTest } from "../context/TestContext";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/common/Badge";

export const TestReports = () => {
  const { history, stats, testCases } = useTest();
  const [selectedRun, setSelectedRun] = useState(null);
  const [expandedRunId, setExpandedRunId] = useState(null);

  const activeRun = selectedRun || (history.length > 0 ? history[0] : null);

  const handleDownloadCsv = () => {
    window.location.href = "/api/reports/export/csv";
  };

  const handlePrint = () => {
    window.print();
  };

  // Compute aggregate stats across all runs
  const totalRuns = history.length;
  const totalExecuted = history.reduce((sum, h) => sum + (h.total || 0), 0);
  const totalPassed = history.reduce((sum, h) => sum + (h.passed || 0), 0);
  const totalFailed = history.reduce((sum, h) => sum + (h.failed || 0), 0);
  const overallRate = totalExecuted > 0 ? Math.round((totalPassed / totalExecuted) * 100) : 100;

  // Module breakdown based on active run or overall
  const moduleKeys = [
    { key: "bus_train", label: "Bus & Train Reservation", total: 7 },
    { key: "movie", label: "Movie Ticket Booking", total: 6 },
    { key: "cab", label: "Cab Booking", total: 6 },
    { key: "event", label: "Event Registration", total: 7 },
    { key: "payment", label: "Razorpay Payment Gateway", total: 12 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Test Execution Reports & Audit Log
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Standardized QA automation test telemetry, module-wise metrics, and downloadable records
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Test Runs"
          value={totalRuns}
          subtitle="All historical sessions"
          icon={Layers}
          color="purple"
        />
        <StatCard
          title="Total Cases Executed"
          value={totalExecuted}
          subtitle="Cumulative automated checks"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Total Defects Caught"
          value={totalFailed}
          subtitle="Failed assertions"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Audit Pass Rate"
          value={`${overallRate}%`}
          subtitle="Historical success ratio"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Module-Wise Pass Rate Comparison */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Module-Wise Quality Index</h3>
          <p className="text-xs text-slate-400 font-medium">
            Automated test pass rates across the 4 booking platforms
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {moduleKeys.map((mod) => {
            let passedCount = mod.total;
            let failedCount = 0;

            if (activeRun && activeRun.results) {
              const modResults = activeRun.results.filter((r) => r.module === mod.key);
              if (modResults.length > 0) {
                passedCount = modResults.filter((r) => r.status === "PASSED").length;
                failedCount = modResults.length - passedCount;
              }
            }

            const rate = Math.round((passedCount / mod.total) * 100);

            return (
              <div
                key={mod.key}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 text-xs">{mod.label}</h4>
                  <span
                    className={`font-mono text-xs font-bold ${
                      rate === 100 ? "text-emerald-600" : rate >= 70 ? "text-amber-600" : "text-rose-600"
                    }`}
                  >
                    {rate}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      rate === 100
                        ? "bg-emerald-500"
                        : rate >= 70
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
                  <span className="text-emerald-700 font-semibold">{passedCount} Passed</span>
                  <span className={failedCount > 0 ? "text-rose-700 font-bold" : "text-slate-400"}>
                    {failedCount} Failed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Test Run Execution Log */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Execution History Archive</h3>
            <p className="text-xs text-slate-400 font-medium">
              Click any run to expand step-by-step audit logs and test results
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-xl">
            {history.length} Saved Run{history.length !== 1 ? "s" : ""}
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No test runs executed yet</p>
            <p className="text-xs text-slate-400">Trigger test suite from Dashboard or Test Automation page.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((run) => {
              const isExpanded = expandedRunId === run.runId;

              return (
                <div key={run.runId} className="transition-all">
                  <div
                    onClick={() => setExpandedRunId(isExpanded ? null : run.runId)}
                    className="p-6 hover:bg-slate-50/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {run.runId}
                        </span>
                        <Badge status={run.failed === 0 ? "PASSED" : "FAILED"}>
                          {run.successRate}% Success
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        Executed on {new Date(run.timestamp).toLocaleString()} • Duration: {(run.durationMs / 1000).toFixed(2)}s
                      </p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3 text-xs font-semibold">
                        <span className="text-emerald-600">{run.passed} Passed</span>
                        <span className="text-slate-300">•</span>
                        <span className={run.failed > 0 ? "text-rose-600 font-bold" : "text-slate-400"}>
                          {run.failed} Failed
                        </span>
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Step Trace Drawer */}
                  {isExpanded && run.results && (
                    <div className="px-6 pb-6 pt-2 bg-slate-50/80 border-t border-slate-100 space-y-3">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        Case Results in this Run ({run.results.length})
                      </h5>
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {run.results.map((r, i) => (
                          <div
                            key={i}
                            className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                  {r.testId}
                                </span>
                                <span className="font-semibold text-slate-800">{r.title}</span>
                              </div>
                              {r.error && (
                                <p className="font-mono text-rose-600 text-[11px] bg-rose-50 p-2 rounded-lg border border-rose-200 mt-1">
                                  {r.error}
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0">
                              <Badge status={r.status} size="sm">
                                {r.status}
                              </Badge>
                              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                                {r.durationMs}ms
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
