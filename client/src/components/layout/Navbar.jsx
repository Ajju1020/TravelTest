import React from "react";
import { Play, Activity, Sparkles, User, RefreshCw, Terminal, CreditCard } from "lucide-react";
import { useTest } from "../../context/TestContext";
import { useAuth } from "../../context/AuthContext";

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { runAllTests, isRunning, setIsLiveModalOpen } = useTest();
  const { user, setIsAuthModalOpen } = useAuth();

  const getPageMeta = () => {
    switch (activeTab) {
      case "dashboard":
        return { title: "Executive QA Dashboard", subtitle: "Automated test metrics, fleet health, and booking analytics" };
      case "bus_train":
        return { title: "Bus & Train Ticket Reservation", subtitle: "Module 1: Real-time search, interactive berth selection & PNR booking" };
      case "movie":
        return { title: "Movie Ticket & Cinema Booking", subtitle: "Module 2: Cinema multiplex, interactive 3-tier seat layout & price calculation" };
      case "cab":
        return { title: "On-Demand Cab Booking", subtitle: "Module 3: Distance fare estimation, vehicle categories & driver dispatch" };
      case "event":
        return { title: "Event Registration & Ticketing", subtitle: "Module 4: Tech & cultural event registration, tiers & duplicate check" };
      case "payment":
        return { title: "Razorpay Payment Checkout", subtitle: "Module 5: Secure UPI, Card, Net Banking & HMAC-SHA256 verification" };
      case "payment_mgmt":
        return { title: "Payment Management & Audit", subtitle: "Razorpay transaction ledger, settlement monitor & method telemetry" };
      case "payment_status":
        return { title: "Transaction Status & Receipt", subtitle: "Verified payment result, tax invoice, and confirmed ticket pass" };
      case "automation":
        return { title: "Test Automation Command Center", subtitle: "Live Playwright execution engine, 38 assertions & step logs" };
      case "reports":
        return { title: "Test Execution Reports & Audits", subtitle: "Historical run metrics, module pass rates & CSV export" };
      case "history":
        return { title: "Unified Booking History", subtitle: "Inspect confirmed reservations, print passes, and manage tickets" };
      case "settings":
        return { title: "Admin & Test Bench Settings", subtitle: "Defect injection simulator, execution speed & test environment controls" };
      default:
        return { title: "TravelTest Platform", subtitle: "Travel & Booking Automation System" };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {meta.title}
        </h2>
        <p className="text-xs text-slate-500 font-medium">{meta.subtitle}</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Razorpay status pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-3 py-1.5 rounded-full text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
          <span>Razorpay Test Mode Active</span>
        </div>

        {/* View Live Logs Button */}
        <button
          onClick={() => setIsLiveModalOpen(true)}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition"
          title="Open Live Test Terminal Console"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Console</span>
        </button>

        {/* Prominent Run All Tests Button */}
        <button
          onClick={() => runAllTests(200)}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 ${
            isRunning
              ? "bg-slate-700 cursor-not-allowed opacity-90 shadow-none"
              : "bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Running Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run All 38 Tests</span>
            </>
          )}
        </button>

        {/* User Profile */}
        <div
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center space-x-3 pl-2 border-l border-slate-200 cursor-pointer group"
          title="Click to switch user or profile"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/30 group-hover:ring-brand-500 transition"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-brand-600 transition">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
