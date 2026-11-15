import React, { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [masterData, setMasterData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [activePaymentBooking, setActivePaymentBooking] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchMasterData = async () => {
    try {
      const res = await fetch("/api/data/master");
      const json = await res.json();
      if (json.success) {
        setMasterData(json.data);
      }
    } catch (err) {
      console.error("Failed to load master data:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.success) {
        setBookings(json.bookings);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchBookings();
  }, []);

  const createBooking = async (bookingPayload) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create booking");
      }
      setBookings(prev => [json.booking, ...prev]);
      setActivePaymentBooking(json.booking);
      return { success: true, booking: json.booking };
    } catch (err) {
      showToast(err.message, "error");
      return { success: false, error: err.message };
    }
  };

  const cancelBooking = async (id) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to cancel booking");
      }
      setBookings(prev => prev.map(b => (b.id === id ? json.booking : b)));
      showToast("Booking has been cancelled.", "info");
      return { success: true };
    } catch (err) {
      showToast(err.message, "error");
      return { success: false, error: err.message };
    }
  };

  return (
    <BookingContext.Provider
      value={{
        masterData,
        bookings,
        loading,
        activeTicket,
        setActiveTicket,
        activePaymentBooking,
        setActivePaymentBooking,
        paymentResult,
        setPaymentResult,
        toast,
        showToast,
        createBooking,
        cancelBooking,
        refreshBookings: fetchBookings
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
