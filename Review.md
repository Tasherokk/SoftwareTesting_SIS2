# Interesting issue

> I want start from showing why github actions fail D
I just uploaded screenshot of that issue, it seems that the github actions was blocked by Cloudflare(evidence are in screenshots folder).
I don't know how to fix that, so I left this.


# AI Test Generation Review & Refactoring Log

> **Note:** This review was originally written by me in Russian and translated into English for submission. The original human-written Russian draft is attached right below as proof.

<details>
<summary>Original Russian Draft (Proof)</summary>

По мне ИИ подготовил для меня отличный план реализации, думаю это благодаря промпту, где я попросил придерживаться строго лекционного материала, который я прикрепил. Он отлично понял требования, и дал мне план реализации. После я попросил дать мне промпт ИИ агента Gemini 3.8 Flash Medium. Но там я не просил чтобы он описал все, а только объяснил план реализации. Было интересно насколько хорошо он напишет тесты.
Структура у него получилась очень даже хорошая, и он примерно понял задумки, потому что я заранее подговотил папки и файлы тестов, но ничего туда не вписывал. Агент сам догадался какой архитектуры я хочу, и реализовал тесты через Playwright TS.

Тем не менее были критичные моменты:

1) Рефакторинг локаторов и борьба с динамическими ID
Файлы: pages/product.page.ts
Проблема ИИ: ИИ пытался искать карточки товаров по жесткому ID (например, [data-test="product-01M53..."]) и использовать CSS-классы (a.card). На сервере ID генерируются динамически.
Итерация 1 (Регулярные выражения): Мы внедрили локатор page.getByTestId(/product-.+/). Однако лог Trace Viewer показал, что регулярка слишком "жадная": она собирала в массив не только карточки, но и вложенные элементы (product-image, product-name). Из-за этого вызов .nth(1) кликал по картинке первого товара, а не по второй карточке.
Финальное решение: Я полностью отказалался от массива карточек. Клик по товару изменен на: await this.productName.nth(index).click();

2. Навигация в SPA и состояние гонки (Race Condition)
Файлы: pages/product.page.ts, tests/04-compare-products.spec.ts
Проблема ИИ: В тесте сравнения продуктов ИИ возвращался в каталог вызовом await page.goto('/'). В Angular-приложениях это ломает контекст: браузер не перезагружается целиком, и Playwright успевал кликнуть на второй товар до того, как DOM обновил названия (тест считывал старое название).
Решение: Внедрена UI-навигация. Добавлен метод goBackToHome() с кликом по this.navHomeLink.click(). Добавлено Web-first ожидание скрытия уникального элемента для гарантии перехода: await expect(this.addToCartButton).toBeHidden();. Только после исчезновения кнопки "Add to Cart" скрипт продолжал работу. Из 04-compare-products.spec.ts удалены жесткие перезагрузки страниц, скрипт переведен на использование метода goBackToHome().

3. Очистка от антипаттернов ожиданий (Waits)
Файлы: pages/cart.page.ts, pages/password-reset.page.ts, pages/register.page.ts
Проблема ИИ: Код содержал избыточные явные ожидания: waitForLoadState('networkidle'), waitForLoadState('domcontentloaded'), и waitFor({ state: 'visible' }) перед каждым действием (клик, ввод текста). Это приводило к таймаутам (45000ms), так как Angular постоянно шлет фоновые запросы.
Решение: Полностью удалены все конструкции waitFor(...). Осуществлен переход на встроенный механизм Actionability Playwright (авто-ожидание перед click() и fill()). Оставлены только строгие Web-first утверждения для валидации состояния: await expect(this.proceed3Button).toBeEnabled();.

4. Глобальная авторизация (Global Setup)
Файлы: tests/auth.setup.ts (создан), playwright.config.ts, tests/03-checkout.spec.ts, tests/04-compare-products.spec.ts
Проблема ИИ: В тестах на покупку и сравнение ИИ логинился каждый раз заново через UI. При падении формы логина падали бы все тесты зависимого функционала.
Решение: Создан файл auth.setup.ts для однократной генерации сессии перед прогоном chromium. В playwright.config.ts добавлен проект setup, а проект chromium настроен на использование сохраненного state и зависимость от setup. Из спеков (03 и 04) удалены шаги UI-авторизации, тесты ускорены за счет старта в залогиненном состоянии.

5. Изоляция тестов и очистка контекста
Файлы: tests/01-register.spec.ts, tests/02-login.spec.ts, tests/05-password-reset.spec.ts
Проблема ИИ: В Тесте 5 ИИ создавал зависимость: вызывал registerPage для создания юзера, чтобы затем сбросить ему пароль. После внедрения Global Setup тесты авторизации и регистрации начали падать, так как открывались уже залогиненными.
Решение: Для тестов 01, 02 и 05 добавлена локальная очистка контекста: test.use({ storageState: { cookies: [], origins: [] } });. Из Теста 5 удалена зависимость от registerPage. Тест переведен на использование статических данных TEST_DATA.validUser.email для сброса пароля.

6. Точечные локаторы и i18n баги (Toast/Alerts)
Файлы: pages/cart.page.ts, pages/password-reset.page.ts, tests/03-checkout.spec.ts
Проблема ИИ (Корзина): ИИ искал успешный алерт об оплате через getByRole('alert'). Фреймворк находил старый toast-попап ("Product added to shopping cart"), текст не совпадал, и тест падал.

Запуск и используемые команды:
npx playwright test - стандартный запуск.
npm run test:chrome (с флагом --project=chromium) - целевой запуск тестов в Chrome.
Отладка проводилась с использованием Playwright Trace Viewer для пошагового анализа состояния DOM-дерева и проверки резолва локаторов (особенно при выявлении проблемы с регулярным выражением карточек).

