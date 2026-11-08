/**
 * NEXORA payment policy.
 *
 * This is a policy/configuration boundary, not a live payment integration.
 * Keep all methods disabled until the owner has obtained external approvals,
 * provider credentials are configured securely, and end-to-end tests pass.
 * Card payments must never be enabled.
 */
export const paymentPolicy = {
  livePaymentsEnabled: false,
  cardPaymentsEnabled: false,
  permittedMethods: ["bKash", "Nagad", "Rocket", "Bank Transfer"] as const,
  prohibitedMethods: [
    "Credit Card",
    "Debit Card",
    "Visa",
    "Mastercard",
    "American Express",
  ] as const,
} as const;
