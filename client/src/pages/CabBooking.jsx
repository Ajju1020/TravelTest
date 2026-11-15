import React, { useState } from "react";
import {
  Car,
  MapPin,
  Clock,
  Calendar,
  Users,
  Shield,
  Star,
  CheckCircle2,
  Navigation,
  ArrowRightLeft,
  AlertCircle,
  PhoneCall
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export const CabBooking = ({ setActiveTab }) => {
  const { masterData, createBooking, showToast } = useBooking();

  const [pickup, setPickup] = useState("Indira Gandhi Airport (DEL)");
  const [drop, setDrop] = useState("Cyber Hub, Gurugram");
  const [rideType, setRideType] = useState("now"); // "now" or "later"
  const [scheduleDateTime, setScheduleDateTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString().replace("T", " ").substring(0, 16);
  });
  const [selectedCategory, setSelectedCategory] = useState("sedan");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState("");
  const [formError, setFormError] = useState("");

  const popularLocations = [
    "Indira Gandhi Airport (DEL)",
    "Cyber Hub, Gurugram",
    "Connaught Place, New Delhi",
    "Noida Sector 62",
    "Aerocity Worldmark",
    "New Delhi Railway Station",
    "DLF Phase 5, Gurugram"
  ];

  const categories = masterData?.cabs?.categories || [
    { id: "mini", name: "Mini", baseFare: 60, perKm: 13, capacity: 4, etaMinutes: 3, vehicleModel: "Maruti WagonR" },
    { id: "sedan", name: "Prime Sedan", baseFare: 90, perKm: 17, capacity: 4, etaMinutes: 4, vehicleModel: "Honda Amaze" },
    { id: "suv", name: "Prime SUV", baseFare: 140, perKm: 23, capacity: 6, etaMinutes: 6, vehicleModel: "Toyota Innova" },
    { id: "luxury", name: "Executive Luxury", baseFare: 220, perKm: 30, capacity: 4, etaMinutes: 7, vehicleModel: "BYD Seal EV" }
  ];

  const drivers = masterData?.cabs?.drivers || [];

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  // Estimated distance in km based on pickup/drop string lengths or mock distance
  const getEstimatedDistance = () => {
    if (pickup === drop) return 0;
    return 18.5; // realistic urban airport-to-tech hub route
  };

  const distanceKm = getEstimatedDistance();
  const activeCategoryObj = categories.find((c) => c.id === selectedCategory) || categories[1];
  const calculatedFare = activeCategoryObj.baseFare + Math.round(distanceKm * activeCategoryObj.perKm);

  const handleBookRide = async (e) => {
    e.preventDefault();
    setFormError("");

    // 1. Validation: blank locations
    if (!pickup.trim() || !drop.trim()) {
      setFormError("Pickup and Drop locations are both required.");
      return;
    }

    // 2. Validation: identical pickup & drop
    if (pickup.trim().toLowerCase() === drop.trim().toLowerCase()) {
      setFormError("Pickup and drop locations must be different.");
      return;
    }

    // 3. Validation: schedule in past
    if (rideType === "later") {
      const scheduled = new Date(scheduleDateTime);
      if (scheduled <= new Date()) {
        setFormError("Scheduled pickup time must be in the future.");
        return;
      }
    }

    setIsSubmitting(true);
    setDispatchStatus("Locating nearest verified driver...");

    // Simulated driver dispatch delay
    setTimeout(async () => {
      setDispatchStatus("Driver matched! Generating ride OTP...");

      const matchedDriver =
        selectedDriver ||
        drivers.find((d) => d.category === selectedCategory) ||
        drivers[0];

      const payload = {
        module: "cab",
        pickup,
        drop,
        category: selectedCategory,
        dateTime: rideType === "now" ? "Immediate Pickup (3-5 mins)" : scheduleDateTime,
        driver: matchedDriver,
        fare: calculatedFare
      };

      const res = await createBooking(payload);
      setIsSubmitting(false);
      setDispatchStatus("");

      if (res.success && setActiveTab) { setActiveTab("payment"); } else if (!res.success) {
        setFormError(res.error || "Failed to confirm cab booking");
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Booking Inputs & Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pickup & Drop Location Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-600" />
              <span>Route & Ride Scheduling</span>
            </h3>

            {/* Ride Type Switcher */}
            <div className="flex items-center space-x-3 bg-slate-100 p-1 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setRideType("now")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  rideType === "now" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Book Now (Ride Instant)
              </button>
              <button
                type="button"
                onClick={() => setRideType("later")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  rideType === "later" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Schedule for Later
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pickup Location</span>
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup point"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Drop Destination</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="Enter drop point"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleSwap}
                    title="Swap locations"
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {rideType === "later" && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Pickup Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDateTime}
                    onChange={(e) => setScheduleDateTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}
            </div>

            {/* Popular Quick Suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Hubs (Quick Select)
              </span>
              <div className="flex flex-wrap gap-2">
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      if (pickup !== loc) setDrop(loc);
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-600 transition"
                  >
                    + {loc}
                  </button>
                ))}
              </div>
            </div>

            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-2 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}
          </div>

          {/* Cab Categories Selection */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-lg">Select Cab Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const estFare = cat.baseFare + Math.round(distanceKm * cat.perKm);

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`bg-white rounded-3xl p-5 border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md scale-[1.01]"
                        : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                            isSelected ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <Car className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base">{cat.name}</h4>
                          <span className="text-xs text-slate-400 font-medium">
                            {cat.capacity} Seater • {cat.etaMinutes} min away
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900">₹{estFare}</span>
                        <p className="text-[10px] text-slate-400 font-semibold">₹{cat.perKm}/km</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {cat.tagline || cat.vehicleModel}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Dispatch Card & Fare Calculation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Ride Breakdown
            </span>
            <h4 className="font-extrabold text-slate-900 text-lg">
              {activeCategoryObj.name}
            </h4>
            <p className="text-xs text-slate-500">
              Estimated Distance: <span className="font-bold text-slate-800">{distanceKm} km</span>
            </p>
          </div>

          {/* Transparent Fare Math */}
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Base Fare</span>
              <span className="font-bold text-slate-800">₹{activeCategoryObj.baseFare}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance Rate ({distanceKm} km × ₹{activeCategoryObj.perKm})</span>
              <span className="font-bold text-slate-800">₹{Math.round(distanceKm * activeCategoryObj.perKm)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Travel Time</span>
              <span className="font-bold text-slate-800">~28 Mins</span>
            </div>
            <div className="flex justify-between">
              <span>Driver Toll & Taxes</span>
              <span className="font-bold text-emerald-600">Included</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
              <span>Estimated Total</span>
              <span className="text-amber-600">₹{calculatedFare}</span>
            </div>
          </div>

          {/* Available Driver Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Nearby Assigned Driver
            </span>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  {drivers[0]?.name || "Vikramaditya Rao"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {drivers[0]?.vehicle || "Silver Innova"} • {drivers[0]?.plate || "DL 01 AB 4022"}
                </p>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>4.9</span>
              </div>
            </div>
          </div>

          {/* Book Action */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBookRide}
            className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all ${
              isSubmitting
                ? "bg-slate-700 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? dispatchStatus : `Book ${activeCategoryObj.name} • ₹${calculatedFare}`}
          </button>
        </div>
      </div>
    </div>
  );
};
