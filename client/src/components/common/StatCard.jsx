import React from "react";

export const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", change }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      pill: "bg-blue-500/10 text-blue-700"
    },
    purple: {
      bg: "bg-purple-50 text-purple-600 border-purple-100",
      pill: "bg-purple-500/10 text-purple-700"
    },
    emerald: {
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pill: "bg-emerald-500/10 text-emerald-700"
    },
    rose: {
      bg: "bg-rose-50 text-rose-600 border-rose-100",
      pill: "bg-rose-500/10 text-rose-700"
    },
    amber: {
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      pill: "bg-amber-500/10 text-amber-700"
    }
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${theme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {change && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${theme.pill}`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
};
