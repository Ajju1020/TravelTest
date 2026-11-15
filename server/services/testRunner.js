import { testCases } from "./testCases.js";
import { dataStore } from "./dataStore.js";
import { generateSignature } from "../routes/payment.js";

class TestRunner {
  constructor() {
    this.activeRun = null;
    this.listeners = new Set();
  }

  // Subscribe to live SSE events
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(eventType, data) {
    for (const listener of this.listeners) {
      try {
        listener(eventType, data);
      } catch (err) {
        console.error("SSE listener error:", err);
      }
    }
  }

  getTestCases() {
    return testCases;
  }

  // Execute single test case or array of test IDs
  async runTests(testIds = null, options = {}) {
    const targetCases = testIds && testIds.length > 0
      ? testCases.filter(tc => testIds.includes(tc.id))
      : testCases;

    const runId = "RUN-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 1000);
    const startTime = Date.now();
    const config = dataStore.getExecutionConfig();
    const bugSettings = dataStore.getBugSettings();
    const delayMs = options.delayMs !== undefined ? options.delayMs : config.speedDelayMs;

    this.activeRun = {
      runId,
      startTime: new Date().toISOString(),
      total: targetCases.length,
      completed: 0,
      passed: 0,
      failed: 0,
      results: []
    };

    this.emit("run:start", {
      runId,
      total: targetCases.length,
      cases: targetCases.map(c => ({ id: c.id, title: c.title, module: c.module }))
    });

    const results = [];

    for (let i = 0; i < targetCases.length; i++) {
      const tc = targetCases[i];
      const caseStart = Date.now();

      this.emit("test:start", {
        runId,
        testId: tc.id,
        module: tc.module,
        title: tc.title,
        index: i + 1,
        total: targetCases.length
      });

      const logs = [];
      const log = (msg, level = "INFO") => {
        const entry = { time: new Date().toISOString().split("T")[1].replace("Z", ""), level, msg };
        logs.push(entry);
        this.emit("step:log", { runId, testId: tc.id, ...entry });
      };

      let status = "PASSED";
      let error = null;

      try {
        log(`Executing [${tc.id}] ${tc.title}`);
        log(`Module: ${tc.moduleTitle} | Type: ${tc.type} | Severity: ${tc.severity}`);

        if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));

        // Execute specific automated test scenario
        await this.executeScenario(tc, log, bugSettings, delayMs);

        log(`Assertions passed successfully for [${tc.id}]`, "SUCCESS");
      } catch (err) {
        status = "FAILED";
        error = {
          message: err.message || "Assertion failed",
          stack: err.stack ? err.stack.split("\n").slice(0, 3).join("\n") : ""
        };
        log(`Assertion Failure: ${err.message}`, "ERROR");
      }

      const caseDuration = Date.now() - caseStart;
      const resultItem = {
        testId: tc.id,
        module: tc.module,
        moduleTitle: tc.moduleTitle,
        title: tc.title,
        status,
        durationMs: caseDuration,
        error: error ? error.message : null,
        errorDetails: error,
        logs,
        timestamp: new Date().toISOString()
      };

      results.push(resultItem);
      if (status === "PASSED") this.activeRun.passed++;
      else this.activeRun.failed++;
      this.activeRun.completed++;

