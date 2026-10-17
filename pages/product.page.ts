import { Page, Locator, expect } from '@playwright/test';

export interface ProductInfo {
  name: string;
  price: number;
  rawPrice: string;
}

export class ProductPage {
  readonly productCards: Locator;
  readonly productName: Locator;
  readonly unitPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartQuantityBadge: Locator;
  readonly navCartLink: Locator;

  constructor(private page: Page) {
    this.productCards = page.locator('a.card');
    this.productName = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.cartQuantityBadge = page.getByTestId('cart-quantity');
    this.navCartLink = page.getByTestId('nav-cart');
  }

  async openHome() {
    await this.page.goto('/');
    await this.page.waitForSelector('a.card');
  }

  async getProductCardInfo(index: number): Promise<ProductInfo> {
    const card = this.productCards.nth(index);
    await card.waitFor({ state: 'visible' });
    const name = (await card.getByTestId('product-name').innerText()).trim();
    const rawPrice = (await card.getByTestId('product-price').innerText()).trim();
    const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

    return {
      name,
      price: numericPrice,
      rawPrice,
    };
  }

  async openProductDetailsByIndex(index: number) {
    await this.productCards.nth(index).click();
    await this.productName.waitFor({ state: 'visible' });
  }

  async getDetailsInfo(): Promise<ProductInfo> {
    await this.productName.waitFor({ state: 'visible' });
    const name = (await this.productName.innerText()).trim();
    const rawPrice = (await this.unitPrice.innerText()).trim();
    const numericPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

    return {
      name,
      price: numericPrice,
      rawPrice,
    };
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
    await this.page.waitForURL(/\/checkout/);
  }
}
