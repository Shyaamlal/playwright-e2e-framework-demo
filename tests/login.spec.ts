import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { TEST_USERS } from './test-data/users';

/**
 * Test Suite: Login Functionality
 * Application: saucedemo.com
 * Scope: Happy path (valid credentials) and Unhappy path (invalid/locked credentials)
 */

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async () => {
    // Action: Login with valid credentials (Happy Path)
    await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);

    // Assertion: Verify successful login by checking the page title
    await expect(loginPage.titleElement).toBeVisible();
    await expect(loginPage.titleElement).toHaveText('Products');
  });

  test('should show error message when logging in with locked user credentials', async () => {
    // Action: Login with locked user credentials (Unhappy Path)
    await loginPage.login(TEST_USERS.locked.username, TEST_USERS.locked.password);

    // Assertion: Verify error message is displayed
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');

    // Assertion: Verify error button is visible
    await expect(loginPage.errorButton).toBeVisible();
  });
});
