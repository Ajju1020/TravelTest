import React, { useState } from "react";
import {
  Train,
  Bus,
  Search,
  Calendar,
  Users,
  MapPin,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Star,
  Shield,
  AlertCircle
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export const BusTrainBooking = ({ setActiveTab }) => {
  const { masterData, createBooking } = useBooking();

  const [mode, setMode] = useState("train"); // "train" or "bus"
  const [fromCity, setFromCity] = useState("New Delhi");
  const [toCity, setToCity] = useState("Mumbai");
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [passengerCount, setPassengerCount] = useState(1);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([
    { name: "Aarav Sharma", age: "28", gender: "Male" }
  ]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cities = masterData?.cities || [
    { id: "DEL", name: "New Delhi" },
    { id: "BOM", name: "Mumbai" },
    { id: "BLR", name: "Bengaluru" },
    { id: "JAI", name: "Jaipur" },
    { id: "VNS", name: "Varanasi" },
    { id: "PNQ", name: "Pune" }
  ];

  const fleetList = mode === "train" ? masterData?.trains || [] : masterData?.buses || [];

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handlePassengerCountChange = (count) => {
    const n = Math.max(1, Math.min(6, count));
    setPassengerCount(n);
    const newPassengers = [...passengers];
    while (newPassengers.length < n) {
      newPassengers.push({ name: "", age: "", gender: "Male" });
    }
    setPassengers(newPassengers.slice(0, n));
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSelectFleet = (item, tier = null) => {
    setSelectedFleet(item);
    setSelectedClass(tier || (item.classes ? item.classes[0] : null));
    // Generate initial seat assignment
    const autoSeats = Array.from({ length: passengerCount }, (_, i) => `C1-${12 + i}`);
    setSelectedSeats(autoSeats);
    setFormError("");
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setFormError("");

    // 1. Validation: Same source & destination
    if (fromCity === toCity) {
      setFormError("Source and Destination cities cannot be the same. Please choose different locations.");
      return;
    }

    // 2. Validation: Past date
    const selectedDate = new Date(journeyDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setFormError("Journey date cannot be in the past. Please select a valid future date.");
      return;
    }

    if (!selectedFleet) {
      setFormError("Please select a bus or train from the available options.");
      return;
    }

    // 3. Validation: Passenger details
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setFormError(`Please enter Passenger #${i + 1} name.`);
        return;
      }
      if (!passengers[i].age || Number(passengers[i].age) < 1) {
        setFormError(`Please enter a valid age for Passenger #${i + 1}.`);
        return;
      }
    }

    setIsSubmitting(true);

    const pricePerSeat = selectedClass ? selectedClass.price : selectedFleet.price;
    const totalFare = pricePerSeat * passengerCount;

    const bookingPayload = {
      module: "bus_train",
      type: mode === "train" ? "Train" : "Bus",
      title: `${selectedFleet.name || selectedFleet.operator} (${mode.toUpperCase()})`,
      from: fromCity,
      to: toCity,
      date: journeyDate,
      passengers: passengers.map((p, idx) => ({
        ...p,
        seat: selectedSeats[idx] || `S-${idx + 1}`
      })),
      fare: totalFare
    };

    const res = await createBooking(bookingPayload);
    setIsSubmitting(false);

    if (res.success) {
      setSelectedFleet(null); if (setActiveTab) setActiveTab("payment");
    } else {
      setFormError(res.error || "Failed to complete reservation");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        {/* Mode Switcher */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setMode("train");
              setSelectedFleet(null);
            }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition ${
              mode === "train"
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Train className="w-4 h-4" />
            <span>Train Reservation</span>
          </button>

          <button
            onClick={() => {
              setMode("bus");
              setSelectedFleet(null);
            }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition ${
              mode === "bus"
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Bus Reservation</span>
          </button>
        </div>

        {/* Search Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Source City */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>Source City</span>
            </label>
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination City */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent-500" />
              <span>Destination City</span>
            </label>
            <div className="flex items-center space-x-1">
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSwapCities}
                title="Swap source and destination"
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Journey Date */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Journey Date</span>
            </label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Passengers Count */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Passengers</span>
            </label>
            <select
              value={passengerCount}
              onChange={(e) => handlePassengerCountChange(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} Passenger{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Validation Alert */}
        {formError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}
      </div>

      {/* Available Fleet Listing */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <span>Available {mode === "train" ? "Trains" : "Buses"}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
            {fromCity} → {toCity}
          </span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {fleetList.map((item) => {
            const isSelected = selectedFleet?.id === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 ${
                  isSelected
                    ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md"
                    : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Name & Timing */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-extrabold text-slate-900">
                        {item.name || item.operator}
                      </span>
                      {item.number && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          #{item.number}
                        </span>
                      )}
                      <span className="flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{item.rating}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-xs text-slate-600 font-medium">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{item.departure}</span>
                        <p className="text-slate-400">{fromCity}</p>
                      </div>
                      <div className="text-center text-slate-400">
                        <span className="text-[10px] uppercase font-bold">{item.duration}</span>
                        <div className="w-16 h-0.5 bg-slate-300 mx-auto my-0.5"></div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{item.arrival}</span>
                        <p className="text-slate-400">{toCity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Classes & Price Selection */}
                  <div className="flex flex-wrap items-center gap-2">
                    {item.classes ? (
                      item.classes.map((cls) => (
                        <button
                          key={cls.code}
                          type="button"
                          onClick={() => handleSelectFleet(item, cls)}
                          className={`p-3 rounded-2xl border text-left transition ${
                            isSelected && selectedClass?.code === cls.code
                              ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20"
                              : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="font-bold">{cls.name}</span>
                            <span className="font-extrabold text-sm">₹{cls.price}</span>
                          </div>
                          <p
                            className={`text-[10px] mt-0.5 ${
                              isSelected && selectedClass?.code === cls.code
                                ? "text-brand-100"
                                : "text-emerald-600 font-semibold"
                            }`}
                          >
                            AVL {cls.available}
                          </p>
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectFleet(item)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          isSelected
                            ? "bg-brand-600 text-white border-brand-600 shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-xs">
                          <span className="font-bold">{item.busType}</span>
                          <span className="font-extrabold text-sm">₹{item.price}</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          AVL {item.availableSeats} Seats
                        </p>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Fleet & Passenger Details Form */}
      {selectedFleet && (
        <form
          onSubmit={handleSubmitBooking}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200 shadow-lg space-y-6 animate-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Passenger Details</h3>
              <p className="text-xs text-slate-400 font-medium">
                Reserving {passengerCount} seat{passengerCount > 1 ? "s" : ""} on {selectedFleet.name || selectedFleet.operator} (
                {selectedClass ? selectedClass.name : "Standard"})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold">Total Fare</span>
              <p className="text-2xl font-black text-slate-900">
                ₹{(selectedClass ? selectedClass.price : selectedFleet.price) * passengerCount}
              </p>
            </div>
          </div>

          {/* Passenger Input Rows */}
          <div className="space-y-3">
            {passengers.map((p, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200"
              >
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Passenger #{idx + 1} Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={p.name}
                    onChange={(e) => handlePassengerChange(idx, "name", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    required
                    placeholder="28"
                    value={p.age}
                    onChange={(e) => handlePassengerChange(idx, "age", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Gender
                  </label>
                  <select
                    value={p.gender}
                    onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Instant PNR confirmation with e-ticket</span>
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-lg shadow-brand-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? "Generating PNR..." : "Confirm & Book Ticket"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
