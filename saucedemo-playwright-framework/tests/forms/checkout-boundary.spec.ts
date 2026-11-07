import { test } from '../../fixtures/test-fixtures';
import type { CustomerInfo } from '../../test-data/checkout';
import { products } from '../../test-data/products';

interface BoundaryCase {
  id: string;
  name: string;
  customer: CustomerInfo;
}

// The application has no documented length or format rules, so these cases document its actual behaviour:
// every one of them is currently accepted.
const acceptedInputs: BoundaryCase[] = [
  { id: 'TC-BND-008', name: 'minimum length (1 character per field)', customer: { firstName: 'A', lastName: 'B', postalCode: '1' } },
  {
    id: 'TC-BND-009',
    name: 'special characters and accents',
    customer: { firstName: "O'Brien-Smith", lastName: 'Ñandú & Co.', postalCode: '#12-A/B' },
  },
  {
    id: 'TC-BND-010',
    name: '255-character values',
    customer: { firstName: 'f'.repeat(255), lastName: 'l'.repeat(255), postalCode: '9'.repeat(255) },
  },
];

test.describe('Checkout form boundary inputs', () => {
  test.beforeEach(async ({ loggedInInventoryPage, cartPage }) => {
    await loggedInInventoryPage.addToCart(products.backpack);
    await loggedInInventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  for (const { id, name, customer } of acceptedInputs) {
    test(`${id}: ${name} is accepted`, async ({ checkoutPage }) => {
      await checkoutPage.fillInformation(customer);
      await checkoutPage.continueToOverview();

      await checkoutPage.expectOnOverviewStep();
    });
  }
});
