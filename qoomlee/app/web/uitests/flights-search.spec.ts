import { test, expect } from "./fixtures";
import { airportName, DEFAULT_SEARCH } from "./helpers/test-data";

test.describe("Flight search form", () => {
  test.beforeEach(async ({ flightSearchPage }) => {
    await flightSearchPage.goto();
  });

  test("Swapping origin and destination reverses the selection (desktop)", async ({
    flightSearchPage,
  }) => {
    test.skip(flightSearchPage.isMobile, "desktop only");

    await test.step("Given origin and destination are selected", async () => {
      await flightSearchPage.selectOrigin(airportName(DEFAULT_SEARCH.origin));
      await flightSearchPage.selectDestination(airportName(DEFAULT_SEARCH.destination));
    });

    await test.step("When the passenger swaps origin and destination", async () => {
      await flightSearchPage.swapOriginAndDestination();
    });

    await test.step("Then origin and destination are reversed", async () => {
      await expect(flightSearchPage.selectedAirport("SIN")).toBeVisible();
      await expect(flightSearchPage.selectedAirport("BKK")).toBeVisible();
    });
  });

  test("Tapping From opens the origin bottom sheet with popular cities (mobile)", async ({
    flightSearchPage,
  }) => {
    test.skip(!flightSearchPage.isMobile, "mobile only");

    await test.step("When the passenger taps From", async () => {
      await flightSearchPage.openMobileBottomSheet();
    });

    await test.step("Then the origin bottom sheet opens with popular cities", async () => {
      await expect(flightSearchPage.bottomSheetTitle).toBeVisible();
      await expect(flightSearchPage.popularCitiesHeading).toBeVisible();
    });
  });

  test("Picking an airport from the bottom sheet selects it and closes the sheet (mobile)", async ({
    flightSearchPage,
  }) => {
    test.skip(!flightSearchPage.isMobile, "mobile only");

    await test.step("When the passenger selects an airport from the bottom sheet", async () => {
      await flightSearchPage.selectOriginMobile(airportName(DEFAULT_SEARCH.origin));
    });

    await test.step("Then the airport is selected and the sheet closes", async () => {
      await expect(flightSearchPage.selectedAirport("BKK")).toBeVisible();
      await expect(flightSearchPage.bottomSheetTitle).not.toBeVisible();
    });
  });

  test("Tapping the backdrop closes the open bottom sheet (mobile)", async ({
    flightSearchPage,
  }) => {
    test.skip(!flightSearchPage.isMobile, "mobile only");

    await test.step("Given the origin bottom sheet is open", async () => {
      await flightSearchPage.openMobileBottomSheet();
    });

    await test.step("When the passenger taps the backdrop", async () => {
      await flightSearchPage.dismissMobileBottomSheet();
    });

    await test.step("Then the bottom sheet closes", async () => {
      await expect(flightSearchPage.bottomSheetTitle).not.toBeVisible({ timeout: 10000 });
    });
  });

  test("A valid one-way search lands on the results page for that route (desktop)", async ({
    page,
    flightSearchPage,
  }) => {
    test.skip(flightSearchPage.isMobile, "desktop only");

    await test.step("Given origin, destination, and departure date are filled in", async () => {
      await flightSearchPage.selectOrigin(airportName(DEFAULT_SEARCH.origin));
      await flightSearchPage.selectDestination(airportName(DEFAULT_SEARCH.destination));
      await flightSearchPage.selectFirstAvailableDate();
    });

    await test.step("When the passenger searches", async () => {
      await flightSearchPage.search();
    });

    await test.step(`Then they land on the results page for ${DEFAULT_SEARCH.origin} → ${DEFAULT_SEARCH.destination}`, async () => {
      await expect(page).toHaveURL(/\/flights\/results/, { timeout: 10000 });
      await expect(page).toHaveURL(new RegExp(`origin=${DEFAULT_SEARCH.origin}`));
      await expect(page).toHaveURL(new RegExp(`destination=${DEFAULT_SEARCH.destination}`));
    });
  });
});
