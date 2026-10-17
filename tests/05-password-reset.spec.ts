import { test } from '../fixtures/pages.fixture';
import { TEST_DATA } from '../data/test-data';
import { createRandomUser } from '../data/user.factory';

test.describe('Test 5: Password Reset Flow', () => {
  test('should show error when requesting password reset with an invalid email', async ({
    passwordResetPage,
  }) => {
    // 1. Open password reset page
    await passwordResetPage.open();

    // 2. Submit invalid email format
    await passwordResetPage.requestReset(TEST_DATA.invalidEmailFormat);

    // 3. Verify validation error state
    await passwordResetPage.expectInvalidEmailError();
  });

  test('should submit successfully when requesting password reset with a valid email', async ({
    registerPage,
    passwordResetPage,
  }) => {
    // 1. Register a fresh customer to ensure the email exists in the backend
    const customer = createRandomUser();
    await registerPage.open();
    await registerPage.registerCustomer(customer);

    // 2. Open password reset page
    await passwordResetPage.open();

    // 3. Submit valid registered customer email
    await passwordResetPage.requestReset(customer.email);

    // 4. Verify success message / alert confirmation
    await passwordResetPage.expectSuccessConfirmation();
  });
});
