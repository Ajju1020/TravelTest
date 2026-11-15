import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileText,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Ticket,
  ChevronLeft
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { PaymentReceipt } from "../components/payment/PaymentReceipt";

export const PaymentStatus = ({ result, setActiveTab }) => {
  const { setActiveTicket, refreshBookings } = useBooking();
  const [showReceipt, setShowReceipt] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(result?.status || "SUCCESS");

  if (!result) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-md mx-auto space-y-4">
        <Clock className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-extrabold text-slate-900 text-lg">No Payment Transaction</h3>
        <button
          onClick={() => setActiveTab("dashboard")}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { payment, booking, reason, orderId } = result;

  const handleCheckStatus = async () => {
    if (!booking?.id) return;
    setCheckingStatus(true);
    try {
      const res = await fetch(`/api/payment/status/${booking.id}`);
      const json = await res.json();
      setCheckingStatus(false);
      if (json.isConfirmed) {
        setCurrentStatus("SUCCESS");
        refreshBookings();
      }
    } catch (e) {
      setCheckingStatus(false);
    }
  };

  const handleViewTicket = () => {
    if (booking) {
      setActiveTicket(booking);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Payment Successful Screen */}
      {currentStatus === "SUCCESS" && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce-in">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Transaction Completed
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Payment Successful!
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your payment has been securely verified by Razorpay and your booking is confirmed.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-left space-y-3">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-400 font-medium">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800">{payment?.paymentId || "pay_mock_test"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-400 font-medium">Razorpay Order ID</span>
              <span className="font-mono font-bold text-slate-800">{payment?.orderId || orderId || "order_test"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-400 font-medium">Booking ID</span>
              <span className="font-mono font-bold text-blue-600">{booking?.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-400 font-medium">Amount Paid</span>
              <span className="font-black text-slate-900 text-sm">₹{payment?.amount || booking?.fare}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-400 font-medium">Payment Method</span>
              <span className="font-bold text-slate-800 uppercase">{payment?.method || "UPI"} (Razorpay Test Mode)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-medium">Date & Time</span>
              <span className="font-semibold text-slate-700">{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowReceipt(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              <FileText className="w-4 h-4" />
              <span>Download Receipt (PDF)</span>
            </button>

            <button
              onClick={handleViewTicket}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition"
            >
              <Ticket className="w-4 h-4" />
              <span>View Confirmed Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className="w-full sm:w-auto flex items-center justify-center space-x-1 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <span>My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Payment Failed Screen */}
      {currentStatus === "FAILED" && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 border-2 border-rose-200 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20 animate-bounce-in">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Payment Error
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Payment Failed
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your transaction could not be processed by the payment gateway.
            </p>
          </div>

          {/* Failure Callout Box */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 text-xs text-left space-y-2">
            <span className="font-bold text-rose-800 uppercase text-[10px]">Failure Reason</span>
            <p className="font-semibold text-rose-900">{reason || "Card issuing bank declined the simulated charge."}</p>
            <p className="text-[11px] text-rose-700">
              Booking <span className="font-mono font-bold">{booking?.id}</span> remains unconfirmed in your cart. No funds were debited.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab("payment")}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Payment</span>
            </button>

            <button
              onClick={() => setActiveTab(booking?.module || "dashboard")}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Booking</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Payment Pending Screen */}
      {currentStatus === "PENDING" && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 border-2 border-amber-200 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-pulse">
            <Clock className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Verification In Progress
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Payment Pending
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We are awaiting confirmation from your UPI app or bank gateway.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-left space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-amber-800 font-medium">Order Reference:</span>
              <span className="font-mono font-bold text-slate-800">{orderId || payment?.orderId || "order_pending"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-amber-800 font-medium">Booking ID:</span>
              <span className="font-mono font-bold text-slate-800">{booking?.id}</span>
            </div>
            <p className="text-[11px] text-amber-700">
              Your booking remains on hold and will confirm automatically once verified.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition"
            >
              <RotateCcw className={`w-4 h-4 ${checkingStatus ? "animate-spin" : ""}`} />
              <span>{checkingStatus ? "Checking Status..." : "Check Payment Status"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal Drawer */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <PaymentReceipt
            payment={payment || { amount: booking?.fare, receipt: "RCP-" + Date.now().toString().slice(-6), method: "UPI" }}
            booking={booking}
            onClose={() => setShowReceipt(false)}
          />
        </div>
      )}
    </div>
  );
};
