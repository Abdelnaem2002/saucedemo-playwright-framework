// Expected UI texts, kept in one place so a wording change is fixed once.
export const loginErrors = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  unauthorizedAccess: (path: string) =>
    `Epic sadface: You can only access '${path}' when you are logged in.`,
} as const;

export const checkoutErrors = {
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;

export const ORDER_COMPLETE_MESSAGE = 'Thank you for your order!';
