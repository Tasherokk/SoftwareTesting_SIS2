import { expect, test as setup } from '../fixtures/pages.fixture';
import { TEST_DATA } from '../data/test-data';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ loginPage, page }) => {
  await loginPage.open();
  
  await loginPage.login(TEST_DATA.validUser.email, TEST_DATA.validUser.password);
  
  await expect(page).toHaveURL(/\/account/);
  
  await page.context().storageState({ path: authFile });
});