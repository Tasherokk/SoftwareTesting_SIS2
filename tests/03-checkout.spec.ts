import { test, expect } from '../fixtures/pages.fixture';
import { TEST_DATA } from '../data/test-data';

test.describe('Test 3: Add to Cart and Complete Checkout', () => {
  test('should add a product to cart and complete checkout flow', async ({
    productPage,
    cartPage,
  }) => {
    // 1. Navigate to product catalog on Home page
    await productPage.openHome();

    // 2. Open first product details and add to cart
    await productPage.openProductDetailsByIndex(0);
    const productInfo = await productPage.getDetailsInfo();
    expect(productInfo.name).toBeTruthy();
    expect(productInfo.price).toBeGreaterThan(0);

    await productPage.addToCart(1);

    // 3. Navigate to cart / checkout
    await productPage.goToCart();

    // 4. Complete all checkout steps
    await expect(cartPage.productTitle).toBeVisible();
    await expect(cartPage.productTitle).toHaveText(productInfo.name);

    await cartPage.completeFullCheckout(
      TEST_DATA.billingAddress,
      TEST_DATA.paymentMethods.cashOnDelivery
    );

    // 5. Verify successful checkout confirmation
    await cartPage.expectOrderSuccessful();
  });
});
