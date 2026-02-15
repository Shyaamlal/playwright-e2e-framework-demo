import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model: Login Page
 * Application: saucedemo.com
 *
 * Contains all elements on the login page and reusable login actions
 */
export class LoginPage {
  readonly page: Page;

  // Page Elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorButton: Locator;
  readonly errorMessage: Locator;
  readonly titleElement: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize all page elements using data-test attributes
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorButton = page.getByTestId('error-button');
    this.errorMessage = page.getByTestId('error');
    this.titleElement = page.getByTestId('title');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Action: Login with provided credentials
   *
   * @param username - Username to login with
   * @param password - Password to login with
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}
