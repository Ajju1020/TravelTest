import React from "react";
import { Info } from "lucide-react";

export const SeatGrid = ({
  rows = ["A", "B", "C", "D", "E", "F", "G", "H", "J"],
  cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  bookedSeats = [],
  selectedSeats = [],
  onSeatToggle,
  maxSeats = 6,
  tierConfig = {
    silver: { rows: ["A", "B", "C"], price: 200, name: "Silver" },
    gold: { rows: ["D", "E", "F", "G"], price: 350, name: "Gold" },
    platinum: { rows: ["H", "J"], price: 500, name: "Platinum Recliner" }
  }
}) => {
  const getTier = (row) => {
    if (tierConfig.platinum?.rows.includes(row)) return "platinum";
    if (tierConfig.gold?.rows.includes(row)) return "gold";
    return "silver";
  };

  return (
    <div className="space-y-6">
      {/* Curved Screen Visualization for Cinema */}
      <div className="flex flex-col items-center">
        <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full mb-1 glow-blue shadow-lg shadow-brand-500/50"></div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          Cinema Screen This Way
        </p>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-lg border border-slate-300 bg-white"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
            ✓
          </div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-lg bg-slate-300 cursor-not-allowed"></div>
          <span className="text-slate-400">Reserved / Booked</span>
        </div>
      </div>

      {/* Grid of Seats */}
      <div className="space-y-2 select-none overflow-x-auto pb-2">
        {rows.map((row) => {
          const tier = getTier(row);
          const tierInfo = tierConfig[tier];

          return (
            <div key={row} className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>

              {cols.map((col) => {
                const seatId = `${row}${col}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                // Add an aisle gap in the middle
                const isAisleGap = col === 5;

                return (
                  <React.Fragment key={seatId}>
                    <button
                      type="button"
                      disabled={isBooked}
                      onClick={() => onSeatToggle(seatId, tierInfo?.price || 200)}
                      title={
                        isBooked
                          ? `Seat ${seatId} is already booked`
                          : `Seat ${seatId} (${tierInfo?.name} - ₹${tierInfo?.price})`
                      }
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-bold transition-all duration-150 flex items-center justify-center ${
                        isBooked
                          ? "bg-slate-300 text-slate-400 cursor-not-allowed border border-slate-300"
                          : isSelected
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105 border border-emerald-600"
                          : tier === "platinum"
                          ? "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 hover:border-purple-300"
                          : tier === "gold"
                          ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                          : "bg-white text-slate-700 border border-slate-300 hover:border-brand-500 hover:bg-brand-50"
                      }`}
                    >
                      {seatId}
                    </button>
                    {isAisleGap && <div className="w-4 sm:w-6" />}
                  </React.Fragment>
                );
              })}

              <span className="w-5 text-center text-xs font-bold text-slate-400">{row}</span>
            </div>
          );
        })}
      </div>

      {/* Tier Pricing Summary */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200/80">
        <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
          <p className="font-bold text-purple-900">Platinum (Rows H-J)</p>
          <p className="text-purple-600 font-semibold">₹500 / seat</p>
        </div>
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
          <p className="font-bold text-amber-900">Gold (Rows D-G)</p>
          <p className="text-amber-600 font-semibold">₹350 / seat</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
          <p className="font-bold text-slate-800">Silver (Rows A-C)</p>
          <p className="text-slate-600 font-semibold">₹200 / seat</p>
        </div>
      </div>
    </div>
  );
};
