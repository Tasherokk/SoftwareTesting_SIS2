# My Plan
1. First generate a plan for this task using AI and check if it is good.
2. After that prepare a prompt for AI agent (Antigravity) to generate the test automation framework.
3. Give that prompt to agent, run the code, check if it is working, and push to repo and commit like "AI Agent work".
4. Review the generated code and fix any issues according to provided material by professor, after that commit like "Final Result with my fixes".
5. Then write Review.md file to explain the generated code and the improvements I made.

> Below is generated plan of implementation:

# Project Description: E-commerce Test Automation

## Overview
The objective of this project is to build a robust, scalable, and independent automated test suite for the `https://practicesoftwaretesting.com/` e-commerce platform using **Playwright** and **TypeScript**. 

The project strictly adheres to modern automation best practices:
- **Page Object Model (POM)** for structural encapsulation.
- **Web-First Assertions** (auto-waiting) instead of hardcoded timeouts or flaky wait states.
- **Global Authentication** to optimize test execution speed and isolate dependencies.
- **Dynamic Data Generation** using Faker.js for isolated test runs.
- Avoidance of brittle CSS selectors in favor of resilient `data-test` and role-based locators.

## List of Test Cases (TCs) Automated

Here is the detailed list of the 5 Test Cases implemented in this suite:

### TC 1: Register a new customer
- **Description:** Verifies that a user can successfully create a new account.
- **Implementation:** Uses `Faker.js` to generate unique customer data per run to avoid database collisions. Submits the registration form and asserts that the application redirects the user to the login page upon success.

### TC 2: Log in
- **Description:** Verifies the authentication mechanism for both valid and invalid credentials.
- **Implementation:** 
  - *Positive scenario:* Uses the pre-seeded account (`customer2@practicesoftwaretesting.com`) to log in and asserts successful navigation to the account page.
  - *Negative scenario:* Submits incorrect credentials and asserts that the appropriate "invalid email or password" error message is visible.

### TC 3: Buy a product
- **Description:** Tests the complete end-to-end (E2E) shopping cart and checkout flow.
- **Implementation:** Utilizes Global Setup to start the test already authenticated. Navigates to a product, adds it to the cart, verifies the cart reflects the correct item, proceeds through the multi-step checkout (billing/payment), and asserts the final success confirmation.

### TC 4: Compare two products
- **Description:** Verifies the catalog navigation and data extraction capabilities (SPA handling).
- **Implementation:** Navigates to the first product, extracts its name and price. Navigates back to the home page using UI elements (ensuring proper SPA state waiting), opens a second product, extracts its details, and runs logical assertions to compare their names and prices.

### TC 5: Reset a password
- **Description:** Tests the "forgot password" functionality.
- **Implementation:** 
  - *Negative scenario:* Submits an invalid email string and expects a validation error.
  - *Positive scenario:* Submits a valid seeded email address and asserts that the confirmation alert (or corresponding translation key `page.forgot-password.confirm`) is displayed.