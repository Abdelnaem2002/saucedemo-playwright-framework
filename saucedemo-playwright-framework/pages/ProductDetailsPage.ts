import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.getByTestId('inventory-item-name');
    this.backToProductsButton = page.getByTestId('back-to-products');
  }

  async expectShowing(productName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory-item\.html\?id=\d+/);
    await expect(this.productName).toHaveText(productName);
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
