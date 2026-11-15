import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Lock,
  ArrowRight,
  Info
} from "lucide-react";

export const RazorpayModal = ({
  isOpen,
  onClose,
  booking,
  orderData,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [activeTab, setActiveTab] = useState("upi"); // "upi", "card", "netbanking"
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("traveler@okhdfcbank");

  // Card fields with pre-filled standard test card
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardHolder, setCardHolder] = useState("Alex Mercer");

  // Net banking
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("123456");

  if (!isOpen || !booking || !orderData) return null;

  const payableAmount = booking.fare || 1000;

  // Helper to generate signature on client for test simulation
  const simulatePaymentVerification = async (isSuccess = true, customError = null) => {
    setIsProcessing(true);

    if (!isSuccess) {
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentFailure({
          reason: customError || "Transaction declined by issuing bank",
          orderId: orderData.id,
          bookingId: booking.id
        });
      }, 1000);
      return;
    }

    // Success flow: call backend verify endpoint
    try {
      const paymentId = "pay_" + Math.random().toString(36).substring(2, 10).toUpperCase();

      // Compute HMAC on server or send verify request
      // We will generate the expected signature or ask backend to verify
      const secret = "traveltest_secret_key_8849";
      // We can use a lightweight hash or call backend verify
      // Let's compute HMAC using crypto in browser SubtleCrypto or helper
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const msgData = encoder.encode(`${orderData.id}|${paymentId}`);

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sigBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, msgData);
      const signature = Array.from(new Uint8Array(sigBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.id,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          bookingId: booking.id,
          method: activeTab,
          methodDetails: {
            provider: activeTab === "upi" ? selectedUpiApp : activeTab === "card" ? "Visa Test" : selectedBank
          }
        })
      });

      const verifyJson = await verifyRes.json();
      setIsProcessing(false);

      if (verifyRes.ok && verifyJson.success) {
        onPaymentSuccess(verifyJson.payment, verifyJson.booking);
      } else {
        onPaymentFailure({
          reason: verifyJson.error || "Payment verification failed on server",
          orderId: orderData.id,
          bookingId: booking.id
        });
      }
    } catch (err) {
      setIsProcessing(false);
      onPaymentFailure({
        reason: err.message || "Network error during payment verification",
        orderId: orderData.id,
        bookingId: booking.id
      });
    }
  };

  const handlePayClick = () => {
    if (activeTab === "card" || activeTab === "netbanking") {
      setShowOtpScreen(true);
    } else {
      simulatePaymentVerification(true);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setShowOtpScreen(false);
    simulatePaymentVerification(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Razorpay Brand Header */}
          <div className="bg-[#0c2340] px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-extrabold text-blue-400 text-lg">
                R
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-white text-base">Razorpay</h3>
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    TEST MODE
                  </span>
                </div>
                <p className="text-xs text-blue-200">TravelTest Platform • {booking.title}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-blue-300 font-semibold uppercase">Amount</span>
              <p className="text-xl font-black text-white">₹{payableAmount}</p>
            </div>
          </div>

          {/* Test Mode Notification Banner */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-amber-800">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Razorpay Sandbox: No real money is charged.</span>
            </span>
            <button
              onClick={() => simulatePaymentVerification(false, "Simulated Bank Decline for Test Scenario")}
              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 underline"
            >
              Simulate Failure
            </button>
          </div>

          {/* Body Content: OTP Screen vs Method Selector */}
          {showOtpScreen ? (
            <div className="p-6 space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">Bank 3D Secure Verification</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  An OTP has been sent to your registered mobile number for test payment of ₹{payableAmount}.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-center text-xs font-bold text-slate-600 uppercase mb-2">
                    Enter One Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-48 mx-auto block bg-slate-50 border-2 border-brand-500 rounded-2xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-slate-900 focus:outline-none"
                  />
                  <p className="text-center text-[10px] text-slate-400 mt-1">Use default: 123456</p>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                  >
                    {isProcessing ? "Verifying..." : "Submit OTP & Pay"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Payment Methods Nav Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("upi")}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                    activeTab === "upi"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI Options</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("card")}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                    activeTab === "card"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("netbanking")}
                  className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition ${
                    activeTab === "netbanking"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Tab 1: UPI */}
              {activeTab === "upi" && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
                      Popular UPI Apps
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "gpay", name: "Google Pay" },
                        { id: "phonepe", name: "PhonePe" },
                        { id: "paytm", name: "Paytm" }
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`p-3 rounded-2xl border text-center transition ${
                            selectedUpiApp === app.id
                              ? "bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                          }`}
                        >
                          <span className="text-xs">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Or Enter Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Test VPAs: <span className="font-mono text-blue-600">success@razorpay</span> or{" "}
                      <span className="font-mono text-rose-600">failure@razorpay</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Cards */}
              {activeTab === "card" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Card Details (Test Cards)
                    </span>
                    <div className="flex space-x-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Visa
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Mastercard
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        RuPay
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Net Banking */}
              {activeTab === "netbanking" && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Select Test Bank
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 rounded-2xl border text-left text-xs transition ${
                            selectedBank === bank
                              ? "bg-blue-50 border-blue-500 font-bold text-blue-900 ring-2 ring-blue-500/20"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Pay Now Button */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayClick}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing ? "Processing..." : `Pay ₹${payableAmount} via Razorpay`}
                  </span>
                </button>

                <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-400 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>256-bit Encrypted</span>
                  </span>
                  <span>•</span>
                  <span>Order: {orderData.id}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
