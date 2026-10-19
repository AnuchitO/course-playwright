import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test('results list QM101', async ({ page, request }) => {
  const day = await firstDepartureDate(request); // a day that really has a flight
});
