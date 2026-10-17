import { test } from '../fixtures/pages.fixture';
import { TEST_DATA } from '../data/test-data';

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
    passwordResetPage,
  }) => {
    // 1. Open password reset page
    await passwordResetPage.open();

    // 2. Submit valid registered customer email
    await passwordResetPage.requestReset(TEST_DATA.validUser.email);

    // 3. Verify success message / alert confirmation
    await passwordResetPage.expectSuccessConfirmation();
  });
});