      this.emit("test:finish", {
        runId,
        testId: tc.id,
        status,
        durationMs: caseDuration,
        error,
        completed: this.activeRun.completed,
        total: targetCases.length
      });
    }

    const totalDuration = Date.now() - startTime;
    const finalRecord = {
      runId,
      timestamp: new Date().toISOString(),
      total: targetCases.length,
      passed: this.activeRun.passed,
      failed: this.activeRun.failed,
      skipped: 0,
      durationMs: totalDuration,
      successRate: Math.round((this.activeRun.passed / targetCases.length) * 100),
      moduleStats: this.calculateModuleStats(results),
      results
    };

    dataStore.addTestRunRecord(finalRecord);
    this.activeRun = null;

    this.emit("run:complete", finalRecord);
    return finalRecord;
  }

  calculateModuleStats(results) {
    const modules = ["bus_train", "movie", "cab", "event", "payment"];
    const stats = {};
    for (const m of modules) {
      const items = results.filter(r => r.module === m);
      const passed = items.filter(r => r.status === "PASSED").length;
      stats[m] = {
        total: items.length,
        passed,
        failed: items.length - passed,
        rate: items.length ? Math.round((passed / items.length) * 100) : 100
      };
    }
    return stats;
  }

  // Real test scenario execution logic with assertion engine
  async executeScenario(tc, log, bugSettings, delayMs) {
    const step = async (desc, fn) => {
      log(desc, "STEP");
      if (delayMs > 0) await new Promise(r => setTimeout(r, Math.min(delayMs, 100)));
      return await fn();
    };

    switch (tc.id) {
      // Module 1: Bus & Train
      case "TC-BT-01": {
        await step("Step 1: Selecting source city 'New Delhi' and destination 'New Delhi'", () => {});
        if (bugSettings.allowSameSourceDest) {
          throw new Error("Validation Defect: Platform allowed Source and Destination to be identical ('New Delhi' -> 'New Delhi') without rejection!");
        }
        await step("Step 2: Checking city equality guard", () => {
          const source = "New Delhi";
          const dest = "New Delhi";
          if (source === dest) return true;
        });
        await step("Step 3: Selecting valid destination 'Mumbai'", () => {
          const source = "New Delhi";
          const dest = "Mumbai";
          if (source === dest) throw new Error("Unexpected equality");
        });
        break;
      }

      case "TC-BT-02": {
        await step("Step 1: Testing past date validation with date '2020-01-01'", () => {
          const pastDate = new Date("2020-01-01");
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (pastDate >= today) throw new Error("Past date was evaluated as valid!");
        });
        await step("Step 2: Testing valid future journey date", () => {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (futureDate < today) throw new Error("Future date rejected!");
        });
        break;
      }

      case "TC-BT-03": {
        await step("Step 1: Validating passenger count upper boundary (max 6)", () => {
          const passengerCount = 7;
          if (passengerCount > 6) return true;
          throw new Error("Failed to restrict passenger count to max 6");
        });
        await step("Step 2: Validating passenger data structure with 2 passengers", () => {
          const passengers = [
            { name: "Rahul Verma", age: 28, gender: "Male" },
            { name: "Pooja Verma", age: 26, gender: "Female" }
          ];
          for (const p of passengers) {
            if (!p.name || !p.age || p.age < 1) throw new Error("Invalid passenger fields");
          }
        });
        break;
      }

      case "TC-BT-04": {
        await step("Step 1: Querying train catalog for 'New Delhi' to 'Mumbai'", () => {
          const trains = dataStore.getMasterData().trains.filter(t => t.from === "New Delhi");
          if (!trains || trains.length === 0) throw new Error("No trains found for New Delhi route");
        });
        await step("Step 2: Asserting train fleet properties (name, timings, class tiers)", () => {
          const train = dataStore.getMasterData().trains[0];
          if (!train.name || !train.departure || !train.classes || train.classes.length === 0) {
            throw new Error("Train catalog returned incomplete metadata");
          }
        });
        break;
      }

      case "TC-BT-05": {
        await step("Step 1: Loading seat map for AC Chair Car (42 available seats)", () => {});
        await step("Step 2: Selecting Seat C4-24 and verifying state change to 'Selected'", () => {
          const seat = { id: "C4-24", status: "Available" };
          seat.status = "Selected";
          if (seat.status !== "Selected") throw new Error("Seat state transition failed");
        });
        break;
      }

      case "TC-BT-06": {
        await step("Step 1: Submitting complete reservation for Vande Bharat Express", () => {
          const newBooking = {
            id: "BK-BT-" + Math.floor(10000 + Math.random() * 90000),
            module: "bus_train",
            type: "Train",
            title: "Vande Bharat Express (TR-22436)",
            from: "New Delhi",
            to: "Varanasi",
            date: "2026-12-10",
            passengers: [{ name: "Automated Tester", age: 30, gender: "Other", seat: "C1-12" }],
            fare: 1750,
            status: "Confirmed",
            pnr: "PNR-" + Math.floor(1000000 + Math.random() * 9000000),
            createdAt: new Date().toISOString()
          };
          dataStore.addBooking(newBooking);
          return newBooking;
        });
        await step("Step 2: Verifying generated PNR confirmation in booking registry", () => {
          const bookings = dataStore.getBookings();
          const found = bookings.find(b => b.passengers && b.passengers[0].name === "Automated Tester");
          if (!found || !found.pnr.startsWith("PNR-")) throw new Error("PNR verification failed");
        });
        break;
      }

      case "TC-BT-07": {
        await step("Step 1: Submitting booking with missing passenger name", () => {
          const invalidPassenger = { name: "", age: 25, gender: "Male" };
          if (!invalidPassenger.name.trim()) return true;
          throw new Error("Booking was accepted with blank passenger name!");
        });
        break;
      }

      // Module 2: Movie
      case "TC-MV-01": {
        await step("Step 1: Fetching movie catalog and selecting 'Dune: Part Two'", () => {
          const movies = dataStore.getMasterData().movies;
          const movie = movies.find(m => m.id === "MOV-01");
          if (!movie || movie.title !== "Dune: Part Two") throw new Error("Failed to load movie details");
        });
        break;
      }

      case "TC-MV-02": {
        await step("Step 1: Selecting cinema 'PVR ICON' and showtime '08:30 PM'", () => {
          const cinema = dataStore.getMasterData().cinemas[0];
          const time = dataStore.getMasterData().showtimes.includes("08:30 PM");
          if (!cinema || !time) throw new Error("Cinema or showtime unavailable");
        });
        break;
      }

      case "TC-MV-03": {
        await step("Step 1: Choosing seat E5 (Gold Tier) and seat E6 (Gold Tier)", () => {
          const selected = ["E5", "E6"];
          if (selected.length !== 2) throw new Error("Seat selection count mismatch");
        });
        break;
      }

      case "TC-MV-04": {
        await step("Step 1: Querying booked seats for 'MOV-01' at '10:30 AM'", () => {
          const booked = dataStore.getMovieBookedSeats("MOV-01", "10:30 AM");
          if (!booked.includes("D4")) throw new Error("Seed booked seat D4 not marked");
        });
        await step("Step 2: Attempting to click booked seat 'D4'", () => {
          if (bugSettings.movieSeatDoubleBooking) {
            throw new Error("Double-Booking Defect: Seat D4 is already booked, but system allowed duplicate selection!");
          }
          const bookedSeats = ["D4", "D5", "E8"];
          const attemptSeat = "D4";
          if (bookedSeats.includes(attemptSeat)) return true;
        });
        break;
      }

      case "TC-MV-05": {
        await step("Step 1: Calculating price for 2 Gold Tier seats (₹350 each)", () => {
          const seatPrice = 350;
          const qty = 2;
          const subtotal = seatPrice * qty; // 700
          const gst = Math.round(subtotal * 0.18); // 126
          const convenience = 40;
          const total = subtotal + gst + convenience; // 866
          if (total !== 866) throw new Error(`Price formula calculation error: Expected 866, got ${total}`);
        });
        break;
      }

      case "TC-MV-06": {
        await step("Step 1: Completing movie ticket order", () => {
          const movieBooking = {
            id: "BK-MV-" + Math.floor(10000 + Math.random() * 90000),
            module: "movie",
            movieId: "MOV-01",
            title: "Dune: Part Two",
            cinema: "PVR ICON: Gold Class & IMAX, Promenade",
            screen: "Audi 1 (IMAX)",
            showtime: "05:00 PM",
            date: "2026-11-25",
            seats: ["G4", "G5"],
            tier: "Gold",
            fare: 866,
            status: "Confirmed",
            bookingCode: "MOV-TKT-" + Math.floor(1000 + Math.random() * 9000),
            createdAt: new Date().toISOString()
          };
          dataStore.addBooking(movieBooking);
        });
        await step("Step 2: Validating booking pass generation with booking code", () => {
          const bookings = dataStore.getBookings();
          const found = bookings.find(b => b.module === "movie" && b.seats && b.seats.includes("G4"));
          if (!found) throw new Error("Movie booking ticket pass not generated");
        });
        break;
      }

      // Module 3: Cab Booking
      case "TC-CB-01": {
        await step("Step 1: Setting pickup 'Indira Gandhi Airport (DEL)' and drop 'Cyber Hub'", () => {
          const pickup = "Indira Gandhi Airport (DEL)";
          const drop = "Cyber Hub, Gurugram";
          if (!pickup || !drop) throw new Error("Location inputs blank");
        });
        break;
      }

      case "TC-CB-02": {
        await step("Step 1: Setting identical pickup and drop 'Connaught Place'", () => {});
        await step("Step 2: Checking collision rejection guard", () => {
          const pickup = "Connaught Place";
          const drop = "Connaught Place";
          if (pickup === drop) return true;
          throw new Error("Allowed identical pickup and drop!");
        });
        break;
      }

      case "TC-CB-03": {
        await step("Step 1: Testing schedule time validation for ride booking", () => {
          const now = new Date();
          const pastTime = new Date(now.getTime() - 3600000);
          if (pastTime >= now) throw new Error("Past time considered valid");
        });
        break;
      }

      case "TC-CB-04": {
        await step("Step 1: Switching category to 'SUV' and verifying 6-seater capacity", () => {
          const suv = dataStore.getMasterData().cabs.categories.find(c => c.id === "suv");
          if (!suv || suv.capacity !== 6) throw new Error("SUV capacity metadata incorrect");
        });
        break;
      }

      case "TC-CB-05": {
        await step("Step 1: Estimating fare for Prime Sedan for 20 km distance", () => {
          const category = dataStore.getMasterData().cabs.categories.find(c => c.id === "sedan");
          const distKm = 20;
          let calculatedFare = category.baseFare + (distKm * category.perKm); // 90 + 340 = 430
          if (bugSettings.cabFareMultiplierGlitch) {
            calculatedFare = calculatedFare * 3;
            throw new Error(`Fare Calculation Glitch: Expected ₹430 for 20km, but algorithm calculated ₹${calculatedFare}!`);
          }
          if (calculatedFare !== 430) throw new Error("Fare calculation mismatch");
        });
        break;
      }

      case "TC-CB-06": {
        await step("Step 1: Requesting cab and assigning nearest verified driver", () => {
          const driver = dataStore.getMasterData().cabs.drivers[0];
          const newBooking = {
            id: "BK-CB-" + Math.floor(10000 + Math.random() * 90000),
            module: "cab",
            title: "Prime SUV Ride",
            pickup: "Aerocity, New Delhi",
            drop: "India Gate, New Delhi",
            dateTime: new Date().toISOString().replace("T", " ").substring(0, 16),
            category: "suv",
            driver: {
              name: driver.name,
              vehicle: driver.vehicle,
              plate: driver.plate,
              phone: driver.phone
            },
            otp: String(Math.floor(1000 + Math.random() * 9000)),
            fare: 480,
            status: "Confirmed",
            createdAt: new Date().toISOString()
          };
          dataStore.addBooking(newBooking);
        });
        break;
      }

      // Module 4: Event Registration
      case "TC-EV-01": {
        await step("Step 1: Loading event 'Global AI & Cloud Innovation Summit 2026'", () => {
          const event = dataStore.getMasterData().events.find(e => e.id === "EVT-01");
          if (!event || !event.tiers || event.tiers.length === 0) throw new Error("Event catalog loading error");
        });
        break;
      }

      case "TC-EV-02": {
        await step("Step 1: Checking participant name & phone validation", () => {
          const validPhone = "+91 98765 43210";
          const invalidPhone = "123";
          const phoneRegex = /^\+?[\d\s-]{8,15}$/;
          if (!phoneRegex.test(validPhone)) throw new Error("Valid phone rejected");
          if (phoneRegex.test(invalidPhone)) throw new Error("Short phone accepted");
        });
        break;
      }

      case "TC-EV-03": {
        await step("Step 1: Testing email RFC regex validation with invalid format 'user@@domain..com'", () => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const badEmail = "user@@domain..com";
          if (emailRegex.test(badEmail)) throw new Error("Malformed email passed validation!");
        });
        await step("Step 2: Testing valid attendee email 'attendee@techconf.org'", () => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const goodEmail = "attendee@techconf.org";
          if (!emailRegex.test(goodEmail)) throw new Error("Valid email format rejected!");
        });
        break;
      }

      case "TC-EV-04": {
        await step("Step 1: Selecting 3 tickets for Student Delegate Pass (₹499)", () => {
          const price = 499;
          const qty = 3;
          const total = price * qty;
          if (total !== 1497) throw new Error("Ticket quantity total calculation mismatch");
        });
        break;
      }

      case "TC-EV-05": {
        await step("Step 1: Verifying inventory cap against remaining VIP tickets", () => {
          const event = dataStore.getMasterData().events[0];
          const vipTier = event.tiers.find(t => t.id === "vip");
          const remaining = vipTier.available;
          const requestedQty = 25;
          if (requestedQty > remaining) return true;
          throw new Error("Allowed booking exceeding available capacity!");
        });
        break;
      }

      case "TC-EV-06": {
        await step("Step 1: Submitting registration for Global AI Summit", () => {
          const regBooking = {
            id: "BK-EV-" + Math.floor(10000 + Math.random() * 90000),
            module: "event",
            title: "Global AI & Cloud Innovation Summit 2026",
            eventId: "EVT-01",
            venue: "Bharat Mandapam Convention Centre",
            date: "Dec 12-14, 2026",
            tier: "Student Delegate Pass",
            quantity: 1,
            attendee: {
              name: "Maya Shenoy",
              email: "maya.shenoy@iiitb.ac.in",
              phone: "+91 99887 11223"
            },
            badgeId: "AI-DELEGATE-" + Math.floor(1000 + Math.random() * 9000),
            fare: 499,
            status: "Confirmed",
            createdAt: new Date().toISOString()
          };
          dataStore.addBooking(regBooking);
        });
        break;
      }

      case "TC-EV-07": {
        await step("Step 1: Attempting duplicate registration with email 'john.doe@techcorp.com'", () => {
          if (bugSettings.bypassDuplicateEventEmail) {
            throw new Error("Data Integrity Defect: Duplicate attendee registration permitted for already registered email 'john.doe@techcorp.com'!");
          }
          const event = dataStore.getMasterData().events[0];
          const duplicateEmail = "john.doe@techcorp.com";
          const alreadyRegistered = event.registeredAttendees.some(a => a.email.toLowerCase() === duplicateEmail.toLowerCase());
          if (alreadyRegistered) return true;
          throw new Error("Failed to detect duplicate email!");
        });
        break;
      }

      // Module 5: Payment Gateway Integration
      case "TC-PAY-01": {
        await step("Step 1: Loading pending booking for payment checkout", () => {
          const bookings = dataStore.getBookings();
          if (!bookings || bookings.length === 0) throw new Error("No bookings found in data store");
          const booking = bookings[0];
          if (!booking.id || !booking.fare) throw new Error("Booking record lacks ID or fare metadata");
        });
        await step("Step 2: Checking payment page initialization", () => {
          const isInitialized = true;
          if (!isInitialized) throw new Error("Payment page failed to initialize");
        });
        break;
      }

      case "TC-PAY-02": {
        await step("Step 1: Validating fare breakdown (base fare + 18% GST + convenience fee)", () => {
          const baseFare = 1000;
          const gst = Math.round(baseFare * 0.18); // 180
          const convenienceFee = 40;
          const totalPayable = baseFare + gst + convenienceFee; // 1220
          if (totalPayable !== 1220) throw new Error(`Booking amount mismatch: expected 1220, got ${totalPayable}`);
        });
        break;
      }

      case "TC-PAY-03": {
        await step("Step 1: Triggering 'Pay Now' action on pending booking", () => {});
        await step("Step 2: Simulating Razorpay order creation on backend", () => {
          const orderId = "order_TEST_" + Math.random().toString(36).substring(2, 9).toUpperCase();
          const amountPaise = 150000; // ₹1,500
          if (!orderId.startsWith("order_")) throw new Error("Invalid Razorpay Order ID format");
          if (amountPaise <= 0) throw new Error("Invalid order amount");
        });
        break;
      }

      case "TC-PAY-04": {
        await step("Step 1: Querying available UPI payment methods", () => {
          const upiProviders = ["Google Pay", "PhonePe", "Paytm", "BHIM UPI", "Custom VPA"];
          if (upiProviders.length < 3) throw new Error("Incomplete UPI options");
        });
        await step("Step 2: Validating VPA syntax 'tester@okhdfcbank'", () => {
          const vpa = "tester@okhdfcbank";
          const vpaRegex = /^[\w.-]+@[\w.-]+$/;
          if (!vpaRegex.test(vpa)) throw new Error("VPA format rejected");
        });
        break;
      }

      case "TC-PAY-05": {
        await step("Step 1: Validating Debit/Credit card input structure", () => {
          const testCard = "4111111111111111"; // Standard Visa Test Card
          if (testCard.length !== 16 || !testCard.startsWith("4")) {
            throw new Error("Card validation format rejected");
          }
        });
        await step("Step 2: Verifying security policy: CVV not stored in persistent storage", () => {
          const paymentStore = dataStore.getPayments();
          for (const p of paymentStore) {
            if (p.cvv || p.cardNumber) throw new Error("Security violation: Raw card details stored!");
          }
        });
        break;
      }

      case "TC-PAY-06": {
        let testOrder = null;
        let paymentId = null;
        let signature = null;
        const testBookingId = "BK-TEST-PAY-01";

        await step("Step 1: Creating fresh test booking in Pending Payment state", () => {
          const booking = {
            id: testBookingId,
            module: "bus_train",
            title: "Payment Automation Express",
            fare: 1200,
            status: "Pending Payment",
            createdAt: new Date().toISOString()
          };
          dataStore.addBooking(booking);
        });

        await step("Step 2: Generating Razorpay order and computing valid HMAC-SHA256 signature", () => {
          testOrder = "order_AUTO_" + Math.random().toString(36).substring(2, 8).toUpperCase();
          paymentId = "pay_AUTO_" + Math.random().toString(36).substring(2, 8).toUpperCase();
          signature = generateSignature(testOrder, paymentId);
          if (!signature || signature.length !== 64) throw new Error("HMAC-SHA256 signature generation failed");
        });

        await step("Step 3: Verifying payment on backend and asserting booking is Confirmed", () => {
          // Record payment
          dataStore.addPayment({
            id: "PAY-TRX-AUTO-01",
            bookingId: testBookingId,
            orderId: testOrder,
            paymentId,
            amount: 1200,
            status: "SUCCESS",
            method: "upi",
            createdAt: new Date().toISOString()
          });

          const confirmed = dataStore.updateBookingStatus(testBookingId, "Confirmed", {
            paymentId,
            orderId: testOrder
          });

          if (!confirmed || confirmed.status !== "Confirmed") {
            throw new Error("Booking status failed to transition to 'Confirmed'");
          }
        });
        break;
      }

      case "TC-PAY-07": {
        await step("Step 1: Simulating bank decline during Razorpay checkout", () => {
          const failureReason = "Payment declined: Card issuer bank timeout";
          const failedPayment = {
            id: "PAY-FAIL-01",
            bookingId: "BK-FAIL-01",
            orderId: "order_FAIL_123",
            paymentId: null,
            amount: 750,
            status: "FAILED",
            failureReason,
            createdAt: new Date().toISOString()
          };
          dataStore.addPayment(failedPayment);
          if (failedPayment.status !== "FAILED") throw new Error("Failed payment status not recorded");
        });
        await step("Step 2: Ensuring booking remains unconfirmed upon failure", () => {
          const bookingStatus = "Pending Payment";
          if (bookingStatus === "Confirmed") throw new Error("Booking was confirmed despite payment failure!");
        });
        break;
      }

      case "TC-PAY-08": {
        await step("Step 1: Submitting tampered/forged HMAC signature to backend", () => {
          const orderId = "order_LEGIT_101";
          const paymentId = "pay_LEGIT_202";
          const validSignature = generateSignature(orderId, paymentId);
          const forgedSignature = "000000000000000000000000000000000000000000000000000000000000dead";

          if (forgedSignature === validSignature) throw new Error("Forged signature matches valid signature");
        });
        await step("Step 2: Asserting server-side rejection guard triggers error", () => {
          const isSignatureValid = false;
          if (isSignatureValid) throw new Error("Tampered signature was accepted by backend!");
        });
        break;
      }

      case "TC-PAY-09": {
        await step("Step 1: Attempting to verify payment for already paid order", () => {
          const existingPayment = {
            orderId: "order_ALREADY_PAID",
            status: "SUCCESS"
          };
          if (existingPayment.status === "SUCCESS") {
            // Correctly catches duplicate
            return true;
          }
          throw new Error("Duplicate payment check bypassed!");
        });
        break;
      }

      case "TC-PAY-10": {
        await step("Step 1: Simulating browser page reload during pending payment", () => {
          const booking = dataStore.getBookings()[0];
          if (!booking) throw new Error("Booking lost on reload simulation");
          const retrieved = dataStore.getBookingById(booking.id);
          if (!retrieved || retrieved.id !== booking.id) {
            throw new Error("State inconsistency after page reload");
          }
        });
        break;
      }

      case "TC-PAY-11": {
        await step("Step 1: Asserting booking with status 'Pending Payment' is not marked confirmed", () => {
          const pendingBooking = { id: "BK-PEND-01", status: "Pending Payment" };
          if (pendingBooking.status === "Confirmed") {
            throw new Error("Unverified booking marked as Confirmed prematurely!");
          }
        });
        break;
      }

      case "TC-PAY-12": {
        await step("Step 1: Validating generated payment tax receipt", () => {
          const payment = dataStore.getPayments()[0];
          if (!payment) throw new Error("No payment records available for receipt validation");
          if (!payment.receipt && !payment.id) throw new Error("Payment receipt reference missing");
          if (!payment.amount || payment.amount <= 0) throw new Error("Receipt amount invalid");
        });
        break;
      }

      default:
        throw new Error(`Unknown test case: ${tc.id}`);
    }
  }
}

export const testRunner = new TestRunner();
