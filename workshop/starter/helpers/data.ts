export const PASSENGER = {
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '0800000000',
  email: () => `jane.doe+${Date.now()}@test.com`, // unique per run
};

// Omise TEST-mode card. Never a real card.
export const CARD = { name: 'Jane Doe', number: '4242 4242 4242 4242', expiry: '12/29', cvv: '123' };
