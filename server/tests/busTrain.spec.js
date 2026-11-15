import { test, expect } from "@playwright/test";

test.describe("Module 1: Bus and Train Reservation Automation", () => {
  const API_BASE = "http://localhost:5000/api";

  test("TC-BT-01: Verify source and destination selection and reject equality", async ({ request }) => {
    // 1. Same source and destination must be rejected
    const badRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "New Delhi",
        to: "New Delhi",
        date: "2026-12-10",
        passengers: [{ name: "Tester", age: 25 }]
      }
    });
    expect(badRes.status()).toBe(400);
    const badJson = await badRes.json();
    expect(badJson.error).toContain("Source and Destination");

    // 2. Different source and destination accepted
    const goodRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "New Delhi",
        to: "Mumbai",
        date: "2026-12-10",
        passengers: [{ name: "Tester", age: 25 }]
      }
    });
    expect(goodRes.status()).toBe(201);
  });

  test("TC-BT-02: Verify journey date validation (reject past dates)", async ({ request }) => {
    const pastRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "New Delhi",
        to: "Jaipur",
        date: "2020-01-01",
        passengers: [{ name: "Tester", age: 25 }]
      }
    });
    expect(pastRes.status()).toBe(400);
    const json = await pastRes.json();
    expect(json.error).toContain("past");
  });

  test("TC-BT-03: Verify passenger count validation", async ({ request }) => {
    const emptyPassRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "New Delhi",
        to: "Jaipur",
        date: "2026-12-10",
        passengers: []
      }
    });
    expect(emptyPassRes.status()).toBe(400);
  });

  test("TC-BT-04: Verify search functionality returns trains & buses", async ({ request }) => {
    const masterRes = await request.get(`${API_BASE}/data/master`);
    expect(masterRes.status()).toBe(200);
    const json = await masterRes.json();
    expect(json.data.trains.length).toBeGreaterThan(0);
    expect(json.data.buses.length).toBeGreaterThan(0);
  });

  test("TC-BT-05: Verify seat availability and layout toggle", async ({ request }) => {
    const masterRes = await request.get(`${API_BASE}/data/master`);
    const json = await masterRes.json();
    const train = json.data.trains[0];
    expect(train.classes[0].available).toBeGreaterThan(0);
  });

  test("TC-BT-06: Verify successful booking generates valid PNR", async ({ request }) => {
    const bookRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        type: "Train",
        title: "Vande Bharat Express",
        from: "New Delhi",
        to: "Varanasi",
        date: "2026-12-15",
        passengers: [{ name: "Suresh Raina", age: 34, gender: "Male" }],
        fare: 1750
      }
    });
    expect(bookRes.status()).toBe(201);
    const json = await bookRes.json();
    expect(json.booking.pnr).toMatch(/^PNR-\d+/);
    expect(["Pending Payment", "Confirmed"]).toContain(json.booking.status);
  });

  test("TC-BT-07: Verify invalid booking rejection on blank passenger name", async ({ request }) => {
    const badRes = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "bus_train",
        from: "New Delhi",
        to: "Varanasi",
        date: "2026-12-15",
        passengers: [{ name: "   ", age: 30 }]
      }
    });
    expect(badRes.status()).toBe(400);
    const json = await badRes.json();
    expect(json.error).toContain("name is required");
  });
});
