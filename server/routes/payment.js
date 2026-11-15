import express from "express";
import crypto from "crypto";
import { dataStore } from "../services/dataStore.js";

const router = express.Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_traveltest2026";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "traveltest_secret_key_8849";

// Helper: generate HMAC-SHA256 signature
export function generateSignature(orderId, paymentId, secret = RAZORPAY_KEY_SECRET) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

// 1. POST /api/payment/create-order
router.post("/create-order", async (req, res) => {
  try {
    const { bookingId, amount, currency = "INR", customer } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, error: "Booking ID is required to create a payment order" });
    }

    const booking = dataStore.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: `Booking ${bookingId} not found` });
    }

    const payableAmount = Number(amount || booking.fare || 500);
    if (payableAmount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid payment amount" });
    }

    // Generate unique Razorpay Order ID (e.g., order_NX882910)
    const randomHex = crypto.randomBytes(8).toString("hex").toUpperCase();
    const orderId = `order_${randomHex}`;

    // Create a pending transaction record
    const paymentRecord = {
      id: "PAY-TRX-" + Math.floor(100000 + Math.random() * 900000),
      bookingId: booking.id,
      orderId,
      paymentId: null,
      amount: payableAmount,
      currency,
      method: null,
      status: "PENDING",
      customerId: customer?.id || "usr_guest",
      customerName: customer?.name || (booking.passengers?.[0]?.name || booking.attendee?.name || "Customer"),
      customerEmail: customer?.email || (booking.attendee?.email || "customer@traveltest.com"),
      receipt: `RCP-${Date.now().toString().slice(-7)}`,
      failureReason: null,
      createdAt: new Date().toISOString()
    };

    dataStore.addPayment(paymentRecord);

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        entity: "order",
        amount: payableAmount * 100, // in paise as per Razorpay standard
        amount_paid: 0,
        amount_due: payableAmount * 100,
        currency,
        receipt: paymentRecord.receipt,
        status: "created",
        bookingId: booking.id,
        keyId: RAZORPAY_KEY_ID,
        isTestMode: true
      }
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to create Razorpay order" });
  }
});

// 2. POST /api/payment/verify
router.post("/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      method = "upi",
      methodDetails = {}
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Missing required Razorpay payment response parameters (order_id, payment_id, signature)"
      });
    }

    // Find payment record
    const paymentRecord =
      dataStore.getPaymentByOrderId(razorpay_order_id) ||
      (bookingId ? dataStore.getPaymentByBookingId(bookingId) : null);

    if (!paymentRecord) {
      return res.status(404).json({ success: false, error: "No matching order record found for this transaction" });
    }

    // Duplicate payment prevention
    if (paymentRecord.status === "SUCCESS") {
      return res.status(409).json({
        success: false,
        error: "Duplicate payment processing prevented: Order has already been paid and verified.",
        payment: paymentRecord
      });
    }

    // Server-side HMAC-SHA256 signature verification
    const expectedSignature = generateSignature(razorpay_order_id, razorpay_payment_id);

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch - tampering or forgery detected
      dataStore.updatePayment(paymentRecord.id, {
        status: "FAILED",
        failureReason: "Security Alert: Invalid payment signature verification failed",
        paymentId: razorpay_payment_id
      });

      return res.status(400).json({
        success: false,
        error: "Invalid payment signature: Server-side cryptographic verification rejected this transaction."
      });
    }

    // Signature is VALID -> Confirm transaction & booking!
    const updatedPayment = dataStore.updatePayment(paymentRecord.id, {
      paymentId: razorpay_payment_id,
      status: "SUCCESS",
      method: method || "upi",
      methodDetails,
      verifiedAt: new Date().toISOString()
    });

    // Update booking status from "Pending Payment" to "Confirmed"
    const updatedBooking = dataStore.updateBookingStatus(paymentRecord.bookingId, "Confirmed", {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentMethod: method,
      paidAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: "Payment successfully verified and booking confirmed.",
      payment: updatedPayment,
      booking: updatedBooking
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, error: err.message || "Payment verification failed" });
  }
});

// 3. POST /api/payment/simulate-failure (for testing failed payment flows)
router.post("/simulate-failure", (req, res) => {
  const { orderId, bookingId, reason = "Payment declined by customer bank" } = req.body;
  const paymentRecord =
    (orderId ? dataStore.getPaymentByOrderId(orderId) : null) ||
    (bookingId ? dataStore.getPaymentByBookingId(bookingId) : null);

  if (paymentRecord) {
    dataStore.updatePayment(paymentRecord.id, {
      status: "FAILED",
      failureReason: reason,
      paymentId: "pay_failed_" + Date.now().toString().slice(-6)
    });
  }

  // Ensure booking remains unconfirmed
  if (bookingId) {
    dataStore.updateBookingStatus(bookingId, "Pending Payment");
  }

  res.json({
    success: true,
    message: "Payment failure simulated successfully",
    reason
  });
});

// 4. POST /api/payment/webhook
router.post("/webhook", (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "traveltest_webhook_secret_99";
  const signature = req.headers["x-razorpay-signature"];

  if (!signature) {
    return res.status(400).json({ success: false, error: "Missing x-razorpay-signature header" });
  }

  const rawBody = JSON.stringify(req.body);
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

  if (signature !== expected) {
    return res.status(400).json({ success: false, error: "Invalid webhook signature" });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.captured") {
    const paymentEntity = payload.payment.entity;
    dataStore.updatePayment(paymentEntity.order_id, {
      status: "SUCCESS",
      paymentId: paymentEntity.id
    });
  } else if (event === "payment.failed") {
    const paymentEntity = payload.payment.entity;
    dataStore.updatePayment(paymentEntity.order_id, {
      status: "FAILED",
      failureReason: paymentEntity.error_description || "Webhook reported payment failure"
    });
  }

  res.json({ success: true, received: true });
});

// 5. GET /api/payment/status/:bookingId
router.get("/status/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const booking = dataStore.getBookingById(bookingId);
  const payment = dataStore.getPaymentByBookingId(bookingId);

  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  res.json({
    success: true,
    bookingId,
    bookingStatus: booking.status,
    payment: payment || null,
    isConfirmed: booking.status === "Confirmed"
  });
});

// 6. GET /api/payment/history
router.get("/history", (req, res) => {
  const { method, status } = req.query;
  let payments = dataStore.getPayments();

  if (method && method !== "all") {
    payments = payments.filter(p => p.method?.toLowerCase() === method.toLowerCase());
  }
  if (status && status !== "all") {
    payments = payments.filter(p => p.status?.toLowerCase() === status.toLowerCase());
  }

  res.json({ success: true, count: payments.length, payments });
});

// 7. GET /api/payment/stats
router.get("/stats", (req, res) => {
  const payments = dataStore.getPayments();

  const total = payments.length;
  const successful = payments.filter(p => p.status === "SUCCESS");
  const failed = payments.filter(p => p.status === "FAILED");
  const pending = payments.filter(p => p.status === "PENDING");

  const totalAmount = successful.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Method breakdown
  const upiCount = successful.filter(p => p.method === "upi").length;
  const cardCount = successful.filter(p => p.method === "card").length;
  const netbankingCount = successful.filter(p => p.method === "netbanking").length;

  res.json({
    success: true,
    stats: {
      totalTransactions: total,
      successfulPayments: successful.length,
      failedPayments: failed.length,
      pendingPayments: pending.length,
      totalAmount,
      successRate: total > 0 ? Math.round((successful.length / total) * 100) : 100,
      methods: {
        upi: upiCount,
        card: cardCount,
        netbanking: netbankingCount
      }
    }
  });
});

export default router;
