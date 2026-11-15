import React, { useState, useEffect } from "react";
import {
  Film,
  Calendar,
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Popcorn,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { SeatGrid } from "../components/booking/SeatGrid";

export const MovieBooking = ({ setActiveTab }) => {
  const { masterData, createBooking, showToast } = useBooking();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState("08:30 PM");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [bookedSeats, setBookedSeats] = useState(["D4", "D5", "E8", "F2", "H3", "H4"]);
  const [selectedSeats, setSelectedSeats] = useState(["F4", "F5"]);
  const [includeSnacks, setIncludeSnacks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const movies = masterData?.movies || [];
  const cinemas = masterData?.cinemas || [];
  const showtimes = masterData?.showtimes || ["10:30 AM", "01:45 PM", "05:00 PM", "08:30 PM", "11:15 PM"];

  useEffect(() => {
    if (movies.length > 0 && !selectedMovie) {
      setSelectedMovie(movies[0]);
    }
    if (cinemas.length > 0 && !selectedCinema) {
      setSelectedCinema(cinemas[0]);
    }
  }, [movies, cinemas]);

  // Fetch booked seats when movie/showtime changes
  useEffect(() => {
    if (selectedMovie && selectedShowtime) {
      fetch(`/api/data/movie-seats/${selectedMovie.id}/${encodeURIComponent(selectedShowtime)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.bookedSeats) {
            setBookedSeats(data.bookedSeats);
          }
        })
        .catch(() => {});
    }
  }, [selectedMovie, selectedShowtime]);

  const handleSeatToggle = (seatId, price) => {
    if (bookedSeats.includes(seatId)) {
      showToast(`Seat ${seatId} is already booked! Please select another seat.`, "error");
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        showToast("Maximum 8 seats allowed per transaction.", "error");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Price calculations
  const calculatePricing = () => {
    let subtotal = 0;
    selectedSeats.forEach((seat) => {
      const row = seat.charAt(0);
      if (["H", "J"].includes(row)) subtotal += 500;
      else if (["D", "E", "F", "G"].includes(row)) subtotal += 350;
      else subtotal += 200;
    });

    const snacksPrice = includeSnacks ? 250 : 0;
    const gst = Math.round((subtotal + snacksPrice) * 0.18);
    const convenienceFee = selectedSeats.length > 0 ? 40 : 0;
    const total = subtotal + snacksPrice + gst + convenienceFee;

    return { subtotal, snacksPrice, gst, convenienceFee, total };
  };

  const pricing = calculatePricing();

  const handleBookTickets = async () => {
    if (!selectedMovie || !selectedCinema) return;
    if (selectedSeats.length === 0) {
      showToast("Please select at least one seat to proceed.", "error");
      return;
    }

    setIsSubmitting(true);

    const bookingPayload = {
      module: "movie",
      movieId: selectedMovie.id,
      title: selectedMovie.title,
      cinema: selectedCinema.name,
      screen: selectedCinema.screens[0] || "Audi 1",
      showtime: selectedShowtime,
      date: selectedDate,
      seats: selectedSeats,
      tier: selectedSeats.some((s) => ["H", "J"].includes(s.charAt(0)))
        ? "Platinum"
        : selectedSeats.some((s) => ["D", "E", "F", "G"].includes(s.charAt(0)))
        ? "Gold"
        : "Silver",
      fare: pricing.total
    };

    const res = await createBooking(bookingPayload);
    setIsSubmitting(false);

    if (res.success) {
      setSelectedSeats([]); if (setActiveTab) setActiveTab("payment");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Movie Selection Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900">Now Showing in Theatres</h3>
          <span className="text-xs text-slate-400 font-medium">Select a blockbuster to book</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {movies.map((m) => {
            const isSelected = selectedMovie?.id === m.id;

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMovie(m)}
                className={`group relative bg-white rounded-3xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-purple-600 ring-2 ring-purple-500/30 shadow-lg scale-[1.02]"
                    : "border-slate-200/90 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                    {m.certificate}
                  </span>

                  <span className="absolute top-3 right-3 flex items-center space-x-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>{m.rating}</span>
                  </span>

                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[11px] text-purple-300 font-bold uppercase tracking-wider">
                      {m.language}
                    </p>
                    <h4 className="text-base font-extrabold text-white leading-tight">{m.title}</h4>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {m.synopsis}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                    <span>{m.genre}</span>
                    <span>{m.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cinema, Date, & Showtime Config Card */}
      {selectedMovie && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cinema Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                <span>Select Multiplex</span>
              </label>
              <select
                value={selectedCinema?.id || ""}
                onChange={(e) => {
                  const cin = cinemas.find((c) => c.id === e.target.value);
                  setSelectedCinema(cin);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                <span>Show Date</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Showtime Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Showtime Slots</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {showtimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedShowtime(time)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                      selectedShowtime === time
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Seat Selection & Price Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Interactive Seat Layout (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Select Your Seats</h4>
              <p className="text-xs text-slate-400">Click available seats in Silver, Gold, or Platinum rows</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {selectedSeats.length} Selected
            </span>
          </div>

          <SeatGrid
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />
        </div>

        {/* Right: Booking Summary & Price Breakdown (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
              Order Summary
            </span>
            <h4 className="font-extrabold text-slate-900 text-lg">{selectedMovie?.title}</h4>
            <p className="text-xs text-slate-500">{selectedCinema?.name}</p>
            <p className="text-xs font-semibold text-slate-700">
              {selectedDate} • {selectedShowtime}
            </p>
          </div>

          {/* Selected Seats Tag Cloud */}
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase mb-2 block">
              Selected Seats ({selectedSeats.length})
            </span>
            {selectedSeats.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No seats selected yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Snacks Add-on Option */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Popcorn className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Popcorn & Coke Combo</p>
                <p className="text-[11px] text-slate-400">₹250 Add-on</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeSnacks}
              onChange={(e) => setIncludeSnacks(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
            />
          </div>

          {/* Transparent Price Calculation */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span>Base Ticket Subtotal</span>
              <span className="font-bold text-slate-800">₹{pricing.subtotal}</span>
            </div>
            {includeSnacks && (
              <div className="flex justify-between">
                <span>Snacks & Refreshments</span>
                <span className="font-bold text-slate-800">₹{pricing.snacksPrice}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST & Entertainment Tax (18%)</span>
              <span className="font-bold text-slate-800">₹{pricing.gst}</span>
            </div>
            <div className="flex justify-between">
              <span>Convenience & Booking Fee</span>
              <span className="font-bold text-slate-800">₹{pricing.convenienceFee}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Payable</span>
              <span className="text-purple-600">₹{pricing.total}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="button"
            disabled={selectedSeats.length === 0 || isSubmitting}
            onClick={handleBookTickets}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all ${
              selectedSeats.length === 0 || isSubmitting
                ? "bg-slate-300 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "Reserving Seats..." : `Confirm Booking • ₹${pricing.total}`}
          </button>
        </div>
      </div>
    </div>
  );
};
