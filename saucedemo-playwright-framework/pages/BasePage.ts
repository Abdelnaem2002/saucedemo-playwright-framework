import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Elements shared by every page after login (header, side menu, cart badge).
 * Other page objects extend this class so we never repeat these locators.
 */
export abstract class BasePage {
  readonly pageTitle: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;

  constructor(protected readonly page: Page) {
    this.pageTitle = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
  }

  menuLink(name: 'All Items' | 'About' | 'Logout' | 'Reset App State'): Locator {
    return this.page.getByRole('link', { name });
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await expect(this.menuLink('Logout')).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.menuLink('Logout').click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** The badge is removed from the DOM when the cart is empty, so 0 means "no badge". */
  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }
}
