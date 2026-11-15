import React, { useState } from "react";
import {
  Ticket,
  Train,
  Film,
  Car,
  Calendar,
  Eye,
  XCircle,
  Filter,
  CheckCircle2,
  Clock,
  Printer
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { Badge } from "../components/common/Badge";

export const BookingHistory = () => {
  const { bookings, cancelBooking, setActiveTicket } = useBooking();
  const [filterModule, setFilterModule] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBookings = bookings.filter((b) => {
    const matchesModule = filterModule === "all" || b.module === filterModule;
    const matchesStatus = filterStatus === "all" || b.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesModule && matchesStatus;
  });

  const getModuleIcon = (mod) => {
    switch (mod) {
      case "bus_train":
        return <Train className="w-5 h-5 text-brand-600" />;
      case "movie":
        return <Film className="w-5 h-5 text-purple-600" />;
      case "cab":
        return <Car className="w-5 h-5 text-amber-600" />;
      case "event":
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return <Ticket className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Unified Booking History
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Access, view tickets, and manage reservations across all four booking platforms
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Modules</option>
            <option value="bus_train">Bus & Train</option>
            <option value="movie">Movie Tickets</option>
            <option value="cab">Cab Rides</option>
            <option value="event">Event Registrations</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400 space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-base">No bookings found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't completed any reservations matching the selected filter criteria.
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Left Details */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {getModuleIcon(b.module)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {b.id}
                    </span>
                    <Badge status={b.status}>{b.status}</Badge>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Booked {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {b.title}
                  </h3>

                  {/* Module Specific Metadata Snippets */}
                  {b.module === "bus_train" && (
                    <p className="text-xs text-slate-500 font-medium">
                      Route: {b.from} → {b.to} • Journey: {b.date} • PNR: <span className="font-mono font-bold text-brand-600">{b.pnr}</span>
                    </p>
                  )}
                  {b.module === "movie" && (
                    <p className="text-xs text-slate-500 font-medium">
                      {b.cinema} • {b.date} at {b.showtime} • Seats: <span className="font-mono font-bold text-purple-600">{Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</span>
                    </p>
                  )}
                  {b.module === "cab" && (
                    <p className="text-xs text-slate-500 font-medium">
                      {b.pickup} → {b.drop} • Driver: {b.driver?.name} • Ride OTP: <span className="font-mono font-bold text-amber-600">{b.otp}</span>
                    </p>
                  )}
                  {b.module === "event" && (
                    <p className="text-xs text-slate-500 font-medium">
                      {b.venue} • Delegate: {b.attendee?.name} • Badge ID: <span className="font-mono font-bold text-indigo-600">{b.badgeId}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Fare & Action Buttons */}
              <div className="flex items-center space-x-4 self-end md:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Fare</span>
                  <p className="text-lg font-black text-slate-900">₹{b.fare}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTicket(b)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </button>

                  {b.status === "Confirmed" && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                      title="Cancel this booking"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
