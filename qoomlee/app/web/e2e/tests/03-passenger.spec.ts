import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test.beforeEach(async ({ page, request }) => {
  const day = await firstDepartureDate(request);
});
