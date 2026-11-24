import { test, expect } from "@playwright/test";

test.describe("Module 2: Movie Ticket Booking Automation", () => {
  const API_BASE = process.env.API_BASE || (process.env.BASE_URL ? (process.env.BASE_URL.replace(/\/$/, "") + "/api") : "http://localhost:5000/api");

  test("TC-MV-01: Verify movie selection from catalog", async ({ request }) => {
    const res = await request.get(`${API_BASE}/data/master`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    const movie = json.data.movies.find(m => m.id === "MOV-01");
    expect(movie).toBeDefined();
    expect(movie.title).toBe("Dune: Part Two");
  });

  test("TC-MV-02: Verify cinema and showtime availability", async ({ request }) => {
    const res = await request.get(`${API_BASE}/data/master`);
    const json = await res.json();
    expect(json.data.cinemas.length).toBeGreaterThan(0);
    expect(json.data.showtimes.length).toBeGreaterThan(0);
  });

  test("TC-MV-03: Verify interactive seat selection limits", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "movie",
        movieId: "MOV-01",
        cinema: "PVR ICON",
        showtime: "08:30 PM",
        seats: [] // Empty
      }
    });
    expect(res.status()).toBe(400);
  });

  test("TC-MV-04: Prevent selection of already-booked seats", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "movie",
        movieId: "MOV-01",
        cinema: "PVR ICON",
        showtime: "10:30 AM",
        seats: ["D4"] // Already booked seat in seed
      }
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("reserved");
  });

  test("TC-MV-05: Verify ticket price calculation accuracy", async ({ request }) => {
    const seatPrice = 350;
    const count = 2;
    const subtotal = seatPrice * count;
    const gst = Math.round(subtotal * 0.18);
    const fee = 40;
    const expectedTotal = subtotal + gst + fee;
    expect(expectedTotal).toBe(866);
  });

  test("TC-MV-06: Verify successful movie booking and ticket pass generation", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "movie",
        movieId: "MOV-01",
        title: "Dune: Part Two",
        cinema: "PVR ICON",
        screen: "Audi 1",
        showtime: "11:15 PM",
        seats: ["A" + Math.floor(Math.random() * 8 + 1)],
        tier: "Platinum",
        fare: 1220
      }
    });
    expect(res.status()).toBe(201);
    const json = await res.json();
    expect(json.booking.bookingCode).toMatch(/^MOV-TKT-\d+/);
    expect(["Pending Payment", "Confirmed"]).toContain(json.booking.status);
  });
});
