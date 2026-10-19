import { describe, it, expect, vi, afterEach } from "vitest";
import { logger } from "./logger";

const ISO_TS = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("logger", () => {
  it("info logs a timestamped, leveled message via console.log", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    logger.info("hello");

    expect(spy).toHaveBeenCalledTimes(1);
    const [line] = spy.mock.calls[0]!;
    expect(line).toMatch(ISO_TS);
    expect(line).toMatch(/INFO\s+hello$/);
  });

  it("warn logs the message and meta via console.warn", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    logger.warn("careful", { code: "X" });

    expect(spy).toHaveBeenCalledTimes(1);
    const [line, meta] = spy.mock.calls[0]!;
    expect(line).toMatch(/WARN\s+careful$/);
    expect(meta).toEqual({ code: "X" });
  });

  it("error logs the message and meta via console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.error("boom", { reason: "network" });

    expect(spy).toHaveBeenCalledTimes(1);
    const [line, meta] = spy.mock.calls[0]!;
    expect(line).toMatch(/ERROR\s+boom$/);
    expect(meta).toEqual({ reason: "network" });
  });

  it("error logs only the message when no meta is given", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.error("boom");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]).toHaveLength(1);
  });

  it("debug logs via console.debug", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});

    logger.debug("tracing");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]![0]).toMatch(/DEBUG\s+tracing$/);
  });

  it("serializes an Error in meta into name/message/stack instead of '[object Error]'", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const cause = new Error("underlying cause");
    const error = new Error("network error", { cause });

    logger.error("httpClient: GET /api - network error", { url: "/api", error });

    const [, meta] = spy.mock.calls[0] as [string, { url: string; error: Record<string, unknown> }];
    expect(meta.url).toBe("/api");
    expect(meta.error).toMatchObject({
      name: "Error",
      message: "network error",
    });
    expect(meta.error.stack).toEqual(expect.any(String));
    expect(meta.error.cause).toMatchObject({ name: "Error", message: "underlying cause" });
  });

  it("serializes Errors nested inside arrays", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const errors = [new Error("first"), new Error("second")];

    logger.error("multiple failures", { errors });

    const [, meta] = spy.mock.calls[0] as [string, { errors: Record<string, unknown>[] }];
    expect(meta.errors).toHaveLength(2);
    expect(meta.errors[0]).toMatchObject({ name: "Error", message: "first" });
    expect(meta.errors[1]).toMatchObject({ name: "Error", message: "second" });
  });
});
