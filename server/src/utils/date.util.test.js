import assert from "node:assert/strict";
import test from "node:test";
import { parseDurationToMs, addDuration } from "./date.util.js";

test("parseDurationToMs reads jwt-style durations", () => {
  assert.equal(parseDurationToMs("15m", 0), 15 * 60 * 1000);
  assert.equal(parseDurationToMs("7d", 0), 7 * 24 * 60 * 60 * 1000);
  assert.equal(parseDurationToMs("bogus", 42), 42);
});

test("addDuration returns a future date", () => {
  const now = Date.now();
  const later = addDuration("7d").getTime();
  assert.ok(later > now);
});
