import { test } from '../../fixtures/test-fixtures';
import { validCustomer } from '../../test-data/checkout';
import { checkoutErrors } from '../../test-data/messages';
import { products } from '../../test-data/products';

test.describe('Checkout form', () => {
  test.beforeEach(async ({ loggedInInventoryPage, cartPage, checkoutPage }) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.expectOnInformationStep();
  });

  test('TC-FORM-001: valid customer details complete an order', { tag: '@smoke' }, async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(validCustomer);
    await checkoutPage.continueToOverview();
    await checkoutPage.expectOnOverviewStep();

    await checkoutPage.finish();

    await checkoutPage.expectOrderComplete();
  });

  test('TC-FORM-002: all fields empty shows "First Name is required"', async ({ checkoutPage }) => {
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(checkoutErrors.firstNameRequired);
    await checkoutPage.expectOnInformationStep();
  });

  test('TC-FORM-003: missing last name shows "Last Name is required"', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ ...validCustomer, lastName: '' });
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(checkoutErrors.lastNameRequired);
  });

  test('TC-FORM-004: missing postal code shows "Postal Code is required"', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ ...validCustomer, postalCode: '' });
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(checkoutErrors.postalCodeRequired);
  });

  test('TC-FORM-005: Cancel returns to the cart', async ({ checkoutPage, cartPage }) => {
    await checkoutPage.cancel();

    await cartPage.expectLoaded();
  });
});
