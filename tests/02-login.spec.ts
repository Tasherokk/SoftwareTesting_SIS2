import { test, expect } from '../fixtures/pages.fixture';
import { TEST_DATA } from '../data/test-data';

test.describe('Test 2: Customer Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test('should successfully log in with valid credentials', async ({
    loginPage,
    page,
  }) => {
    // 1. Open the login page
    await loginPage.open();

    // 2. Submit valid credentials
    await loginPage.login(TEST_DATA.validUser.email, TEST_DATA.validUser.password);

    // 3. Verify user reaches customer account page
    await expect(page).toHaveURL(/\/account/);
  });

  test('should show error message when logging in with invalid credentials', async ({
    loginPage,
  }) => {
    // 1. Open the login page
    await loginPage.open();

    // 2. Submit invalid credentials
    await loginPage.login(TEST_DATA.invalidUser.email, TEST_DATA.invalidUser.password);

    // 3. Verify error message is displayed
    await expect(loginPage.loginError).toBeVisible();
    await expect(loginPage.loginError).toContainText(/invalid email or password/i);
  });
});
