import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model: Cart Page
 * Application: saucedemo.com
 * URL: /cart.html
 *
 * Contains elements and actions for the shopping cart page.
 * Reached by clicking the cart icon on any page after login.
 */
export class CartPage {
  readonly page: Page;

  // Static locators — always present on the page
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.cartList = page.getByTestId('cart-list');
  }

  /**
   * Remove a product from the cart.
   * @param dataTestId - Use PRODUCTS.{name}.remove from tests/test-data/products.ts
   */
  async removeItem(dataTestId: string): Promise<void> {
    await this.page.getByTestId(dataTestId).click();
  }

  /**
   * Proceed to checkout.
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Go back to the products page.
   */
  async goBackToProducts(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
