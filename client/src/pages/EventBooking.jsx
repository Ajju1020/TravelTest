import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Users,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export const EventBooking = ({ setActiveTab }) => {
  const { masterData, createBooking, showToast } = useBooking();

  const events = masterData?.events || [];
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [attendee, setAttendee] = useState({
    name: "Dr. K. Raman",
    email: "k.raman@quantum.in",
    phone: "+91 98765 00112",
    org: "Quantum AI Research Labs"
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default select first event on load
  React.useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
      setSelectedTier(events[0].tiers[0]);
    }
  }, [events]);

  const handleSelectEvent = (evt) => {
    setSelectedEvent(evt);
    setSelectedTier(evt.tiers[0]);
    setFormError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!selectedEvent || !selectedTier) {
      setFormError("Please choose an event and pass category.");
      return;
    }

    if (!attendee.name.trim()) {
      setFormError("Participant full name is required.");
      return;
    }

    // RFC Regex Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(attendee.email)) {
      setFormError("Please enter a valid participant email address (e.g. name@domain.com).");
      return;
    }

    if (!attendee.phone || attendee.phone.length < 8) {
      setFormError("Please enter a valid participant contact phone number.");
      return;
    }

    // Quantity boundary check
    if (quantity > selectedTier.available) {
      setFormError(`Cannot reserve ${quantity} tickets. Only ${selectedTier.available} passes remaining.`);
      return;
    }

    setIsSubmitting(true);

    const totalFare = selectedTier.price * quantity;

    const payload = {
      module: "event",
      eventId: selectedEvent.id,
      title: selectedEvent.title,
      venue: selectedEvent.venue,
      date: selectedEvent.date,
      tier: selectedTier.name,
      quantity,
      attendee,
      fare: totalFare
    };

    const res = await createBooking(payload);
    setIsSubmitting(false);

    if (res.success && setActiveTab) { setActiveTab("payment"); } else if (!res.success) {
      setFormError(res.error || "Registration failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Featured Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-slate-900">Featured Conferences & Summits</h3>
          <span className="text-xs text-slate-400 font-medium">Select an event to register</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt) => {
            const isSelected = selectedEvent?.id === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => handleSelectEvent(evt)}
                className={`bg-white rounded-3xl overflow-hidden border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-lg scale-[1.01]"
                    : "border-slate-200/90 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={evt.banner}
                      alt={evt.title}
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {evt.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                      {evt.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{evt.venue}, {evt.city}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Passes starting from</span>
                  <span className="font-extrabold text-indigo-600 text-sm">
                    ₹{evt.tiers[0]?.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Registration Form */}
      {selectedEvent && (
        <form
          onSubmit={handleRegister}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-200 shadow-lg space-y-8 animate-in slide-in-from-bottom-4 duration-300"
        >
          <div className="border-b border-slate-100 pb-5">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Registration Form
            </span>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              {selectedEvent.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {selectedEvent.venue} • {selectedEvent.date}
            </p>
          </div>

          {/* Ticket Tier Selection */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              1. Choose Ticket Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedEvent.tiers.map((tier) => {
                const isSelected = selectedTier?.id === tier.id;

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-extrabold text-slate-900 text-sm">{tier.name}</h5>
                      <span className="font-black text-indigo-600 text-base">₹{tier.price}</span>
                    </div>

                    <p className="text-[11px] text-emerald-600 font-semibold mb-2">
                      {tier.available} passes remaining
                    </p>

                    <ul className="space-y-1 text-[11px] text-slate-500 font-medium">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Quantity & Attendee Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              2. Participant Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Number of Passes
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Ticket{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={attendee.name}
                  onChange={(e) => setAttendee({ ...attendee, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={attendee.email}
                  onChange={(e) => setAttendee({ ...attendee, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={attendee.phone}
                  onChange={(e) => setAttendee({ ...attendee, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Company / College
                </label>
                <input
                  type="text"
                  placeholder="Institution or Company"
                  value={attendee.org}
                  onChange={(e) => setAttendee({ ...attendee, org: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {formError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Pricing & Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-semibold">Total Registration Fee</span>
              <p className="text-3xl font-black text-slate-900">
                ₹{(selectedTier?.price || 0) * quantity}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-brand-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? "Generating Delegate Pass..." : "Confirm & Register Attendee"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
