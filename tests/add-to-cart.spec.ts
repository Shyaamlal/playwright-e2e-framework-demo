import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';
import { TEST_USERS } from './test-data/users';
import { PRODUCTS } from './test-data/products';

/**
 * Test Suite: Add to Cart Functionality
 * Application: saucedemo.com
 * Scope: Happy path - Verify product can be added to cart successfully
 */

test.describe('Add to Cart', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);

    // Verify we're on the inventory page
    await expect(page).toHaveURL(/.*inventory.html/);

    productsPage = new ProductsPage(page);
  });

  test('should add product to cart and verify all acceptance criteria', async ({ page }) => {
    // Get all "Add to cart" buttons on the page to verify count
    const allAddToCartButtons = page.getByRole('button', { name: /add to cart/i });
    const buttonCount = await allAddToCartButtons.count();

    // Ensure there are at least 2 products on the page (for acceptance criteria #3)
    expect(buttonCount).toBeGreaterThanOrEqual(2);

    // ACCEPTANCE CRITERIA #1: Click "Add to cart" and verify button changes to "Remove"
    await productsPage.addToCart(PRODUCTS.backpack.addToCart);

    const firstProductRemoveButton = page.getByTestId(PRODUCTS.backpack.remove);
    await expect(firstProductRemoveButton).toBeVisible();
    await expect(firstProductRemoveButton).toHaveText(/remove/i);

    // ACCEPTANCE CRITERIA #2: Verify cart icon shows number "1"
    await expect(productsPage.cartBadge).toBeVisible();
    await expect(productsPage.cartBadge).toHaveText('1');

    // ACCEPTANCE CRITERIA #3: Verify at least one other product's "Add to cart" button remains unchanged
    const secondProductButton = page.getByTestId(PRODUCTS.bikeLight.addToCart);
    await expect(secondProductButton).toBeVisible();
    await expect(secondProductButton).toHaveText(/add to cart/i);

    // Additional verification: Verify overall count of "Add to cart" buttons decreased by 1
    const remainingAddToCartButtons = page.getByRole('button', { name: /add to cart/i });
    const remainingCount = await remainingAddToCartButtons.count();
    expect(remainingCount).toBe(buttonCount - 1);
  });
});
