import { Page, Locator, expect } from '@playwright/test';

export interface ProductInfo {
  name: string;
  price: number;
  rawPrice: string;
}

export class ProductPage {
  readonly productName: Locator;
  readonly unitPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartQuantityBadge: Locator;
  readonly navCartLink: Locator;
  readonly navHomeLink: Locator;

  constructor(private page: Page) {
    this.productName = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.cartQuantityBadge = page.getByTestId('cart-quantity');
    this.navCartLink = page.getByTestId('nav-cart');
    this.navHomeLink = page.getByTestId('nav-home');
  }

  async openHome() {
    await this.page.goto('/');
    await expect(this.productName.first()).toBeVisible();
  }

  async openProductDetailsByIndex(index: number) {
    await this.productName.nth(index).click();
    await expect(this.addToCartButton).toBeVisible();
  }

  async getDetailsInfo(): Promise<ProductInfo> {
    await expect(this.productName.first()).toBeVisible();
    const name = (await this.productName.first().innerText()).trim();
    const rawPrice = (await this.unitPrice.first().innerText()).trim();
    const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

    return { name, price: numericPrice, rawPrice };
  }

  async addToCart(quantity: number = 1) {
    if (quantity > 1) {
      await this.quantityInput.fill(quantity.toString());
    }
    await this.addToCartButton.click();
    // Wait for the cart counter badge to reflect the added item
    await expect(this.cartQuantityBadge).toBeVisible();
  }

  async goToCart() {
    await this.navCartLink.click();
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  async goBackToHome() {
    await this.navHomeLink.click();
    await expect(this.addToCartButton).toBeHidden();
    await expect(this.productName.nth(1)).toBeVisible();
  }
}