</details>

---

In my opinion, the AI put together a great implementation plan, mostly because my prompt told it to stick strictly to the attached lecture material. It understood the requirements right away and gave me a clear plan. After that, I asked it to generate a prompt for an AI agent (Gemini 3.8 Flash Medium). In that prompt, I didn't ask it to spell out every single detail, just to explain the implementation plan. I wanted to see how well the agent would write the tests on its own.

The structure it came up with was actually really good. It figured out what I was going for because I had already created the empty folders and test files beforehand. The agent guessed the architecture I wanted and wrote the tests using Playwright with TypeScript.

Still, there were some critical issues I had to fix:

### 1. Refactoring Locators and Dealing with Dynamic IDs
**Files:** `pages/product.page.ts`

* **AI Problem:** The AI tried to find product cards by hardcoded IDs (like `[data-test="product-01M53..."]`) and CSS classes (`a.card`). On the server, these IDs are generated dynamically.
* **Iteration 1 (Regular Expressions):** We added the locator `page.getByTestId(/product-.+/)`. However, the Trace Viewer logs showed that this regex was too greedy: it put not only the cards into the array, but also nested child elements (`product-image`, `product-name`). Because of that, calling `.nth(1)` clicked the image of the first product instead of the second card.
* **Final Solution:** I dropped the card array approach completely and changed the product click to:
  `await this.productName.nth(index).click();`

### 2. SPA Navigation and Race Conditions
**Files:** `pages/product.page.ts`, `tests/04-compare-products.spec.ts`

* **AI Problem:** In the product comparison test, the AI went back to the catalog by calling `await page.goto('/')`. In Angular apps, this breaks the context: the browser does not do a full reload, so Playwright clicked the second product before the DOM updated the titles (the test ended up reading the old product name).
* **Solution:**
  * Switched to UI navigation by adding a `goBackToHome()` method that clicks `this.navHomeLink.click()`.
  * Added a web-first wait for a unique element to disappear so we know the page transition finished: `await expect(this.addToCartButton).toBeHidden();`. The script only continues after the "Add to Cart" button disappears.
  * Removed hard page reloads from `04-compare-products.spec.ts` and updated the script to use `goBackToHome()`.

### 3. Cleaning Up Wait Anti-Patterns
**Files:** `pages/cart.page.ts`, `pages/password-reset.page.ts`, `pages/register.page.ts`

* **AI Problem:** The code had too many explicit waits like `waitForLoadState('networkidle')`, `waitForLoadState('domcontentloaded')`, and `waitFor({ state: 'visible' })` before every action (clicks, text inputs). This caused 45000ms timeouts because Angular constantly sends background requests.
* **Solution:**
  * Deleted all `waitFor(...)` calls.
  * Switched to Playwright's built-in Actionability (auto-waiting before `click()` and `fill()`).
  * Kept only strict web-first assertions for checking state: `await expect(this.proceed3Button).toBeEnabled();`.

### 4. Global Authentication (Global Setup)
**Files:** `tests/auth.setup.ts` (created), `playwright.config.ts`, `tests/03-checkout.spec.ts`, `tests/04-compare-products.spec.ts`

* **AI Problem:** In the checkout and comparison tests, the AI logged in through the UI every single time. If the login form broke, all dependent tests would fail too.
* **Solution:**
  * Created `auth.setup.ts` to generate the session once before running `chromium`.
  * Added a `setup` project in `playwright.config.ts`, and set the `chromium` project to depend on `setup` and use the saved state.
  * Removed UI login steps from specs `03` and `04`, making the tests faster since they start already logged in.

### 5. Test Isolation and Context Cleanup
**Files:** `tests/01-register.spec.ts`, `tests/02-login.spec.ts`, `tests/05-password-reset.spec.ts`

* **AI Problem:**
  * In Test 5, the AI created a dependency by calling `registerPage` to create a new user just to reset their password right after.
  * After adding Global Setup, the login and registration tests started failing because they opened in an already logged-in state.
* **Solution:**
  * Added local context cleanup for tests `01`, `02`, and `05`: `test.use({ storageState: { cookies: [], origins: [] } });`.
  * Removed the `registerPage` dependency from Test 5 and updated it to use static data (`TEST_DATA.validUser.email`) for password reset.

### 6. Specific Locators and i18n Bugs (Toast/Alerts)
**Files:** `pages/cart.page.ts`, `pages/password-reset.page.ts`, `tests/03-checkout.spec.ts`

* **AI Problem (Cart):** The AI looked for the payment success alert using `getByRole('alert')`. Playwright matched an older toast popup (`"Product added to shopping cart"`) instead, so the text didn't match and the test failed.
* **AI Problem (i18n / Language Mismatch):** Because the initial plan was discussed in Russian, the AI generated some text locators and assertions in Russian inside `password-reset.page.ts`, while the actual web app interface is in English.
* **Solution:**
  * Replaced generic `getByRole('alert')` locators with specific `data-test` attributes (such as `[data-test="payment-success-message"]`) and filtered locators so old toast popups are ignored.
  * Replaced the Russian text locators in `password-reset.page.ts` with the actual English UI strings and `data-test` selectors.

---

## Running Tests & Commands Used

The following commands were used while running and debugging the tests:

* `npx playwright test` - standard test run.
* `npm run test:chrome` (with the `--project=chromium` flag) - runs tests specifically in Chrome.

Debugging was done using **Playwright Trace Viewer** to step through the DOM tree and check how locators resolved (especially when catching the issue with the greedy regex on the product cards).