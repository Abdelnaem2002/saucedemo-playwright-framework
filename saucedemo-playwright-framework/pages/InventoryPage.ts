import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption =
  | 'Name (A to Z)'
  | 'Name (Z to A)'
  | 'Price (low to high)'
  | 'Price (high to low)';

/** The "Products" page shown after login (the application's home page). */
export class InventoryPage extends BasePage {
  readonly items: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  private itemCard(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string): Promise<void> {
    await this.itemCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.itemCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async expectRemoveButtonVisible(productName: string): Promise<void> {
    await expect(this.itemCard(productName).getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async expectAddButtonVisible(productName: string): Promise<void> {
    await expect(this.itemCard(productName).getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
  }

  async openProductDetails(productName: string): Promise<void> {
    await this.productNames.filter({ hasText: productName }).click();
  }
}
