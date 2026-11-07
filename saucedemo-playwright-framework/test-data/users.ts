// SauceDemo publishes these demo credentials on its own login page.
// They are not real secrets, but the password can still be overridden via an env variable.
const demoPassword = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: demoPassword },
  lockedOut: { username: 'locked_out_user', password: demoPassword },
  invalid: { username: 'invalid_user', password: 'wrong_password' },
} as const;
