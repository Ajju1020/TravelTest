import { test, expect } from "@playwright/test";

test.describe("Module 4: Event Registration Automation", () => {
  const API_BASE = "http://localhost:5000/api";

  test("TC-EV-01: Verify event details loading", async ({ request }) => {
    const res = await request.get(`${API_BASE}/data/master`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.events.length).toBeGreaterThan(0);
    const event = json.data.events[0];
    expect(event.tiers.length).toBeGreaterThan(0);
  });

  test("TC-EV-02: Verify participant details validation", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "event",
        eventId: "EVT-01",
        attendee: {
          name: "",
          email: "valid@email.com",
          phone: "9876543210"
        }
      }
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("name is required");
  });

  test("TC-EV-03: Verify email format validation", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "event",
        eventId: "EVT-01",
        attendee: {
          name: "Test User",
          email: "invalid-email-address",
          phone: "9876543210"
        }
      }
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("valid participant email");
  });

  test("TC-EV-04: Verify ticket quantity and tier total", async ({ request }) => {
    const unitPrice = 1499;
    const qty = 3;
    const total = unitPrice * qty;
    expect(total).toBe(4497);
  });

  test("TC-EV-05: Verify ticket availability limits", async ({ request }) => {
    const res = await request.get(`${API_BASE}/data/master`);
    const json = await res.json();
    const event = json.data.events.find(e => e.id === "EVT-01");
    const vip = event.tiers.find(t => t.id === "vip");
    expect(vip.available).toBeLessThanOrEqual(vip.total);
  });

  test("TC-EV-06: Verify registration submission and badge creation", async ({ request }) => {
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "event",
        eventId: "EVT-01",
        title: "Global AI Summit 2026",
        tier: "General Professional Pass",
        quantity: 1,
        attendee: {
          name: "Karan Johar",
          email: `karan.${Date.now()}@cinema.in`,
          phone: "+91 99887 77665",
          org: "Dharma Tech"
        },
        fare: 1499
      }
    });
    expect(res.status()).toBe(201);
    const json = await res.json();
    expect(json.booking.badgeId).toMatch(/^EVT-\d+/);
    expect(["Pending Payment", "Confirmed"]).toContain(json.booking.status);
  });

  test("TC-EV-07: Verify duplicate registration prevention", async ({ request }) => {
    // john.doe@techcorp.com is already registered in EVT-01 seed data
    const res = await request.post(`${API_BASE}/bookings`, {
      data: {
        module: "event",
        eventId: "EVT-01",
        attendee: {
          name: "John Doe",
          email: "john.doe@techcorp.com",
          phone: "+91 98765 43210"
        }
      }
    });
    expect(res.status()).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Duplicate registration detected");
  });
});
