import { expect, test } from '../../fixtures/test-fixtures';
import { validCustomer } from '../../test-data/checkout';
import { products } from '../../test-data/products';

test.describe('Shopping cart', () => {
  test('TC-FUNC-001: adding one product updates the cart badge', { tag: '@smoke' }, async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.addToCart(products.backpack);

    await loggedInInventoryPage.expectCartCount(1);
    await loggedInInventoryPage.expectRemoveButtonVisible(products.backpack);
  });

  test('TC-FUNC-002: adding three products shows a badge of 3', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.addToCart(products.bikeLight);
    await loggedInInventoryPage.addToCart(products.boltTShirt);

    await loggedInInventoryPage.expectCartCount(3);
  });

  test('TC-FUNC-003: removing a product from the list clears the badge', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.expectCartCount(1);

    await loggedInInventoryPage.removeFromCart(products.backpack);

    await loggedInInventoryPage.expectCartCount(0);
    await loggedInInventoryPage.expectAddButtonVisible(products.backpack);
  });

  test('TC-FUNC-004: added products appear in the cart', async ({ loggedInInventoryPage, cartPage }) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.addToCart(products.onesie);

    await loggedInInventoryPage.goToCart();

    await cartPage.expectLoaded();
    await expect(cartPage.itemNames).toHaveText([products.backpack, products.onesie]);
  });

  test('TC-FUNC-005: removing a product in the cart updates the list and badge', async ({
    loggedInInventoryPage,
    cartPage,
  }) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.addToCart(products.onesie);
    await loggedInInventoryPage.goToCart();

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.itemNames).toHaveText([products.onesie]);
    await cartPage.expectCartCount(1);
  });

  test('TC-FUNC-006: cart content survives page navigation', async ({
    loggedInInventoryPage,
    productDetailsPage,
  }) => {
    await loggedInInventoryPage.addToCart(products.backpack);

    await loggedInInventoryPage.openProductDetails(products.bikeLight);
    await productDetailsPage.backToProducts();

    await loggedInInventoryPage.expectCartCount(1);
    await loggedInInventoryPage.expectRemoveButtonVisible(products.backpack);
  });

  test('TC-FUNC-007: checkout overview item total equals the sum of item prices', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.addToCart(products.bikeLight);
    await loggedInInventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation(validCustomer);
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOnOverviewStep();
    await expect(checkoutPage.overviewItemPrices).toHaveCount(2);

    const expectedTotal = await checkoutPage.sumOfItemPrices();

    expect(await checkoutPage.displayedItemTotal()).toBeCloseTo(expectedTotal, 2);
  });
});
