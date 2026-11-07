import { expect, test } from '../../fixtures/test-fixtures';
import { products } from '../../test-data/products';

test.describe('Navigation', () => {
  test('TC-NAV-001: side menu shows all expected links', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.openMenu();

    for (const link of ['All Items', 'About', 'Logout', 'Reset App State'] as const) {
      await expect(loggedInInventoryPage.menuLink(link)).toBeVisible();
    }
  });

  test('TC-NAV-002: cart icon opens the cart page', { tag: '@smoke' }, async ({ loggedInInventoryPage, cartPage }) => {
    await loggedInInventoryPage.goToCart();

    await cartPage.expectLoaded();
  });

  test('TC-NAV-003: product name opens details and Back returns to the list', async ({
    loggedInInventoryPage,
    productDetailsPage,
  }) => {
    await loggedInInventoryPage.openProductDetails(products.backpack);
    await productDetailsPage.expectShowing(products.backpack);

    await productDetailsPage.backToProducts();

    await loggedInInventoryPage.expectLoaded();
  });

  test('TC-NAV-004: "All Items" menu link returns to the product list', async ({
    loggedInInventoryPage,
    cartPage,
  }) => {
    await loggedInInventoryPage.goToCart();
    await cartPage.expectLoaded();

    await cartPage.openMenu();
    await cartPage.menuLink('All Items').click();

    await loggedInInventoryPage.expectLoaded();
  });

  test('TC-NAV-005: "Continue Shopping" returns to the product list', async ({
    loggedInInventoryPage,
    cartPage,
  }) => {
    await loggedInInventoryPage.goToCart();

    await cartPage.continueShopping();

    await loggedInInventoryPage.expectLoaded();
  });

  test('TC-NAV-006: "About" link points to the Sauce Labs website', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.openMenu();

    // We check the link target instead of visiting an external site, which keeps the test fast and stable.
    await expect(loggedInInventoryPage.menuLink('About')).toHaveAttribute('href', /saucelabs\.com/);
  });
});
