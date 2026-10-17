import { test, expect } from '../fixtures/pages.fixture';
import { createRandomUser } from '../data/user.factory';

test.describe('Test 1: Customer Registration', () => {
  test('should successfully register a new customer and verify login', async ({
    registerPage,
    loginPage,
    page,
  }) => {
    // Generate isolated random test data for this run
    const newCustomer = createRandomUser();

    // 1. Navigate to Registration page
    await registerPage.open();

    // 2. Fill out and submit the registration form
    await registerPage.registerCustomer(newCustomer);

    // 3. Verify user is redirected to the Login page after successful registration
    await expect(page).toHaveURL(/\/auth\/login/);

    // 4. Verify the newly registered customer can log in
    await loginPage.login(newCustomer.email, newCustomer.password);
    await expect(page).toHaveURL(/\/account/);
  });
});
