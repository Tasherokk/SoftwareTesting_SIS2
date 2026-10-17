import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { PasswordResetPage } from '../pages/password-reset.page';

type PageFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  productPage: ProductPage;
  cartPage: CartPage;
  passwordResetPage: PasswordResetPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  passwordResetPage: async ({ page }, use) => {
    await use(new PasswordResetPage(page));
  },
});

export { expect } from '@playwright/test';