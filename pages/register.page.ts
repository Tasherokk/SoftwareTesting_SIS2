import { Page, Locator } from '@playwright/test';
import { CustomerData } from '../data/user.factory';

export class RegisterPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerSubmitButton: Locator;

  constructor(private page: Page) {
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.dobInput = page.getByTestId('dob');
    this.countrySelect = page.getByTestId('country');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.streetInput = page.getByTestId('street');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.phoneInput = page.getByTestId('phone');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.registerSubmitButton = page.getByTestId('register-submit');
  }

  async open() {
    await this.page.goto('/auth/register');
    await this.page.waitForLoadState('networkidle');
  }

  async registerCustomer(customer: CustomerData) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.dobInput.fill(customer.dob);
    await this.countrySelect.selectOption(customer.country);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.houseNumberInput.fill(customer.houseNumber);
    await this.streetInput.fill(customer.street);
    await this.cityInput.fill(customer.city);
    await this.stateInput.fill(customer.state);
    await this.phoneInput.fill(customer.phone);
    await this.emailInput.fill(customer.email);
    await this.passwordInput.fill(customer.password);
    await this.registerSubmitButton.click();
    await this.page.waitForURL(/\/auth\/login/);
  }
}
