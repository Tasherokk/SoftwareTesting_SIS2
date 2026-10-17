import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  constructor(private page: Page) {
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error');
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot your password/i });
    this.registerLink = page.getByRole('link', { name: /register your account/i });
  }

  async open() {
    await this.page.goto('/auth/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.loginError.innerText()).trim();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickRegister() {
    await this.registerLink.click();
  }
}