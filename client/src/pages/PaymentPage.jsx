import React, { useState } from "react";
import {
  Lock,
  ShieldCheck,
  CreditCard,
  Train,
  Film,
  Car,
  Calendar,
  ChevronRight,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { RazorpayModal } from "../components/payment/RazorpayModal";

export const PaymentPage = ({ setActiveTab, setPaymentResult }) => {
  const { activePaymentBooking } = useBooking();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const booking = activePaymentBooking;

  if (!booking) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-4 max-w-lg mx-auto mt-8">
        <Clock className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-extrabold text-slate-900 text-lg">No Pending Booking Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select a flight, train, bus, movie, cab, or event booking to proceed with checkout.
        </p>
        <button
          onClick={() => setActiveTab("dashboard")}
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate taxes and itemized amounts
  const totalAmount = booking.fare || 1000;
  const baseFare = Math.round(totalAmount / 1.18);
  const gstAmount = totalAmount - baseFare;
  const convenienceFee = 40;
  const grandTotal = totalAmount + convenienceFee;

  const handleInitiatePayment = async () => {
    setIsCreatingOrder(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: grandTotal
        })
      });

      const json = await res.json();
      setIsCreatingOrder(false);

      if (res.ok && json.success) {
        setOrderData(json.order);
        setIsRazorpayModalOpen(true);
      } else {
        setErrorMsg(json.error || "Failed to create payment order on server");
      }
    } catch (err) {
      setIsCreatingOrder(false);
      setErrorMsg(err.message || "Network error while connecting to payment gateway");
    }
  };

  const handlePaymentSuccess = (payment, updatedBooking) => {
    setIsRazorpayModalOpen(false);
    setPaymentResult({
      status: "SUCCESS",
      payment,
      booking: updatedBooking || booking
    });
    setActiveTab("payment_status");
  };

  const handlePaymentFailure = (failureInfo) => {
    setIsRazorpayModalOpen(false);
    setPaymentResult({
      status: "FAILED",
      reason: failureInfo.reason,
      orderId: failureInfo.orderId,
      booking
    });
    setActiveTab("payment_status");
  };

  const getModuleIcon = () => {
    switch (booking.module) {
      case "bus_train":
        return <Train className="w-5 h-5 text-brand-600" />;
      case "movie":
        return <Film className="w-5 h-5 text-purple-600" />;
      case "cab":
        return <Car className="w-5 h-5 text-amber-600" />;
      case "event":
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0c2340] via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              RAZORPAY TEST MODE
            </span>
            <span className="text-xs text-blue-200 font-semibold">Secure Checkout</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Complete Your Booking Payment
          </h2>
          <p className="text-xs text-slate-400">
            Booking ID: <span className="font-mono font-bold text-white">{booking.id}</span> • Status: Pending Verification
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Payable</span>
          <p className="text-3xl font-black text-emerald-400">₹{grandTotal}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Details + Fare Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Booking Breakdown */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              {getModuleIcon()}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {booking.module?.replace("_", " & ")}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">{booking.title}</h3>
            </div>
          </div>

          {/* Module-Specific Data Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {booking.module === "bus_train" && (
              <>
                <div>
                  <p className="text-slate-400 font-medium">Route</p>
                  <p className="font-bold text-slate-800 text-sm">{booking.from} → {booking.to}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Date of Journey</p>
                  <p className="font-bold text-slate-800">{booking.date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium mb-1">Passengers ({booking.passengers?.length || 1})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.passengers?.map((p, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                        {p.name} ({p.age}y)
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {booking.module === "movie" && (
              <>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">Cinema & Auditorium</p>
                  <p className="font-bold text-slate-800">{booking.cinema} ({booking.screen})</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Date & Showtime</p>
                  <p className="font-bold text-slate-800">{booking.date} • {booking.showtime}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Seats Selected ({booking.tier})</p>
                  <p className="font-mono font-bold text-purple-600">{Array.isArray(booking.seats) ? booking.seats.join(", ") : booking.seats}</p>
                </div>
              </>
            )}

            {booking.module === "cab" && (
              <>
                <div>
                  <p className="text-slate-400 font-medium">Pickup</p>
                  <p className="font-bold text-slate-800">{booking.pickup}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Drop</p>
                  <p className="font-bold text-slate-800">{booking.drop}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">Vehicle / Driver</p>
                  <p className="font-semibold text-slate-700">{booking.driver?.name} • {booking.driver?.vehicle} ({booking.driver?.plate})</p>
                </div>
              </>
            )}

            {booking.module === "event" && (
              <>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium">Venue & Dates</p>
                  <p className="font-bold text-slate-800">{booking.venue} ({booking.date})</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Delegate Name</p>
                  <p className="font-bold text-slate-800">{booking.attendee?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Pass Type</p>
                  <p className="font-bold text-indigo-600">{booking.tier} (Qty: {booking.quantity})</p>
                </div>
              </>
            )}
          </div>

          {/* Supported Methods Showcase */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Accepted Razorpay Test Payment Methods
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="bg-white border border-slate-200 px-3 py-1 rounded-xl">UPI (GPay / PhonePe / Paytm)</span>
              <span className="bg-white border border-slate-200 px-3 py-1 rounded-xl">Credit & Debit Cards (Visa / MC / RuPay)</span>
              <span className="bg-white border border-slate-200 px-3 py-1 rounded-xl">Net Banking (HDFC, ICICI, SBI)</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Itemized Fare & Pay Now Action */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
          <h4 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            Itemized Fare Breakdown
          </h4>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Base Fare / Ticket Cost</span>
              <span className="font-bold text-slate-800">₹{baseFare}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Services Tax (18%)</span>
              <span className="font-bold text-slate-800">₹{gstAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Gateway & Convenience Fee</span>
              <span className="font-bold text-slate-800">₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
              <span>Final Payable</span>
              <span className="text-blue-600">₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isCreatingOrder}
            onClick={handleInitiatePayment}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-accent-600 hover:from-blue-700 hover:to-accent-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isCreatingOrder ? "Connecting Razorpay..." : `Pay Now • ₹${grandTotal}`}</span>
          </button>

          <div className="text-center space-y-1">
            <p className="text-[11px] text-slate-400 font-medium">
              Clicking Pay Now opens the Razorpay Test Modal.
            </p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HMAC-SHA256 Server Signature Verification</span>
            </p>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      {orderData && (
        <RazorpayModal
          isOpen={isRazorpayModalOpen}
          onClose={() => setIsRazorpayModalOpen(false)}
          booking={booking}
          orderData={orderData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </div>
  );
};
