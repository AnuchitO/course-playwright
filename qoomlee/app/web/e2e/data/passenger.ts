export type Passenger = { firstName: string; lastName: string; email: string; phone: string };

// unique email per call so runs never collide
export const aPassenger = (over: Partial<Passenger> = {}): Passenger => ({
  firstName: 'Jane',
  lastName: 'Doe',
  email: `jane+${Date.now()}@test.com`,
  phone: '0800000000',
  ...over,
});
