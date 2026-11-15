import React, { useState } from "react";
import {
  CreditCard,
  PlayCircle,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Terminal,
  RefreshCw,
  AlertTriangle,
  Train,
  Film,
  Car,
  Calendar,
  Layers,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { useTest } from "../context/TestContext";
import { Badge } from "../components/common/Badge";

export const TestAutomation = () => {
  const {
    testCases,
    stats,
    isRunning,
    runAllTests,
    runSingleTest,
    runModuleTests,
    setIsLiveModalOpen
  } = useTest();

  const [activeModuleFilter, setActiveModuleFilter] = useState("all");
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestIds, setSelectedTestIds] = useState([]);

  const moduleTabs = [
    { id: "all", label: "All Modules", count: 38, icon: Layers },
    { id: "bus_train", label: "Bus & Train", count: 7, icon: Train },
    { id: "movie", label: "Movie Booking", count: 6, icon: Film },
    { id: "cab", label: "Cab Booking", count: 6, icon: Car },
    { id: "event", label: "Event Registration", count: 7, icon: Calendar },
    { id: "payment", label: "Payment Gateway", count: 12, icon: CreditCard }
  ];

  // Filtering
  const filteredCases = testCases.filter((tc) => {
    const matchesModule = activeModuleFilter === "all" || tc.module === activeModuleFilter;
    const matchesStatus =
      activeStatusFilter === "all" ||
      tc.status.toLowerCase() === activeStatusFilter.toLowerCase();
    const matchesSearch =
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tc.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesStatus && matchesSearch;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTestIds(filteredCases.map((c) => c.id));
    } else {
      setSelectedTestIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedTestIds.includes(id)) {
      setSelectedTestIds(selectedTestIds.filter((t) => t !== id));
    } else {
      setSelectedTestIds([...selectedTestIds, id]);
    }
  };

  const handleRunSelected = () => {
    if (selectedTestIds.length === 0) return;
    // Call backend run with selectedTestIds
    fetch("/api/tests/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testIds: selectedTestIds, delayMs: 250 })
    });
    setIsLiveModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Automation Control Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <PlayCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Playwright Automation Hub
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real-time browser & API testing against live application booking workflows
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLiveModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Terminal className="w-4 h-4 text-slate-500" />
              <span>Live Console</span>
            </button>

            {selectedTestIds.length > 0 && (
              <button
                onClick={handleRunSelected}
                disabled={isRunning}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Selected ({selectedTestIds.length})</span>
              </button>
            )}

            <button
              onClick={() => runAllTests(200)}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all ${
                isRunning
                  ? "bg-slate-700 cursor-not-allowed opacity-90 shadow-none"
                  : "bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running Test Suite...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run All 38 Tests</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Counters Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Tests</span>
            <p className="text-xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-600 uppercase">Passed</span>
            <p className="text-xl font-black text-emerald-700">{stats.passed}</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100">
            <span className="text-[10px] font-bold text-rose-600 uppercase">Failed</span>
            <p className="text-xl font-black text-rose-700">{stats.failed}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-600 uppercase">Pending</span>
            <p className="text-xl font-black text-amber-700">{stats.pending}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-purple-600 uppercase">Success Rate</span>
            <p className="text-xl font-black text-purple-700">{stats.successRate}%</p>
          </div>
        </div>
      </div>

      {/* Module Tabs & Search Toolbar */}
      <div className="space-y-4">
        {/* Module Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {moduleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModuleFilter === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveModuleFilter(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search test by ID (e.g. TC-BT-01), title, or scenario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All ({testCases.length})</option>
              <option value="passed">Passed ({stats.passed})</option>
              <option value="failed">Failed ({stats.failed})</option>
              <option value="pending">Pending ({stats.pending})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Cases Table / Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={
                filteredCases.length > 0 &&
                filteredCases.every((c) => selectedTestIds.includes(c.id))
              }
              onChange={handleSelectAll}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700">
              Showing {filteredCases.length} of {testCases.length} Test Scenarios
            </span>
          </div>

          {activeModuleFilter !== "all" && (
            <button
              onClick={() => runModuleTests(activeModuleFilter, 200)}
              disabled={isRunning}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition"
            >
              <Play className="w-3 h-3 fill-brand-700" />
              <span>Run All in {activeModuleFilter.replace("_", " & ")}</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {filteredCases.map((tc) => {
            const isSelected = selectedTestIds.includes(tc.id);

            return (
              <div
                key={tc.id}
                className={`p-6 transition-all duration-150 ${
                  isSelected ? "bg-brand-50/40" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox + Test Info */}
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(tc.id)}
                      className="w-4 h-4 mt-1 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                    />

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {tc.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                          {tc.moduleTitle}
                        </span>
                        <Badge status={tc.severity} size="sm">
                          {tc.severity}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-400">
                          {tc.type}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900">{tc.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                        {tc.description}
                      </p>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-medium pt-0.5">
                        <span className="text-slate-500 font-semibold">Assertion:</span>
                        <span>{tc.expectedResult}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Individual Run Button */}
                  <div className="flex items-center space-x-4 sm:shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <Badge status={tc.status}>{tc.status}</Badge>
                      {tc.durationMs !== null && tc.status !== "PENDING" && (
                        <p className="text-[10px] font-mono text-slate-400 mt-1">
                          {tc.durationMs}ms
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isRunning}
                      onClick={() => runSingleTest(tc.id, 250)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition shadow-sm"
                      title={`Execute ${tc.id} in Playwright`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Failure Error Callout if test failed */}
                {tc.status === "FAILED" && tc.error && (
                  <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-rose-700">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Failure Reason:</span>
                    </div>
                    <p className="font-semibold">{tc.error}</p>
                    <p className="text-[10px] text-rose-600">
                      Check Admin & Settings to inspect active bug injection switches.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
