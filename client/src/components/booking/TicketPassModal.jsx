import React, { useEffect } from "react";
import { X, Printer, CheckCircle2, QrCode, Train, Film, Car, Calendar, Download } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import confetti from "canvas-confetti";

export const TicketPassModal = () => {
  const { activeTicket, setActiveTicket } = useBooking();

  useEffect(() => {
    if (activeTicket) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  }, [activeTicket]);

  if (!activeTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  const getModuleIcon = () => {
    switch (activeTicket.module) {
      case "bus_train":
        return <Train className="w-5 h-5 text-brand-600" />;
      case "movie":
        return <Film className="w-5 h-5 text-purple-600" />;
      case "cab":
        return <Car className="w-5 h-5 text-amber-600" />;
      case "event":
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setActiveTicket(null)} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-brand-200">
                  Confirmed Pass & E-Ticket
                </span>
                <h3 className="font-extrabold text-lg text-white leading-tight">
                  {activeTicket.title || "Reservation Receipt"}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setActiveTicket(null)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ticket Body with perforated edge effect */}
          <div className="p-6 space-y-6">
            {/* Primary Details Grid */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                <div className="flex items-center space-x-2">
                  {getModuleIcon()}
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {activeTicket.module.replace("_", " & ")}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                  {activeTicket.status || "CONFIRMED"}
                </span>
              </div>

              {/* Module-specific layouts */}
              {activeTicket.module === "bus_train" && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">From</p>
                    <p className="text-base font-bold text-slate-800">{activeTicket.from}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">To</p>
                    <p className="text-base font-bold text-slate-800">{activeTicket.to}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Journey Date</p>
                    <p className="font-semibold text-slate-700">{activeTicket.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">PNR Number</p>
                    <p className="font-mono font-bold text-brand-600 text-sm">{activeTicket.pnr}</p>
                  </div>
                  {activeTicket.passengers && (
                    <div className="col-span-2 pt-2 border-t border-slate-200/60">
                      <p className="text-slate-400 font-medium mb-1">Passengers</p>
                      <div className="flex flex-wrap gap-2">
                        {activeTicket.passengers.map((p, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                            {p.name} ({p.age}y, {p.gender}) {p.seat && `• Seat: ${p.seat}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTicket.module === "movie" && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="col-span-2">
                    <p className="text-slate-400 font-medium">Cinema & Screen</p>
                    <p className="font-bold text-slate-800 text-sm">{activeTicket.cinema}</p>
                    <p className="text-slate-500 font-semibold">{activeTicket.screen}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Date & Showtime</p>
                    <p className="font-bold text-slate-800">{activeTicket.date} • {activeTicket.showtime}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Reserved Seats ({activeTicket.tier})</p>
                    <p className="font-mono font-bold text-purple-600 text-sm">
                      {Array.isArray(activeTicket.seats) ? activeTicket.seats.join(", ") : activeTicket.seats}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Booking Code</p>
                    <p className="font-mono font-bold text-slate-800">{activeTicket.bookingCode}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Amount Paid</p>
                    <p className="font-bold text-slate-900 text-sm">₹{activeTicket.fare}</p>
                  </div>
                </div>
              )}

              {activeTicket.module === "cab" && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">Pickup Point</p>
                    <p className="font-bold text-slate-800">{activeTicket.pickup}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Drop Destination</p>
                    <p className="font-bold text-slate-800">{activeTicket.drop}</p>
                  </div>
                  <div className="col-span-2 bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-amber-800 font-semibold">Assigned Driver</p>
                      <p className="font-bold text-slate-900 text-sm">{activeTicket.driver?.name}</p>
                      <p className="text-slate-500 text-[11px] font-medium">{activeTicket.driver?.vehicle} ({activeTicket.driver?.plate})</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Ride Start OTP</p>
                      <p className="font-mono font-extrabold text-2xl text-amber-600 tracking-wider">{activeTicket.otp}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTicket.module === "event" && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="col-span-2">
                    <p className="text-slate-400 font-medium">Venue & Dates</p>
                    <p className="font-bold text-slate-800 text-sm">{activeTicket.venue}</p>
                    <p className="text-slate-500 font-semibold">{activeTicket.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Delegate Name</p>
                    <p className="font-bold text-slate-800">{activeTicket.attendee?.name}</p>
                    <p className="text-slate-400 text-[11px]">{activeTicket.attendee?.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Pass Type</p>
                    <p className="font-semibold text-indigo-700">{activeTicket.tier}</p>
                    <p className="text-slate-500 text-[11px]">Badge: {activeTicket.badgeId}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Barcode / QR Section */}
            <div className="border-t-2 border-dashed border-slate-200 pt-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex space-x-1 h-8 items-end">
                  {[2, 4, 1, 3, 5, 2, 6, 3, 2, 4, 1, 5, 3, 2, 4, 2, 5, 3, 1, 4, 2].map((h, i) => (
                    <div
                      key={i}
                      className="bg-slate-800 w-1 rounded-sm"
                      style={{ height: `${h * 5 + 10}px` }}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-mono text-slate-400 tracking-widest">
                  {activeTicket.id}
                </p>
              </div>

              <div className="flex flex-col items-center p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <QrCode className="w-12 h-12 text-slate-800" />
                <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Scan to Verify</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Saved automatically to Booking History
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => setActiveTicket(null)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
