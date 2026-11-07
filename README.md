# SauceDemo Web Automation Framework (Playwright + TypeScript)

![Playwright Tests](https://github.com/YOUR_GITHUB_USERNAME/saucedemo-playwright-framework/actions/workflows/playwright.yml/badge.svg)

## 1. Project Overview

An end-to-end UI test automation framework for the public demo shop [SauceDemo](https://www.saucedemo.com), built with **Playwright**, **TypeScript** and the **Page Object Model**. It contains 44 test cases (positive, negative and boundary) that run on Chromium, Firefox and WebKit, produce an HTML report with screenshots, videos and traces for failures, and run automatically in GitHub Actions.

## 2. Project Objectives

- Demonstrate a clean, maintainable automation framework structured like a real QA project.
- Cover positive, negative and boundary scenarios for login, navigation, forms and cart behaviour.
- Apply best practices: Page Object Model, fixtures, auto-waiting, web-first assertions, no hard waits.
- Provide debugging evidence (HTML report, screenshots, video, trace) and CI/CD integration.

## 3. Technologies Used

| Tool | Purpose |
|---|---|
| Playwright Test | Browser automation and test runner |
| TypeScript | Typed, maintainable test code |
| Node.js 18+ | Runtime |
| Page Object Model | Separates page logic from test logic |
| Playwright HTML reporter | Human-readable results |
| GitHub Actions | Continuous integration |
| tsx | Runs the report-summary script |

## 4. Application Under Test

**SauceDemo** - `https://www.saucedemo.com` (a public site maintained by Sauce Labs for practice).

| Feature | Available | Covered |
|---|---|---|
| Login / Logout | Yes | Yes |
| Form validation (checkout) | Yes | Yes |
| Sorting (filter) | Yes | Yes |
| Add / remove cart items | Yes | Yes |
| Navigation | Yes | Yes |
| User registration | **No** | - |
| Text search | **No** | - |

Demo credentials (`standard_user`, `locked_out_user`, password `secret_sauce`) are published on the site's login page. They are not secrets, but the password can be overridden with the `SAUCE_PASSWORD` environment variable.

## 5. Project Folder Structure

```
.
├── .github/workflows/playwright.yml   # CI pipeline
├── docs/                              # Test cases, learning guide, CV tips
├── fixtures/test-fixtures.ts          # Page objects + "already logged in" fixture
├── pages/                             # Page Object Model classes
│   ├── BasePage.ts                    # Header, menu, cart badge (shared)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts               # Product list (the app's home page)
│   ├── ProductDetailsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/                         # Users, products, messages, customers
├── tests/
│   ├── auth/                          # Login, logout, unauthorized access, login boundaries
│   ├── navigation/
│   ├── forms/                         # Checkout form validation and boundaries
│   └── functional/                    # Cart and sorting
├── utils/                             # Price helpers + Markdown report generator
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

Improvements over a basic layout: `HomePage` is named `InventoryPage` because that is what the application calls it; a `BasePage` removes duplicated header/menu code; and `fixtures/` provides a reusable logged-in state.

## 6. Installation Requirements

- Node.js 18 or newer (`node -v`)
- npm (bundled with Node)
- Git
- Internet access (the tests run against the live demo site)

## 7. Installation Instructions

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/saucedemo-playwright-framework.git
cd saucedemo-playwright-framework
npm ci
npx playwright install --with-deps    # or: npm run install:browsers
```

## 8. How to Run Tests

```bash
npm test                 # all tests, all browsers, headless
npm run test:smoke       # only tests tagged @smoke
npm run test:auth        # a folder: auth | navigation | forms | functional
```

## 9. How to Run Specific Tests

```bash
npx playwright test tests/auth/login.spec.ts              # one file
npx playwright test -g "TC-AUTH-003"                      # one test by ID
npx playwright test -g "TC-BND"                           # all boundary tests
npx playwright test tests/auth/login.spec.ts:12           # test at line 12
```

## 10. Headed and Headless Modes

```bash
npm test                  # headless (default, used in CI)
npm run test:headed       # visible browser
npm run test:ui           # Playwright UI mode (watch, time-travel debugging)
npm run test:debug        # step-by-step Playwright Inspector
```

## 11. Different Browsers

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
npx playwright test --project=chromium --project=firefox   # several at once
```

## 12. HTML Reports

```bash
npm test
npm run report            # opens playwright-report/index.html
```

In the report: filter by Passed / Failed / Flaky / Skipped, click a test to see each step, error message, screenshot, video and trace. A Markdown summary with Test Case ID, Status and Actual Result is generated with:

```bash
npm run report:summary    # writes docs/TEST_EXECUTION_REPORT.md
```

## 13. Screenshots, Videos and Traces

Configured in `playwright.config.ts` (`only-on-failure` / `retain-on-failure`), so only failed tests keep artifacts in `test-results/`.

To investigate a failure:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

The trace viewer shows a timeline with DOM snapshots before/after each action, network calls and console logs. You can also drag `trace.zip` onto https://trace.playwright.dev.

## 14. Test Scenarios Covered

| Type | Examples | IDs |
|---|---|---|
| Positive | Valid login, logout, add to cart, full checkout, sorting | TC-AUTH-001/002, TC-FORM-001, TC-FUNC-* |
| Negative | Wrong credentials, empty fields, locked-out user, unauthorized URL access, empty checkout fields | TC-AUTH-003..012, TC-FORM-002..004 |
| Boundary | 1000-char inputs, 255-char inputs, 1-char inputs, special characters, case sensitivity, padded spaces | TC-BND-001..010 |
| Navigation | Menu, cart, product details, back links | TC-NAV-001..006 |

## 15. Test Cases Documentation

Every test has an ID in its title (e.g. `TC-AUTH-003: wrong password shows an error`). Scenario, preconditions, steps and expected results for all 44 cases are in [`docs/TEST_CASES.md`](docs/TEST_CASES.md). Actual Result and Pass/Fail Status are recorded per execution by `npm run report:summary` and in the HTML report.

## 16. Page Object Model Explanation

Each page of the application has a class that owns its **locators** and **actions**. Tests only describe *what* a user does:

```ts
await loginPage.login(users.standard.username, users.standard.password);
await inventoryPage.expectLoaded();
```

If the login button changes, you update `LoginPage.ts` once instead of every test. Assertions about page state (`expectLoaded`, `expectError`) live in page objects; business-level assertions stay in the tests. See [`docs/LEARNING_GUIDE.md`](docs/LEARNING_GUIDE.md) for a detailed walkthrough.

## 17. GitHub Actions / CI Integration

`.github/workflows/playwright.yml` runs on every push and pull request to `main`/`master`: install → type check → install browsers → run tests → publish a Markdown summary → upload the HTML report and traces as artifacts. To view them: GitHub → **Actions** → select the run → **Artifacts**. In CI, tests retry twice and use 2 workers.

## 18. Known Limitations

- Tests depend on the public SauceDemo site being online; its behaviour may change without notice.
- Boundary tests for checkout document the app's *current* behaviour (it accepts any text); they are not derived from a written specification.
- No registration or search tests, because the app has neither.
- Login is performed through the UI for every test using the logged-in fixture (simple, but slower than reusing a saved session).
- Visual, accessibility, performance and API testing are out of scope.

## 19. Future Improvements

- Reuse authentication with Playwright `storageState` to speed up tests.
- Add accessibility checks (`@axe-core/playwright`).
- Add visual comparison (`toHaveScreenshot`).
- Add tests for other SauceDemo users (`problem_user`, `performance_glitch_user`).
- Publish the HTML report to GitHub Pages.

## 20. Author / Contact

- **Name:** YOUR NAME
- **GitHub:** https://github.com/YOUR_GITHUB_USERNAME
- **LinkedIn:** https://www.linkedin.com/in/YOUR_LINKEDIN_ID
- **Email:** your.email@example.com
