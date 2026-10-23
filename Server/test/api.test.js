import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { new30Accommodations } from "../scripts/seed-30-places.js";

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function calculateBookingPrice(pricePerNight, checkInDate, checkOutDate) {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new Error("Invalid dates");
  }
  const nights = Math.max(1, Math.ceil((end - start) / 86400000));
  const subtotal = nights * pricePerNight;
  const tax = Math.round(subtotal * 0.12);
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + tax + serviceFee;
  return { nights, subtotal, tax, serviceFee, total };
}

function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

function verifyWebhookSignature(rawBody, signature, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}

describe("PlaceBooking Core Logic & Accommodation Seed Tests", () => {
  it("validates email formats correctly", () => {
    assert.equal(validEmail("user@example.com"), true);
    assert.equal(validEmail("john.doe@domain.co.in"), true);
    assert.equal(validEmail("invalid-email"), false);
    assert.equal(validEmail("user@"), false);
    assert.equal(validEmail("@domain.com"), false);
  });

  it("calculates booking nights, GST, service fee, and total accurately", () => {
    // 3 nights @ 2000 = 6000 subtotal, 720 GST, 300 Fee = 7020 total
    const calc = calculateBookingPrice(2000, "2026-11-01", "2026-11-04");
    assert.equal(calc.nights, 3);
    assert.equal(calc.subtotal, 6000);
    assert.equal(calc.tax, 720);
    assert.equal(calc.serviceFee, 300);
    assert.equal(calc.total, 7020);
  });

  it("throws error for invalid or inverted booking dates", () => {
    assert.throws(() => {
      calculateBookingPrice(1500, "2026-11-05", "2026-11-01");
    }, /Invalid dates/);
  });

  it("detects booking date conflicts correctly", () => {
    const existingStart = new Date("2026-11-10");
    const existingEnd = new Date("2026-11-15");

    assert.equal(overlaps(new Date("2026-11-10"), new Date("2026-11-15"), existingStart, existingEnd), true);
    assert.equal(overlaps(new Date("2026-11-12"), new Date("2026-11-18"), existingStart, existingEnd), true);
    assert.equal(overlaps(new Date("2026-11-08"), new Date("2026-11-12"), existingStart, existingEnd), true);
    assert.equal(overlaps(new Date("2026-11-11"), new Date("2026-11-13"), existingStart, existingEnd), true);
    assert.equal(overlaps(new Date("2026-11-05"), new Date("2026-11-20"), existingStart, existingEnd), true);
    assert.equal(overlaps(new Date("2026-11-05"), new Date("2026-11-10"), existingStart, existingEnd), false);
    assert.equal(overlaps(new Date("2026-11-15"), new Date("2026-11-20"), existingStart, existingEnd), false);
  });

  it("validates that at least 30 new distinct accommodations are defined with complete data", () => {
    assert.ok(new30Accommodations.length >= 30, "Must contain at least 30 accommodations");
    const idSet = new Set();
    for (const acc of new30Accommodations) {
      assert.ok(acc._id, "Accommodation must have a valid _id");
      assert.ok(!idSet.has(acc._id), `Duplicate ID found: ${acc._id}`);
      idSet.add(acc._id);
      assert.ok(acc.title && acc.title.length > 5, "Title must be descriptive");
      assert.ok(acc.address && acc.address.includes(","), "Address must include city/region");
      assert.ok(acc.category, "Category must be specified");
      assert.ok(Array.isArray(acc.photos) && acc.photos.length >= 3, "Must have at least 3 photos");
      assert.ok(Number(acc.price) > 0, "Price must be positive");
      assert.ok(Number(acc.maxGuests) >= 1, "Max guests must be at least 1");
      assert.ok(Number(acc.rating) >= 4.0, "Rating must be realistic");
    }
  });

  it("correctly verifies legitimate Razorpay payment signatures", () => {
    const secret = "test_razorpay_secret_12345";
    const orderId = "order_N9Z9gqB7FmPz8v";
    const paymentId = "pay_N9Za5vP7FmPz8w";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    assert.equal(verifyRazorpaySignature(orderId, paymentId, expectedSignature, secret), true);
    assert.equal(verifyRazorpaySignature(orderId, paymentId, "forged_invalid_signature", secret), false);
  });

  it("verifies webhook HMAC signatures and rejects forged requests", () => {
    const webhookSecret = "webhook_secret_xyz987";
    const rawPayload = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_123", amount: 50000 } } },
    });
    const validSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawPayload)
      .digest("hex");

    assert.equal(verifyWebhookSignature(rawPayload, validSignature, webhookSecret), true);
    assert.equal(verifyWebhookSignature(rawPayload, "tampered_signature", webhookSecret), false);
  });
});
