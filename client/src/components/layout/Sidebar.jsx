import React from "react";
import {
  LayoutDashboard,
  Train,
  Film,
  Car,
  Calendar,
  PlayCircle,
  FileText,
  Ticket,
  Settings,
  CreditCard,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bus_train", label: "Bus & Train Booking", icon: Train, badge: "Module 1" },
    { id: "movie", label: "Movie Ticket Booking", icon: Film, badge: "Module 2" },
    { id: "cab", label: "Cab Booking", icon: Car, badge: "Module 3" },
    { id: "event", label: "Event Registration", icon: Calendar, badge: "Module 4" },
    { id: "payment_mgmt", label: "Payment Gateway", icon: CreditCard, badge: "Razorpay" },
    { id: "automation", label: "Test Automation", icon: PlayCircle, highlight: true },
    { id: "reports", label: "Test Reports", icon: FileText },
    { id: "history", label: "Booking History", icon: Ticket },
    { id: "settings", label: "Settings & Admin", icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/30 text-white font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              Travel<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Test</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Automation QA Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Workflows & Testing
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? item.highlight
                    ? "bg-gradient-to-r from-accent-600 to-brand-600 text-white shadow-lg shadow-brand-600/30"
                    : "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : item.highlight
                  ? "bg-slate-800/60 text-accent-300 hover:bg-slate-800 hover:text-white border border-accent-500/20"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : item.highlight ? "text-accent-400" : "text-slate-400 group-hover:text-brand-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && !isActive && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                  {item.badge}
                </span>
              )}

              {item.highlight && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Box */}
      <div className="p-3 m-3 bg-slate-800/60 border border-slate-800 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Razorpay + Playwright</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
          38 Automated E2E Test Scenarios Ready
        </p>
        <div className="w-full bg-slate-700/70 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-400 to-accent-400 h-full w-full"></div>
        </div>
      </div>
    </aside>
  );
};
