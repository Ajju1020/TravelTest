import express from "express";
import { dataStore } from "../services/dataStore.js";

const router = express.Router();

// GET all bookings
router.get("/", (req, res) => {
  const { module } = req.query;
  let bookings = dataStore.getBookings();
  if (module && module !== "all") {
    bookings = bookings.filter(b => b.module === module);
  }
  res.json({ success: true, count: bookings.length, bookings });
});

// GET single booking by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const booking = dataStore.getBookingById(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }
  res.json({ success: true, booking });
});

// POST create booking (creates booking in "Pending Payment" state awaiting Razorpay checkout)
router.post("/", (req, res) => {
  const bookingData = req.body;
  const bugSettings = dataStore.getBugSettings();

  if (!bookingData.module) {
    return res.status(400).json({ success: false, error: "Module type is required" });
  }

  // By default, bookings require payment verification before confirmation
  const initialStatus = bookingData.status || "Pending Payment";

  // Module 1: Bus & Train Validation
  if (bookingData.module === "bus_train") {
    const { from, to, date, passengers } = bookingData;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: "Source and destination cities are required" });
    }
    if (from === to && !bugSettings.allowSameSourceDest) {
      return res.status(400).json({
        success: false,
        error: "Source and Destination cities cannot be the same. Please choose different locations."
      });
    }
    if (!date) {
      return res.status(400).json({ success: false, error: "Journey date is required" });
    }
    const journeyDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (journeyDate < today) {
      return res.status(400).json({ success: false, error: "Journey date cannot be in the past." });
    }
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ success: false, error: "At least one passenger is required." });
    }
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].name.trim()) {
        return res.status(400).json({ success: false, error: `Passenger #${i + 1} name is required.` });
      }
      if (!passengers[i].age || Number(passengers[i].age) < 1) {
        return res.status(400).json({ success: false, error: `Passenger #${i + 1} must have a valid age.` });
      }
    }

    const newBooking = {
      id: "BK-BT-" + Math.floor(10000 + Math.random() * 90000),
      module: "bus_train",
      type: bookingData.type || "Train",
      title: bookingData.title || `${bookingData.type || "Train"} from ${from} to ${to}`,
      from,
      to,
      date,
      passengers,
      fare: bookingData.fare || 1500,
      status: initialStatus,
      pnr: "PNR-" + Math.floor(1000000 + Math.random() * 9000000),
      createdAt: new Date().toISOString()
    };

    dataStore.addBooking(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  }

  // Module 2: Movie Booking Validation
  if (bookingData.module === "movie") {
    const { movieId, cinema, showtime, date, seats, tier, fare } = bookingData;
    if (!movieId || !cinema || !showtime) {
      return res.status(400).json({ success: false, error: "Movie, cinema, and showtime are required" });
    }
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, error: "Please select at least one seat" });
    }

    // Check if any seat is already booked
    const booked = dataStore.getMovieBookedSeats(movieId, showtime);
    const conflicts = seats.filter(s => booked.includes(s));
    if (conflicts.length > 0 && !bugSettings.movieSeatDoubleBooking) {
      return res.status(400).json({
        success: false,
        error: `Seats [${conflicts.join(", ")}] are already reserved by another customer. Please choose different seats.`
      });
    }

    const newBooking = {
      id: "BK-MV-" + Math.floor(10000 + Math.random() * 90000),
      module: "movie",
      movieId,
      title: bookingData.title || "Movie Booking",
      cinema,
      screen: bookingData.screen || "Audi 1 (IMAX)",
      showtime,
      date: date || new Date().toISOString().split("T")[0],
      seats,
      tier: tier || "Gold",
      fare: fare || 600,
      status: initialStatus,
      bookingCode: "MOV-TKT-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString()
    };

    dataStore.addBooking(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  }

  // Module 3: Cab Booking Validation
  if (bookingData.module === "cab") {
    const { pickup, drop, category } = bookingData;
    if (!pickup || !drop) {
      return res.status(400).json({ success: false, error: "Pickup and Drop locations are required" });
    }
    if (pickup.trim().toLowerCase() === drop.trim().toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: "Pickup and drop locations must be different."
      });
    }
    if (!category) {
      return res.status(400).json({ success: false, error: "Please choose a cab category." });
    }

    const driver = bookingData.driver || dataStore.getMasterData().cabs.drivers[0];
    const newBooking = {
      id: "BK-CB-" + Math.floor(10000 + Math.random() * 90000),
      module: "cab",
      title: `${category.toUpperCase()} Ride - ${pickup} to ${drop}`,
      pickup,
      drop,
      dateTime: bookingData.dateTime || new Date().toISOString().replace("T", " ").substring(0, 16),
      category,
      driver: {
        name: driver.name,
        vehicle: driver.vehicle,
        plate: driver.plate,
        phone: driver.phone
      },
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      fare: bookingData.fare || 350,
      status: initialStatus,
      createdAt: new Date().toISOString()
    };

    dataStore.addBooking(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  }

  // Module 4: Event Registration Validation
  if (bookingData.module === "event") {
    const { eventId, attendee, tier, quantity } = bookingData;
    if (!eventId || !attendee) {
      return res.status(400).json({ success: false, error: "Event and attendee details are required." });
    }
    if (!attendee.name || !attendee.name.trim()) {
      return res.status(400).json({ success: false, error: "Participant name is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!attendee.email || !emailRegex.test(attendee.email)) {
      return res.status(400).json({ success: false, error: "Please enter a valid participant email address." });
    }
    if (!attendee.phone || attendee.phone.length < 8) {
      return res.status(400).json({ success: false, error: "Please provide a valid contact number." });
    }

    // Duplicate email check
    const masterEvent = dataStore.getMasterData().events.find(e => e.id === eventId);
    if (masterEvent && !bugSettings.bypassDuplicateEventEmail) {
      const alreadyReg = masterEvent.registeredAttendees.some(
        a => a.email.toLowerCase() === attendee.email.toLowerCase()
      );
      if (alreadyReg) {
        return res.status(400).json({
          success: false,
          error: `Duplicate registration detected: The email '${attendee.email}' is already registered for this event.`
        });
      }
    }

    const newBooking = {
      id: "BK-EV-" + Math.floor(10000 + Math.random() * 90000),
      module: "event",
      title: bookingData.title || (masterEvent ? masterEvent.title : "Event Pass"),
      eventId,
      venue: bookingData.venue || (masterEvent ? masterEvent.venue : "Main Convention Centre"),
      date: bookingData.date || (masterEvent ? masterEvent.date : "Upcoming"),
      tier: tier || "General Pass",
      quantity: quantity || 1,
      attendee: {
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone,
        org: attendee.org || "Independent"
      },
      badgeId: "EVT-" + Math.floor(100000 + Math.random() * 900000),
      fare: bookingData.fare || 1499,
      status: initialStatus,
      createdAt: new Date().toISOString()
    };

    dataStore.addBooking(newBooking);
    return res.status(201).json({ success: true, booking: newBooking });
  }

  return res.status(400).json({ success: false, error: "Unknown module type" });
});

// Cancel a booking
router.post("/:id/cancel", (req, res) => {
  const { id } = req.params;
  const updated = dataStore.cancelBooking(id);
  if (!updated) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }
  res.json({ success: true, booking: updated });
});

export default router;
