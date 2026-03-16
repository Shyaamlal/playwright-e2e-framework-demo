import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model: Products Page
 * Application: saucedemo.com
 * URL: /inventory.html
 *
 * Contains elements and actions for the products listing page.
 * Reached after successful login — no goto() method needed.
 */
export class ProductsPage {
  readonly page: Page;

  // Static locators — always present on the page
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  /**
   * Add a product to cart.
   * @param dataTestId - Use PRODUCTS.{name}.addToCart from tests/test-data/products.ts
   */
  async addToCart(dataTestId: string): Promise<void> {
    await this.page.getByTestId(dataTestId).click();
  }

  /**
   * Remove a product from cart.
   * @param dataTestId - Use PRODUCTS.{name}.remove from tests/test-data/products.ts
   */
  async removeFromCart(dataTestId: string): Promise<void> {
    await this.page.getByTestId(dataTestId).click();
  }

  /**
   * Navigate to the cart page.
   */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Get the current cart item count.
   * Returns empty string when cart is empty (badge not visible).
   */
  async getCartCount(): Promise<string> {
    return await this.cartBadge.textContent() || '';
  }

  /**
   * Sort products using the sort dropdown.
   * @param sortOption - Exact visible text: 'Name (A to Z)', 'Name (Z to A)',
   *                     'Price (low to high)', 'Price (high to low)'
   */
  async sortProducts(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }
}
