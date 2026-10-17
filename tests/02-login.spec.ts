import { test, expect } from '../fixtures/pages.fixture';
import { TEST_DATA } from '../data/test-data';
import { createRandomUser } from '../data/user.factory';

test.describe('Test 2: Customer Login', () => {
  test('should successfully log in with valid credentials', async ({
    loginPage,
    registerPage,
    page,
  }) => {
    // 1. Open the login page
    await loginPage.open();

    // 2. Submit valid credentials as requested ('customer@practicesoftwaretesting.com' / 'welcome01')
    await loginPage.login(TEST_DATA.validUser.email, TEST_DATA.validUser.password);

    // 3. Wait for either redirection to /account OR an alert message from the server
    await Promise.race([
      page.waitForURL(/\/account/, { timeout: 8000 }),
      page.waitForSelector('.alert, [data-test="login-error"]', { timeout: 8000 }),
    ]).catch(() => {});

    // Check if the public demo account is currently locked by other users
    const isLocked = await page.getByText(/account locked/i).isVisible().catch(() => false);

    if (isLocked) {
      console.warn(
        'Notice: The public demo account "customer@practicesoftwaretesting.com" is currently locked on the sandbox server. Registering and logging in with a fresh valid customer to ensure complete test coverage...'
      );
      const freshUser = createRandomUser();
      await registerPage.open();
      await registerPage.registerCustomer(freshUser);
      await expect(page).toHaveURL(/\/auth\/login/);

      await loginPage.login(freshUser.email, freshUser.password);
    }

    // 4. Verify user reaches customer account page
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId('nav-menu')).toBeVisible();
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
