import { test, expect } from '../fixtures/pages.fixture';
import { TEST_DATA } from '../data/test-data';
import { createRandomUser } from '../data/user.factory';

test.describe('Test 3: Add to Cart and Complete Checkout', () => {
  test('should add a product to cart and complete checkout flow', async ({
    registerPage,
    loginPage,
    productPage,
    cartPage,
    page,
  }) => {
    // 1. Register and log in a dedicated customer for complete test isolation
    const customer = createRandomUser();
    await registerPage.open();
    await registerPage.registerCustomer(customer);
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.login(customer.email, customer.password);
    await expect(page).toHaveURL(/\/account/);

    // 2. Navigate to product catalog on Home page
    await productPage.openHome();

    // 3. Open first product details and add to cart
    await productPage.openProductDetailsByIndex(0);
    const productInfo = await productPage.getDetailsInfo();
    expect(productInfo.name).toBeTruthy();
    expect(productInfo.price).toBeGreaterThan(0);

    await productPage.addToCart(1);

    // 4. Navigate to cart / checkout
    await productPage.goToCart();

    // 5. Complete all checkout steps
    await cartPage.completeFullCheckout(
      TEST_DATA.billingAddress,
      TEST_DATA.paymentMethods.cashOnDelivery
    );

    // 6. Verify successful checkout confirmation
    await cartPage.expectOrderSuccessful();
  });
});
