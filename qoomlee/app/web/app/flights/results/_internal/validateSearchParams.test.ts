import { describe, it, expect } from "vitest";
import { validateSearchParams } from "./validateSearchParams";

const valid = { origin: "BKK", destination: "SIN", departure: "2026-10-14", passengers: "2" };

describe("validateSearchParams", () => {
  it("accepts a well-formed search", () => {
    expect(validateSearchParams(valid)).toEqual({ ok: true });
  });

  it.each([
    ["not-a-date", "not a date"],
    ["2026-02-30", "a day that does not exist (would roll over to Mar 2)"],
    ["2026-13-01", "month 13"],
    ["14-10-2026", "wrong format"],
  ])("rejects departure %s (%s)", (departure) => {
    expect(validateSearchParams({ ...valid, departure }).ok).toBe(false);
  });

  it.each(["0", "-1", "10", "1.5", "abc", ""])("rejects passengers=%j", (passengers) => {
    expect(validateSearchParams({ ...valid, passengers }).ok).toBe(false);
  });

  it.each([["bkk"], ["BANGKOK"], ["B1K"], ["XXX1"]])("rejects airport code %s", (origin) => {
    expect(validateSearchParams({ ...valid, origin }).ok).toBe(false);
  });

  it("rejects identical origin and destination", () => {
    expect(validateSearchParams({ ...valid, destination: "BKK" }).ok).toBe(false);
  });
});
