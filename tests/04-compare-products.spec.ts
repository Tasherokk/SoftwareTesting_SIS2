import { test, expect } from '../fixtures/pages.fixture';

test.describe('Test 4: Product Comparison', () => {
  test('should open two different products, capture details, and compare them', async ({
    productPage,
  }) => {
    // 1. Navigate to home catalog
    await productPage.openHome();

    // 2. Open Product 1 details and capture info
    await productPage.openProductDetailsByIndex(0);
    const product1 = await productPage.getDetailsInfo();

    // 3. Navigate back to catalog and open Product 2 details
    await productPage.goBackToHome();
    await productPage.openProductDetailsByIndex(1);
    const product2 = await productPage.getDetailsInfo();

    // 4. Assertions on captured data
    expect(product1.name).toBeTruthy();
    expect(product2.name).toBeTruthy();
    expect(product1.price).toBeGreaterThan(0);
    expect(product2.price).toBeGreaterThan(0);

    // 5. Compare the two products
    expect(product1.name).not.toBe(product2.name);

    const priceDiff = Math.abs(product1.price - product2.price);
    const higherPricedProduct =
      product1.price > product2.price ? product1.name : product2.name;

    console.log(`Product 1: "${product1.name}" at $${product1.price}`);
    console.log(`Product 2: "${product2.name}" at $${product2.price}`);
    console.log(`Price difference: $${priceDiff.toFixed(2)}`);
    console.log(`Higher priced item: "${higherPricedProduct}"`);

    // Verify comparison logic integrity
    expect(priceDiff).toBeGreaterThanOrEqual(0);
    expect(higherPricedProduct).toBeTruthy();
  });
});
