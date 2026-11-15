import React from "react";
import {
  CreditCard,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
  Train,
  Film,
  Car,
  Calendar,
  ArrowRight,
  ExternalLink,
  Activity
} from "lucide-react";
import { useTest } from "../context/TestContext";
import { useBooking } from "../context/BookingContext";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/common/Badge";

export const Dashboard = ({ setActiveTab }) => {
  const { stats, history, runAllTests, isRunning, runModuleTests } = useTest();
  const { bookings } = useBooking();

  // Module summaries
  const modules = [
    {
      id: "bus_train",
      title: "Bus & Train Reservation",
      icon: Train,
      color: "blue",
      totalTests: 7,
      tab: "bus_train"
    },
    {
      id: "movie",
      title: "Movie Ticket Booking",
      icon: Film,
      color: "purple",
      totalTests: 6,
      tab: "movie"
    },
    {
      id: "cab",
      title: "Cab Booking",
      icon: Car,
      color: "amber",
      totalTests: 6,
      tab: "cab"
    },
    {
      id: "event",
      title: "Event Registration",
      icon: Calendar,
      color: "emerald",
      totalTests: 7,
      tab: "event"
    },
    {
      id: "payment",
      title: "Razorpay Payment Gateway",
      icon: CreditCard,
      color: "blue",
      totalTests: 12,
      tab: "payment_mgmt"
    }
  ];

  const recentHistory = history.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Prominent CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-8 text-white border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-60 bottom-0 -mb-10 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-300 border border-white/10">
            <Shield className="w-3.5 h-3.5" />
            <span>Playwright Automated Testing Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Comprehensive Travel & Booking{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
              Test Automation Suite
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-normal">
            Validate end-to-end booking workflows across Buses, Trains, Movie Multiplexes, Cabs, and Tech Events. Run real browser test scripts, track assertions, identify defects, and generate audit-ready CSV reports.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => runAllTests(200)}
              disabled={isRunning}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700 text-white shadow-lg shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? "Executing Test Suite..." : "Run All 38 Tests Now"}</span>
            </button>

            <button
              onClick={() => setActiveTab("automation")}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all"
            >
              <span>View Test Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Test Cases"
          value={stats.total}
          subtitle="4 Functional Modules"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Passed Tests"
          value={stats.passed}
          subtitle="All Assertions Met"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Failed Tests"
          value={stats.failed}
          subtitle="Defects Caught"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Pending Tests"
          value={stats.pending}
          subtitle="Awaiting Run"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          subtitle="Overall Pass Ratio"
          icon={TrendingUp}
          color={stats.successRate >= 90 ? "emerald" : stats.successRate >= 70 ? "blue" : "rose"}
        />
      </div>

      {/* Module-Wise Automation Quick Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Module-Wise Test Breakdown</h3>
            <p className="text-xs text-slate-500 font-medium">
              Execute test scenarios by booking domain or interact with the live apps
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            const moduleBookings = bookings.filter((b) => b.module === m.id).length;

            return (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {m.totalTests} Tests
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1">{m.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {moduleBookings} active reservation{moduleBookings !== 1 ? "s" : ""} recorded
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => runModuleTests(m.id, 200)}
                    disabled={isRunning}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Module Tests</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(m.tab)}
                    className="w-full flex items-center justify-center space-x-1 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                  >
                    <span>Open Booking App</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Test Execution History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Recent Test Execution History</h3>
            <p className="text-xs text-slate-400 font-medium">
              Live audit of previous test runs and duration metrics
            </p>
          </div>
          <button
            onClick={() => setActiveTab("reports")}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View Full Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">No test runs recorded yet</p>
            <p className="text-xs text-slate-400">Click "Run All Tests" above to execute your first automated test run!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Run ID</th>
                  <th className="px-6 py-3.5">Execution Time</th>
                  <th className="px-6 py-3.5">Total Cases</th>
                  <th className="px-6 py-3.5">Passed</th>
                  <th className="px-6 py-3.5">Failed</th>
                  <th className="px-6 py-3.5">Success Rate</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentHistory.map((run) => (
                  <tr key={run.runId} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{run.runId}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(run.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{run.total}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-600">+{run.passed}</span>
                    </td>
                    <td className="px-6 py-4">
                      {run.failed > 0 ? (
                        <span className="font-bold text-rose-600">-{run.failed}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={run.failed === 0 ? "PASSED" : "FAILED"}>
                        {run.successRate}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {(run.durationMs / 1000).toFixed(2)}s
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setActiveTab("reports")}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-brand-600 hover:bg-brand-50 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
