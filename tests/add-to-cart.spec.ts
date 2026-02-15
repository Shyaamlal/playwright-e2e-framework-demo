import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { TEST_USERS } from './test-data/users';

/**
 * Test Suite: Add to Cart Functionality
 * Application: saucedemo.com
 * Scope: Happy path - Verify product can be added to cart successfully
 */

test.describe('Add to Cart', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);

    // Verify we're on the inventory page
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should add product to cart and verify all acceptance criteria', async ({ page }) => {
    // Get all "Add to cart" buttons on the page to verify count
    const allAddToCartButtons = page.getByRole('button', { name: /add to cart/i });
    const buttonCount = await allAddToCartButtons.count();

    // Ensure there are at least 2 products on the page (for acceptance criteria #3)
    expect(buttonCount).toBeGreaterThanOrEqual(2);

    // Target specific products using data-test attributes
    // Select the first product (Sauce Labs Backpack) button
    const firstProductButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');

    // Select a different product to verify it remains unchanged (Sauce Labs Bike Light)
    const secondProductButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');

    // Get the cart badge locator (shopping cart icon with item count)
    const cartBadge = page.getByTestId('shopping-cart-badge');

    // Verify second product button is initially "Add to cart"
    await expect(secondProductButton).toHaveText(/add to cart/i);

    // ACCEPTANCE CRITERIA #1: Click "Add to cart" and verify button changes to "Remove"
    await firstProductButton.click();

    // After clicking, the button should now have data-test="remove-sauce-labs-backpack"
    const firstProductRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(firstProductRemoveButton).toBeVisible();
    await expect(firstProductRemoveButton).toHaveText(/remove/i);

    // ACCEPTANCE CRITERIA #2: Verify cart icon shows number "1"
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // ACCEPTANCE CRITERIA #3: Verify at least one other product's "Add to cart" button remains unchanged
    // The second product's button should still be "Add to cart"
    await expect(secondProductButton).toBeVisible();
    await expect(secondProductButton).toHaveText(/add to cart/i);

    // Additional verification: Verify overall count of "Add to cart" buttons decreased by 1
    const remainingAddToCartButtons = page.getByRole('button', { name: /add to cart/i });
    const remainingCount = await remainingAddToCartButtons.count();
    expect(remainingCount).toBe(buttonCount - 1);
  });
});
