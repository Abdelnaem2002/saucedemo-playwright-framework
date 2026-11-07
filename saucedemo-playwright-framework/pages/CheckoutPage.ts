import { expect, type Locator, type Page } from '@playwright/test';
import type { CustomerInfo } from '../test-data/checkout';
import { ORDER_COMPLETE_MESSAGE } from '../test-data/messages';
import { parsePrice } from '../utils/price';
import { BasePage } from './BasePage';

/** Covers the three checkout screens: information form, overview and confirmation. */
export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly overviewItemPrices: Locator;
  readonly itemTotalLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');
    this.overviewItemPrices = page.getByTestId('inventory-item-price');
    this.itemTotalLabel = page.getByTestId('subtotal-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async expectOnInformationStep(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  /** Empty strings are allowed on purpose, so negative tests can leave fields blank. */
  async fillInformation(info: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(message);
  }

  async expectOnOverviewStep(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  /** Sum of the individual item prices shown on the overview page. */
  async sumOfItemPrices(): Promise<number> {
    const prices = await this.overviewItemPrices.allTextContents();
    return prices.reduce((sum, text) => sum + parsePrice(text), 0);
  }

  async displayedItemTotal(): Promise<number> {
    return parsePrice(await this.itemTotalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.completeHeader).toHaveText(ORDER_COMPLETE_MESSAGE);
  }
}
