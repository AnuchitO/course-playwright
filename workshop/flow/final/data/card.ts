export type Card = { name: string; number: string; expiry: string; cvv: string };

// Omise TEST-mode card. Never a real card.
export const TEST_CARD: Card = { name: 'Jane Doe', number: '4242 4242 4242 4242', expiry: '12/29', cvv: '123' };
