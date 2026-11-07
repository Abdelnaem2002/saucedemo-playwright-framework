import { expect, test } from '../../fixtures/test-fixtures';
import { parsePrice, formatPrice } from '../../utils/price';

test.describe('Product sorting (filter)', () => {
  test('TC-FUNC-008: sort by name A to Z', async ({ loggedInInventoryPage: inventory }) => {
    // The default order is already A-Z, so switch away first to prove the option really sorts.
    await inventory.sortBy('Name (Z to A)');
    const names = await inventory.productNames.allTextContents();

    await inventory.sortBy('Name (A to Z)');

    await expect(inventory.productNames).toHaveText([...names].sort());
  });

  test('TC-FUNC-009: sort by name Z to A', async ({ loggedInInventoryPage: inventory }) => {
    const names = await inventory.productNames.allTextContents();

    await inventory.sortBy('Name (Z to A)');

    await expect(inventory.productNames).toHaveText([...names].sort().reverse());
  });

  test('TC-FUNC-010: sort by price low to high', async ({ loggedInInventoryPage: inventory }) => {
    const prices = (await inventory.productPrices.allTextContents()).map(parsePrice);

    await inventory.sortBy('Price (low to high)');

    const expected = [...prices].sort((a, b) => a - b).map(formatPrice);
    await expect(inventory.productPrices).toHaveText(expected);
  });

  test('TC-FUNC-011: sort by price high to low', async ({ loggedInInventoryPage: inventory }) => {
    const prices = (await inventory.productPrices.allTextContents()).map(parsePrice);

    await inventory.sortBy('Price (high to low)');

    const expected = [...prices].sort((a, b) => b - a).map(formatPrice);
    await expect(inventory.productPrices).toHaveText(expected);
  });
});
