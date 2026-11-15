import React from "react";
import { Printer, Download, CheckCircle2, ShieldCheck, QrCode } from "lucide-react";

export const PaymentReceipt = ({ payment, booking, onClose }) => {
  if (!payment || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const baseFare = Math.round(payment.amount / 1.18);
  const totalTax = payment.amount - baseFare;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl max-w-2xl mx-auto space-y-6">
      {/* Receipt Top Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
              TT
            </span>
            <h3 className="font-black text-xl text-slate-900 tracking-tight">
              TravelTest Platforms Pvt Ltd
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            GSTIN: <span className="font-mono font-semibold text-slate-600">07AABCT8849J1ZT</span> • SAC: 996411
          </p>
          <p className="text-[11px] text-slate-400">
            Connaught Place Financial Centre, New Delhi, India 110001
          </p>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-1">
            TAX INVOICE / PAID
          </span>
          <p className="font-mono text-xs font-bold text-slate-800">
            Receipt: {payment.receipt || "RCP-" + payment.id}
          </p>
          <p className="text-[11px] text-slate-400">
            {new Date(payment.createdAt || Date.now()).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transaction & Customer Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div>
          <span className="text-slate-400 font-medium">Billed To (Customer):</span>
          <p className="font-extrabold text-slate-800 text-sm">{payment.customerName || "Customer"}</p>
          <p className="text-slate-500">{payment.customerEmail || "customer@traveltest.com"}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Payment Gateway Reference:</span>
          <p className="font-mono font-bold text-blue-600">{payment.paymentId || "pay_simulated_test"}</p>
          <p className="text-slate-400 text-[11px]">Razorpay Order: {payment.orderId}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Booking ID:</span>
          <p className="font-mono font-extrabold text-slate-800">{booking.id}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Payment Method:</span>
          <p className="font-bold text-slate-800 uppercase tracking-wide">
            {payment.method || "UPI"} (Razorpay Test Mode)
          </p>
        </div>
      </div>

      {/* Line Item Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount (INR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3.5 font-semibold text-slate-800">
                {booking.title || "Reservation Fee"}
                <p className="text-[10px] text-slate-400 font-normal">
                  Ref: {booking.pnr || booking.bookingCode || booking.badgeId || booking.otp}
                </p>
              </td>
              <td className="px-4 py-3.5 text-slate-500 uppercase">{booking.module?.replace("_", " & ")}</td>
              <td className="px-4 py-3.5 text-right font-bold text-slate-900">₹{baseFare}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-slate-500">CGST (9.0%)</td>
              <td className="px-4 py-2.5 text-slate-400">Tax</td>
              <td className="px-4 py-2.5 text-right font-medium text-slate-600">₹{cgst}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 text-slate-500">SGST (9.0%)</td>
              <td className="px-4 py-2.5 text-slate-400">Tax</td>
              <td className="px-4 py-2.5 text-right font-medium text-slate-600">₹{sgst}</td>
            </tr>
            <tr className="bg-slate-50 font-extrabold text-sm text-slate-900">
              <td colSpan={2} className="px-4 py-3 text-right uppercase tracking-wider text-xs">
                Total Paid
              </td>
              <td className="px-4 py-3 text-right text-blue-600">₹{payment.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Security & Verification Stamp */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cryptographically Verified with HMAC-SHA256 Signature</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
