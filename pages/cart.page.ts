import { Page, Locator, expect } from '@playwright/test';

export interface BillingAddressData {
  country?: string;
  postalCode: string;
  houseNumber: string;
  street?: string;
  city?: string;
  state: string;
}

export class CartPage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productQuantity: Locator;
  readonly cartTotal: Locator;

  // Multi-step checkout buttons
  readonly proceed1Button: Locator;
  readonly proceed2Button: Locator;
  readonly proceed3Button: Locator;

  // Billing address fields
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;

  // Payment fields
  readonly paymentMethodSelect: Locator;
  readonly finishButton: Locator;
  readonly successAlert: Locator;

  constructor(private page: Page) {
    this.productTitle = page.getByTestId('product-title');
    this.productPrice = page.getByTestId('product-price');
    this.productQuantity = page.getByTestId('product-quantity');
    this.cartTotal = page.getByTestId('cart-total');

    this.proceed1Button = page.getByTestId('proceed-1');
    this.proceed2Button = page.getByTestId('proceed-2');
    this.proceed3Button = page.getByTestId('proceed-3');

    this.countrySelect = page.getByTestId('country');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.streetInput = page.getByTestId('street');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');

    this.paymentMethodSelect = page.getByTestId('payment-method');
    this.finishButton = page.getByTestId('finish');
    this.successAlert = page.locator('.alert-success');
  }

  async open() {
    await this.page.goto('/checkout');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async proceedFromCartSummary() {
    await this.proceed1Button.waitFor({ state: 'visible' });
    await this.proceed1Button.click();
  }

  async proceedFromSignInStep() {
    await this.proceed2Button.waitFor({ state: 'visible' });
    await this.proceed2Button.click();
  }

  async fillBillingAddress(address: BillingAddressData) {
    await this.proceed3Button.waitFor({ state: 'visible' });

    if (address.country) {
      await this.countrySelect.selectOption(address.country);
    }
    await this.postalCodeInput.fill(address.postalCode);
    await this.houseNumberInput.fill(address.houseNumber);
    if (address.street) {
      await this.streetInput.fill(address.street);
    }
    if (address.city) {
      await this.cityInput.fill(address.city);
    }
    await this.stateInput.fill(address.state);

    await expect(this.proceed3Button).toBeEnabled();
    await this.proceed3Button.click();
  }

  async selectPaymentMethod(methodValue: string = 'cash-on-delivery') {
    await this.paymentMethodSelect.waitFor({ state: 'visible' });
    await this.paymentMethodSelect.selectOption(methodValue);
  }

  async finishOrder() {
    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
  }

  async completeFullCheckout(address: BillingAddressData, paymentMethod: string = 'cash-on-delivery') {
    await this.proceedFromCartSummary();
    await this.proceedFromSignInStep();
    await this.fillBillingAddress(address);
    await this.selectPaymentMethod(paymentMethod);
    await this.finishOrder();
  }

  async expectOrderSuccessful() {
    await expect(this.successAlert).toBeVisible();
    await expect(this.successAlert).toContainText(/payment was successful/i);
  }
}
