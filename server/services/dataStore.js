import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initialData } from "../data/initialData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, "../data/store.json");

function getDefaultState() {
  return {
    bookings: [
      {
        id: "BK-BT-90412",
        module: "bus_train",
        type: "Train",
        title: "Vande Bharat Express (TR-22436)",
        from: "New Delhi",
        to: "Varanasi",
        date: "2026-12-05",
        passengers: [
          { name: "Aarav Sharma", age: 29, gender: "Male", seat: "C4-24 (Window)" }
        ],
        fare: 1750,
        status: "Confirmed",
        pnr: "PNR-8849201",
        createdAt: new Date().toISOString()
      },
      {
        id: "BK-MV-33012",
        module: "movie",
        title: "Dune: Part Two",
        cinema: "PVR ICON: Gold Class & IMAX, Promenade",
        screen: "Audi 1 (IMAX)",
        showtime: "08:30 PM",
        date: "2026-11-20",
        seats: ["F4", "F5"],
        tier: "Gold",
        fare: 826,
        status: "Confirmed",
        bookingCode: "MOV-TKT-5519",
        createdAt: new Date().toISOString()
      },
      {
        id: "BK-CB-77104",
        module: "cab",
        title: "Prime Sedan - Airport Ride",
        pickup: "Indira Gandhi Airport (DEL)",
        drop: "Cyber Hub, Gurugram",
        dateTime: "2026-11-18 10:00",
        category: "sedan",
        driver: {
          name: "Rajesh Sharma",
          vehicle: "White Honda Amaze",
          plate: "DL 03 CD 8821",
          phone: "+91 98111 22334"
        },
        otp: "4829",
        fare: 395,
        status: "Confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "BK-EV-55219",
        module: "event",
        title: "Global AI & Cloud Innovation Summit 2026",
        eventId: "EVT-01",
        venue: "Bharat Mandapam Convention Centre",
        date: "Dec 12-14, 2026",
        tier: "General Professional Pass",
        quantity: 1,
        attendee: {
          name: "Dr. K. Raman",
          email: "k.raman@quantum.in",
          phone: "+91 98765 00112"
        },
        badgeId: "AI-SUMMIT-2026-881",
        fare: 1499,
        status: "Confirmed",
        createdAt: new Date().toISOString()
      }
    ],

    // Payment and transaction records
    payments: [
      {
        id: "PAY-TRX-1001",
        bookingId: "BK-BT-90412",
        orderId: "order_mock_bt_90412",
        paymentId: "pay_mock_rzp_9901",
        amount: 1750,
        currency: "INR",
        method: "upi",
        upiProvider: "Google Pay",
        status: "SUCCESS",
        customerId: "usr_qa_lead",
        customerName: "Aarav Sharma",
        customerEmail: "aarav.sharma@gmail.com",
        receipt: "RCP-8849201",
        failureReason: null,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "PAY-TRX-1002",
        bookingId: "BK-MV-33012",
        orderId: "order_mock_mv_33012",
        paymentId: "pay_mock_rzp_9902",
        amount: 826,
        currency: "INR",
        method: "card",
        cardNetwork: "Visa",
        cardLast4: "4111",
        status: "SUCCESS",
        customerId: "usr_qa_lead",
        customerName: "Alex Mercer",
        customerEmail: "alex.mercer@traveltest.com",
        receipt: "RCP-330129",
        failureReason: null,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "PAY-TRX-1003",
        bookingId: "BK-CB-77104",
        orderId: "order_mock_cb_77104",
        paymentId: "pay_mock_rzp_9903",
        amount: 395,
        currency: "INR",
        method: "netbanking",
        bankName: "HDFC Bank",
        status: "SUCCESS",
        customerId: "usr_qa_lead",
        customerName: "Alex Mercer",
        customerEmail: "alex.mercer@traveltest.com",
        receipt: "RCP-771041",
        failureReason: null,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],

    movieBookedSeats: {
      "MOV-01_10:30 AM": ["D4", "D5", "E8", "F2", "H3", "H4"],
      "MOV-01_08:30 PM": ["F4", "F5", "D6", "D7", "G1", "G2"],
      "MOV-02_05:00 PM": ["A1", "A2", "B5", "E1", "E2"]
    },

    bugSettings: {
      allowSameSourceDest: false,
      movieSeatDoubleBooking: false,
      cabFareMultiplierGlitch: false,
      bypassDuplicateEventEmail: false
    },

    executionConfig: {
      speedDelayMs: 250,
      browserMode: "headless"
    },

    testHistory: []
  };
}

class DataStore {
  constructor() {
    this.state = this.load();
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        if (!parsed.payments) parsed.payments = getDefaultState().payments;
        return parsed;
      }
    } catch (e) {
      console.warn("Could not load existing store, creating default state:", e.message);
    }
    const def = getDefaultState();
    this.save(def);
    return def;
  }

  save(data = this.state) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error saving store:", e);
    }
  }

  reset() {
    this.state = getDefaultState();
    this.save();
    return this.state;
  }

  getMasterData() {
    return initialData;
  }

  getBookings() {
    return this.state.bookings || [];
  }

  getBookingById(id) {
    return (this.state.bookings || []).find(b => b.id === id);
  }

  addBooking(booking) {
    this.state.bookings.unshift(booking);
    if (booking.module === "movie" && booking.seats && booking.showtime && booking.movieId) {
      const key = `${booking.movieId}_${booking.showtime}`;
      if (!this.state.movieBookedSeats[key]) {
        this.state.movieBookedSeats[key] = [];
      }
      this.state.movieBookedSeats[key].push(...booking.seats);
    }
    this.save();
    return booking;
  }

  updateBookingStatus(id, status, extra = {}) {
    const booking = this.getBookingById(id);
    if (booking) {
      booking.status = status;
      Object.assign(booking, extra);
      this.save();
      return booking;
    }
    return null;
  }

  cancelBooking(id) {
    return this.updateBookingStatus(id, "Cancelled");
  }

  getMovieBookedSeats(movieId, showtime) {
    const key = `${movieId}_${showtime}`;
    return this.state.movieBookedSeats[key] || ["D4", "D5", "E8"];
  }

  // Payments Collection Methods
  getPayments() {
    return this.state.payments || [];
  }

  getPaymentById(paymentId) {
    return (this.state.payments || []).find(p => p.id === paymentId || p.paymentId === paymentId);
  }

  getPaymentByOrderId(orderId) {
    return (this.state.payments || []).find(p => p.orderId === orderId);
  }

  getPaymentByBookingId(bookingId) {
    return (this.state.payments || []).find(p => p.bookingId === bookingId);
  }

  addPayment(payment) {
    if (!this.state.payments) this.state.payments = [];
    this.state.payments.unshift(payment);
    this.save();
    return payment;
  }

  updatePayment(idOrOrderId, updates) {
    const p = (this.state.payments || []).find(
      item => item.id === idOrOrderId || item.orderId === idOrOrderId || item.paymentId === idOrOrderId
    );
    if (p) {
      Object.assign(p, updates);
      this.save();
      return p;
    }
    return null;
  }

  getBugSettings() {
    return this.state.bugSettings;
  }

  updateBugSettings(newSettings) {
    this.state.bugSettings = { ...this.state.bugSettings, ...newSettings };
    this.save();
    return this.state.bugSettings;
  }

  getExecutionConfig() {
    return this.state.executionConfig;
  }

  updateExecutionConfig(newConfig) {
    this.state.executionConfig = { ...this.state.executionConfig, ...newConfig };
    this.save();
    return this.state.executionConfig;
  }

  getTestHistory() {
    return this.state.testHistory || [];
  }

  addTestRunRecord(record) {
    if (!this.state.testHistory) this.state.testHistory = [];
    this.state.testHistory.unshift(record);
    if (this.state.testHistory.length > 50) {
      this.state.testHistory = this.state.testHistory.slice(0, 50);
    }
    this.save();
    return record;
  }
}

export const dataStore = new DataStore();
