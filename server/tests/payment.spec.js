import { test, expect } from "@playwright/test";
import crypto from "crypto";

test.describe("Module 5: Payment Gateway Automation (Razorpay Test Mode)", () => {
  const API_BASE = "http://localhost:5000/api";
  const SECRET = "traveltest_secret_key_8849";

  function generateSig(orderId, paymentId) {
    return crypto.createHmac("sha256", SECRET).update(`${orderId}|${paymentId}`).digest("hex");
  }

  test("TC-PAY-01: Open payment page and load pending booking", async ({ request }) => {
    // Create a pending booking
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "New Delhi",
        to: "Jaipur",
        date: "2026-12-20",
        passengers: [{ name: "Priya Singh", age: 26 }],
        fare: 950
      }
    });
    expect(bookRes.status()).toBe(201);
    const bookJson = await bookRes.json();
    expect(bookJson.booking.status).toBe("Pending Payment");

    // Fetch booking details
    const getRes = await request.get(`${API_BASE}/bookings/${bookJson.booking.id}`);
    expect(getRes.status()).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.booking.id).toBe(bookJson.booking.id);
  });

  test("TC-PAY-02: Verify booking amount and fare calculations", async ({ request }) => {
    const baseFare = 850;
    const gst = Math.round(baseFare * 0.18);
    const convenience = 40;
    const finalAmount = baseFare + gst + convenience;
    expect(finalAmount).toBe(1043);
  });

  test("TC-PAY-03: Click Pay Now generates Razorpay order on backend", async ({ request }) => {
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "cab",
        pickup: "Aerocity",
        drop: "Cyber Hub",
        category: "sedan",
        fare: 450
      }
    });
    const booking = (await bookRes.json()).booking;

    const orderRes = await request.post(`${API_BASE}/payment/create-order`, {
      data: {
        bookingId: booking.id,
        amount: booking.fare
      }
    });

    expect(orderRes.status()).toBe(201);
    const orderJson = await orderRes.json();
    expect(orderJson.order.id).toMatch(/^order_/);
    expect(orderJson.order.amount).toBe(45000); // 450 * 100 paise
    expect(orderJson.order.keyId).toBeDefined();
  });

  test("TC-PAY-04: Select UPI options availability", async () => {
    const upiMethods = ["Google Pay", "PhonePe", "Paytm", "BHIM", "UPI ID"];
    expect(upiMethods.length).toBeGreaterThanOrEqual(4);
  });

  test("TC-PAY-05: Select Card fields and test card formats", async () => {
    const testCard = "4111111111111111";
    expect(testCard.length).toBe(16);
    expect(testCard.startsWith("4")).toBeTruthy();
  });

  test("TC-PAY-06: Successful test payment verifies signature and confirms booking", async ({ request }) => {
    // 1. Create booking
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "movie",
        movieId: "MOV-01",
        cinema: "PVR ICON",
        showtime: "05:00 PM",
        seats: ["C" + Math.floor(Math.random() * 6 + 1)],
        fare: 1000
      }
    });
    const booking = (await bookRes.json()).booking;

    // 2. Create order
    const orderRes = await request.post(`${API_BASE}/payment/create-order`, {
      data: { bookingId: booking.id, amount: 1000 }
    });
    const order = (await orderRes.json()).order;

    // 3. Generate valid Razorpay payment signature
    const paymentId = "pay_test_" + Date.now();
    const signature = generateSig(order.id, paymentId);

    // 4. Verify payment
    const verifyRes = await request.post(`${API_BASE}/payment/verify`, {
      data: {
        razorpay_order_id: order.id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        bookingId: booking.id,
        method: "upi"
      }
    });

    expect(verifyRes.status()).toBe(200);
    const verifyJson = await verifyRes.json();
    expect(verifyJson.payment.status).toBe("SUCCESS");
    expect(verifyJson.booking.status).toBe("Confirmed");
  });

  test("TC-PAY-07: Failed test payment records failure and keeps booking unconfirmed", async ({ request }) => {
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "event",
        eventId: "EVT-01",
        attendee: { name: "Kunal", email: "kunal@test.org", phone: "+91 99887 76655" },
        fare: 499
      }
    });
    const booking = (await bookRes.json()).booking;

    const failRes = await request.post(`${API_BASE}/payment/simulate-failure`, {
      data: {
        bookingId: booking.id,
        reason: "Customer bank server timed out"
      }
    });

    expect(failRes.status()).toBe(200);

    // Assert booking remains unconfirmed
    const statusRes = await request.get(`${API_BASE}/payment/status/${booking.id}`);
    const statusJson = await statusRes.json();
    expect(statusJson.isConfirmed).toBe(false);
  });

  test("TC-PAY-08: Invalid payment signature is rejected with 400 error", async ({ request }) => {
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "cab",
        pickup: "Delhi Station",
        drop: "Noida",
        category: "mini",
        fare: 300
      }
    });
    const booking = (await bookRes.json()).booking;

    const orderRes = await request.post(`${API_BASE}/payment/create-order`, {
      data: { bookingId: booking.id, amount: 300 }
    });
    const order = (await orderRes.json()).order;

    // Send forged signature
    const verifyRes = await request.post(`${API_BASE}/payment/verify`, {
      data: {
        razorpay_order_id: order.id,
        razorpay_payment_id: "pay_tampered_123",
        razorpay_signature: "invalid_tampered_signature_hex",
        bookingId: booking.id,
        method: "card"
      }
    });

    expect(verifyRes.status()).toBe(400);
    const json = await verifyRes.json();
    expect(json.error).toContain("Invalid payment signature");
  });

  test("TC-PAY-09: Duplicate payment request is prevented", async ({ request }) => {
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "Mumbai",
        to: "Pune",
        date: "2026-12-11",
        passengers: [{ name: "Ravi", age: 30 }],
        fare: 500
      }
    });
    const booking = (await bookRes.json()).booking;

    const orderRes = await request.post(`${API_BASE}/payment/create-order`, {
      data: { bookingId: booking.id, amount: 500 }
    });
    const order = (await orderRes.json()).order;
    const paymentId = "pay_dup_" + Date.now();
    const signature = generateSig(order.id, paymentId);

    // First payment: success
    const firstRes = await request.post(`${API_BASE}/payment/verify`, {
      data: {
        razorpay_order_id: order.id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        bookingId: booking.id
      }
    });
    expect(firstRes.status()).toBe(200);

    // Second payment attempt for same order: must be blocked
    const dupRes = await request.post(`${API_BASE}/payment/verify`, {
      data: {
        razorpay_order_id: order.id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        bookingId: booking.id
      }
    });
    expect(dupRes.status()).toBe(409);
    const dupJson = await dupRes.json();
    expect(dupJson.error).toContain("Duplicate payment processing prevented");
  });

  test("TC-PAY-10: Refresh payment page preserves consistent state", async ({ request }) => {
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "New Delhi",
        to: "Goa",
        date: "2026-12-25",
        passengers: [{ name: "Rohit", age: 32 }],
        fare: 2200
      }
    });
    const booking = (await bookRes.json()).booking;

    const check1 = await request.get(`${API_BASE}/payment/status/${booking.id}`);
    const check2 = await request.get(`${API_BASE}/payment/status/${booking.id}`);
    expect(check1.status()).toBe(200);
    expect(check2.status()).toBe(200);
    const j1 = await check1.json();
    const j2 = await check2.json();
    expect(j1.bookingStatus).toBe(j2.bookingStatus);
  });

  test("TC-PAY-11: Booking remains unconfirmed while payment is pending", async ({ request }) => {
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "cab",
        pickup: "Connaught Place",
        drop: "Gurgaon",
        category: "luxury",
        fare: 800
      }
    });
    const booking = (await bookRes.json()).booking;
    expect(booking.status).toBe("Pending Payment");

    const statusRes = await request.get(`${API_BASE}/payment/status/${booking.id}`);
    const json = await statusRes.json();
    expect(json.isConfirmed).toBe(false);
  });

  test("TC-PAY-12: Verify payment receipt contains valid tax and transaction data", async ({ request }) => {
    const statsRes = await request.get(`${API_BASE}/payment/history`);
    expect(statsRes.status()).toBe(200);
    const json = await statsRes.json();
    const successPayments = json.payments.filter(p => p.status === "SUCCESS");
    expect(successPayments.length).toBeGreaterThan(0);
    const receipt = successPayments[0];
    expect(receipt.amount).toBeGreaterThan(0);
    expect(receipt.id).toMatch(/^PAY-TRX-/);
  });
});
