import { expect, test } from '../../fixtures/test-fixtures';
import { loginErrors } from '../../test-data/messages';

const protectedPages = [
  { id: 'TC-AUTH-009', path: '/inventory.html' },
  { id: 'TC-AUTH-010', path: '/cart.html' },
  { id: 'TC-AUTH-011', path: '/checkout-step-one.html' },
];

test.describe('Authentication: unauthorized access', () => {
  for (const { id, path } of protectedPages) {
    test(`${id}: anonymous user cannot open ${path}`, async ({ page, loginPage }) => {
      await page.goto(path);

      await loginPage.expectOnLoginPage();
      await loginPage.expectError(loginErrors.unauthorizedAccess(path));
    });
  }

  test('TC-AUTH-012: user cannot reopen /inventory.html after logging out', async ({
    page,
    loggedInInventoryPage,
    loginPage,
  }) => {
    await loggedInInventoryPage.logout();
    await loginPage.expectOnLoginPage();

    await page.goto('/inventory.html');

    await loginPage.expectError(loginErrors.unauthorizedAccess('/inventory.html'));
    await expect(loginPage.loginButton).toBeVisible();
  });
});
