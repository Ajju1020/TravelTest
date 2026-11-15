import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useBooking } from "../../context/BookingContext";

export const Toast = () => {
  const { toast } = useBooking();

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-emerald-900/90 border-emerald-500/50 text-emerald-100",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case "error":
        return {
          bg: "bg-rose-900/95 border-rose-500/60 text-rose-100",
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        };
      default:
        return {
          bg: "bg-slate-900/90 border-slate-700 text-slate-100",
          icon: <Info className="w-5 h-5 text-brand-400 shrink-0" />
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md shadow-2xl">
      <div className={`flex items-start space-x-3 px-4 py-3.5 rounded-2xl border backdrop-blur-md ${style.bg}`}>
        {style.icon}
        <div className="text-xs font-semibold leading-relaxed flex-1">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
