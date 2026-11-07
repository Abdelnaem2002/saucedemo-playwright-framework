import { expect, test } from '../../fixtures/test-fixtures';
import { loginErrors } from '../../test-data/messages';
import { TOTAL_PRODUCT_COUNT } from '../../test-data/products';
import { users } from '../../test-data/users';

test.describe('Authentication: login and logout', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-AUTH-001: valid user can log in', { tag: '@smoke' }, async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(TOTAL_PRODUCT_COUNT);
  });

  test('TC-AUTH-002: logged-in user can log out', { tag: '@smoke' }, async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();

    await inventoryPage.logout();

    await loginPage.expectOnLoginPage();
  });

  test('TC-AUTH-003: wrong password shows an error', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, 'wrong_password');

    await loginPage.expectError(loginErrors.invalidCredentials);
    await loginPage.expectOnLoginPage();
  });

  test('TC-AUTH-004: unknown username shows an error', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.standard.password);

    await loginPage.expectError(loginErrors.invalidCredentials);
  });

  test('TC-AUTH-005: empty username and password shows "Username is required"', async ({ loginPage }) => {
    await loginPage.login('', '');

    await loginPage.expectError(loginErrors.usernameRequired);
  });

  test('TC-AUTH-006: empty password shows "Password is required"', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');

    await loginPage.expectError(loginErrors.passwordRequired);
  });

  test('TC-AUTH-007: locked-out user cannot log in', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await loginPage.expectError(loginErrors.lockedOut);
    await loginPage.expectOnLoginPage();
  });

  test('TC-AUTH-008: error message can be dismissed', async ({ loginPage }) => {
    await loginPage.login('', '');
    await loginPage.expectError(loginErrors.usernameRequired);

    await loginPage.dismissError();

    await loginPage.expectNoError();
  });
});
