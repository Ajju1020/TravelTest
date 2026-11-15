import React from "react";

export const Badge = ({ children, status = "default", size = "md" }) => {
  const getStyle = () => {
    switch (status.toUpperCase()) {
      case "PASSED":
      case "CONFIRMED":
      case "SUCCESS":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "FAILED":
      case "CANCELLED":
      case "ERROR":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "RUNNING":
        return "bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse";
      case "PENDING":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "HIGH":
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-brand-50 text-brand-700 border-brand-200";
    }
  };

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-lg border ${sizeClass} ${getStyle()}`}>
      {status.toUpperCase() === "PASSED" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
      {status.toUpperCase() === "FAILED" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
      {status.toUpperCase() === "RUNNING" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
      {children || status}
    </span>
  );
};
