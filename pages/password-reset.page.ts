import { Page, Locator, expect } from '@playwright/test';

export class PasswordResetPage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;
  readonly confirmationAlert: Locator;

  constructor(private page: Page) {
    this.emailInput = page.getByTestId('email');
    this.submitButton = page.getByTestId('forgot-password-submit');
    this.emailError = page.getByTestId('email-error');
    this.confirmationAlert = page.getByText('page.forgot-password.confirm');
  }

  async open() {
    await this.page.goto('/auth/forgot-password');
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async expectInvalidEmailError() {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailInput).toHaveClass(/is-invalid/);
  }

  async expectSuccessConfirmation() {
    await expect(this.confirmationAlert).toBeVisible();
  }
}
