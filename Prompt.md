# Prompts used for AI generation (Tool: Gemini 3.8 Flash Medium)

**Prompt 1 (Plan Preparation):**
> Give me a plan for creating a test automation framework for an e-commerce site: [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/) using Playwright and TypeScript. It is for Description.md

**Prompt 2 (Prompt Preparation for AI Agent):**
> I have attached lectures file and SIS requirements, so generate me a prompt which I can use to ask Gemini Agent in Antigravity to generate a test automation framework for me. Make it in a such way that the AI agent can understand it well and generate the framework accordingly.

**Prompt 3 (Framework Generation using AI Agent):**
> Act as a QA Automation Engineer. I need to automate 5 test cases for an e-commerce site: [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/) using Playwright and TypeScript.
Please generate the complete project structure and code for the following:
playwright.config.ts to set up the project.
Page Object Model (POM) classes for Login, Registration, Product, Cart, and Password Reset pages.
Five test spec files covering these exact scenarios:
Test 1: Register a new customer.
Test 2: Log in (test both valid credentials 'customer@practicesoftwaretesting.com' / 'welcome01' and invalid ones).
Test 3: Add a product to the cart and complete the full checkout process.
Test 4: Open two different products, capture their names and prices, and compare them.
Test 5: Reset password (test both valid and invalid email flows).
Please write all the code needed to run these tests, including how to handle test data.