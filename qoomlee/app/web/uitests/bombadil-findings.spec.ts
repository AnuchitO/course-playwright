import { test, expect } from "@playwright/test";

/**
 * Regression tests for the three defects Bombadil found (see bombadil/README.md).
 * Static pages only — no backend or route mocks needed.
 */

test.describe("Edit profile form accessibility", () => {
  test("Every field is reachable by its visible label", async ({ page }) => {
    await test.step("Given the passenger opens Edit Profile", async () => {
      await page.goto("/profile/edit/");
    });

    await test.step("Then each label resolves to its input", async () => {
      for (const label of ["Full Name", "Email", "Phone", "Passport Number", "Passport Expiry"]) {
        await expect(page.getByLabel(label, { exact: true })).toBeVisible();
      }
      await expect(page.getByRole("combobox", { name: "Nationality" })).toBeVisible();
    });
  });
});

test.describe("Check-in passenger selection accessibility", () => {
  test("Every passenger checkbox is named after the passenger", async ({ page }) => {
    await test.step("Given the passenger opens the check-in passenger list", async () => {
      await page.goto("/checkin/detail/passengers/?ref=QL123");
    });

    await test.step("Then each passenger has a named checkbox", async () => {
      await expect(page.getByRole("checkbox", { name: "Jonathan Doe" })).toBeVisible();
      await expect(page.getByRole("checkbox", { name: "Sarah Doe" })).toBeVisible();
      await expect(page.getByRole("checkbox", { name: /select all/i })).toBeVisible();
    });
  });
});

test.describe("Account settings accessibility", () => {
  test("Every toggle switch has an accessible name", async ({ page }) => {
    await test.step("Given the passenger opens Account Settings", async () => {
      await page.goto("/profile/settings/");
    });

    await test.step("Then no switch is nameless and the named ones are findable", async () => {
      await expect(page.getByRole("switch").first()).toBeVisible();
      const unnamed = await page
        .getByRole("switch")
        .evaluateAll(
          (els) => els.filter((e) => !(e.getAttribute("aria-label") || "").trim()).length,
        );
      expect(unnamed).toBe(0);
      await expect(page.getByRole("switch", { name: "Data saving mode" })).toBeVisible();
    });
  });
});

test.describe("Document titles", () => {
  const routes = [
    "/profile/edit/",
    "/profile/settings/",
    "/profile/payment/",
    "/support/",
    "/checkin/",
    "/checkin/detail/",
    "/checkin/detail/passengers/",
    "/checkin/detail/seats/",
    "/checkin/detail/review/",
    "/passes/detail/",
    "/flights/status/",
    "/auth/login/",
    "/auth/register/",
    "/auth/forgot-password/",
    "/auth/verify-email/",
    "/bookings/detail/change-flight/",
    "/bookings/detail/health-docs/",
    "/bookings/detail/insurance/",
    "/bookings/detail/refund/",
    "/bookings/detail/checklist/",
  ];

  for (const route of routes) {
    test(`${route} has its own title`, async ({ page }) => {
      await page.goto(route);
      await expect(page).not.toHaveTitle(/Flight Search/i);
      await expect(page).toHaveTitle(/· Qoomlee$/);
    });
  }
});

test.describe("Results page with a malformed search link", () => {
  const bad: Array<[string, string]> = [
    ["departure=not-a-date&passengers=1", "unparseable date"],
    ["departure=2026-02-30&passengers=1", "nonexistent day"],
    ["departure=2026-10-14&passengers=0", "zero passengers"],
    ["departure=2026-10-14&passengers=-1", "negative passengers"],
  ];

  for (const [query, why] of bad) {
    test(`Shows an invalid-link message, not garbage, for ${why}`, async ({ page }) => {
      const apiCalls: string[] = [];
      await page.route("**/api/flights/search**", (route) => {
        apiCalls.push(route.request().url());
        return route.fulfill({ json: { flights: [] } });
      });

      await test.step(`Given a link with ${why}`, async () => {
        await page.goto(`/flights/results/?origin=BKK&destination=SIN&${query}&cabin=economy`);
      });

      await test.step("Then the passenger is told the link is invalid", async () => {
        await expect(
          page.getByRole("alert").filter({ hasText: "search link isn't valid" }),
        ).toBeVisible();
        await expect(page.getByRole("link", { name: "Start a new search" })).toBeVisible();
      });

      await test.step("And no nonsense is rendered and the API is never called", async () => {
        await expect(page.locator("body")).not.toContainText(/Invalid Date|NaN|-1 Adults|0 Adults/);
        expect(apiCalls).toEqual([]);
      });
    });
  }

  test("A valid link still searches and shows its summary", async ({ page }) => {
    const apiCalls: string[] = [];
    await page.route("**/api/flights/search**", (route) => {
      apiCalls.push(route.request().url());
      return route.fulfill({ json: { flights: [] } });
    });
    await page.goto(
      "/flights/results/?origin=BKK&destination=SIN&departure=2026-10-14&passengers=2&cabin=economy",
    );
    await expect(page.getByText("BKK → SIN · Wed Oct 14 · 2 Adults · Economy")).toBeVisible();
    expect(apiCalls).toHaveLength(1);
  });
});
