import { test, expect } from "@playwright/test";

test.describe("Module 3: Cab Booking Automation", () => {
  const API_BASE = "http://localhost:5000/api";

  test("TC-CB-01: Verify pickup and drop location inputs", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "cab",
        pickup: "",
        drop: "Cyber Hub"
      }
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("required");
  });

  test("TC-CB-02: Verify pickup and drop locations are different", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "cab",
        pickup: "Aerocity, New Delhi",
        drop: "Aerocity, New Delhi",
        category: "sedan"
      }
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("different");
  });

  test("TC-CB-03: Verify scheduling date/time requirements", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "cab",
        pickup: "Connaught Place",
        drop: "Noida Sector 62",
        category: "mini",
        dateTime: "2026-11-20 14:00"
      }
    });
    expect(res.status()).toBe(201);
  });

  test("TC-CB-04: Verify cab category selection and capacity metadata", async ({ request }) => {
    const res = await request.get(`${API_BASE}/data/master`);
    const json = await res.json();
    const categories = json.data.cabs.categories;
    const mini = categories.find(c => c.id === "mini");
    const suv = categories.find(c => c.id === "suv");
    expect(mini.capacity).toBe(4);
    expect(suv.capacity).toBe(6);
  });

  test("TC-CB-05: Verify fare calculation formula", async ({ request }) => {
    const res = await request.get(`${API_BASE}/data/master`);
    const json = await res.json();
    const sedan = json.data.cabs.categories.find(c => c.id === "sedan");
    const distanceKm = 15;
    const calculated = sedan.baseFare + (distanceKm * sedan.perKm); // 90 + 255 = 345
    expect(calculated).toBe(345);
  });

  test("TC-CB-06: Verify successful cab booking with driver details & OTP", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "cab",
        pickup: "Indira Gandhi Airport (DEL)",
        drop: "DLF Cyber City, Gurugram",
        category: "suv",
        fare: 540
      }
    });
    expect(res.status()).toBe(201);
    const json = await res.json();
    expect(json.booking.driver).toBeDefined();
    expect(json.booking.otp).toMatch(/^\d{4}$/);
    expect(["Pending Payment", "Confirmed"]).toContain(json.booking.status);
  });
});
