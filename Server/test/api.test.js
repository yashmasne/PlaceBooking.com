import { describe, it } from "node:test";
import assert from "node:assert/strict";

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function calculateTotalPrice(pricePerNight, checkInDate, checkOutDate) {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new Error("Invalid dates");
  }
  const nights = Math.max(1, Math.ceil((end - start) / 86400000));
  return nights * pricePerNight;
}

describe("PlaceBooking Backend Core Logic Tests", () => {
  it("validates email formats correctly", () => {
    assert.equal(validEmail("user@example.com"), true);
    assert.equal(validEmail("john.doe@domain.co.in"), true);
    assert.equal(validEmail("invalid-email"), false);
    assert.equal(validEmail("user@"), false);
    assert.equal(validEmail("@domain.com"), false);
  });

  it("calculates booking nights and price accurately", () => {
    const total = calculateTotalPrice(1500, "2026-11-01", "2026-11-04");
    assert.equal(total, 4500); // 3 nights * 1500
  });

  it("throws error for invalid booking dates", () => {
    assert.throws(() => {
      calculateTotalPrice(1500, "2026-11-05", "2026-11-01");
    }, /Invalid dates/);
  });

  it("detects booking date conflicts correctly", () => {
    const existingStart = new Date("2026-11-10");
    const existingEnd = new Date("2026-11-15");

    // Exact overlap
    assert.equal(overlaps(new Date("2026-11-10"), new Date("2026-11-15"), existingStart, existingEnd), true);
    // Partial overlap (starts during existing)
    assert.equal(overlaps(new Date("2026-11-12"), new Date("2026-11-18"), existingStart, existingEnd), true);
    // Partial overlap (ends during existing)
    assert.equal(overlaps(new Date("2026-11-08"), new Date("2026-11-12"), existingStart, existingEnd), true);
    // Completely inside existing
    assert.equal(overlaps(new Date("2026-11-11"), new Date("2026-11-13"), existingStart, existingEnd), true);
    // Completely encompasses existing
    assert.equal(overlaps(new Date("2026-11-05"), new Date("2026-11-20"), existingStart, existingEnd), true);
    // Adjacent before (checkout == checkin, no conflict)
    assert.equal(overlaps(new Date("2026-11-05"), new Date("2026-11-10"), existingStart, existingEnd), false);
    // Adjacent after (checkin == checkout, no conflict)
    assert.equal(overlaps(new Date("2026-11-15"), new Date("2026-11-20"), existingStart, existingEnd), false);
  });
});
