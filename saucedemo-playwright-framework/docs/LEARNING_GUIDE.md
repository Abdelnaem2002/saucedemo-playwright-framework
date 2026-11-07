# Learning Guide: how every part of this project works

Read this alongside the code. Each section answers: **what**, **why**, **how**, a **practical example**, **common mistakes**, and **how to extend**.

---

## 1. `playwright.config.ts`: the control panel

**What:** One file that tells Playwright where tests are, which browsers to use, and what evidence to keep.
**Why:** Settings live in one place, so tests stay clean.
**How it works (key lines):**
- `testDir: './tests'`: where to look for `*.spec.ts` files.
- `baseURL`: lets tests write `page.goto('/cart.html')` instead of the full address.
- `testIdAttribute: 'data-test'`: makes `getByTestId('error')` look for `data-test="error"`, which is what SauceDemo uses.
- `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, `trace: 'retain-on-failure'`: evidence is saved only when a test fails.
- `projects`: one entry per browser. Each test runs once per project (44 tests × 3 = 132 runs).
- `retries` / `workers` / `forbidOnly`: stricter in CI (`process.env.CI` is set by GitHub Actions).

**Common mistakes:** committing `test.only` (CI blocks it via `forbidOnly`); raising timeouts globally to hide flaky tests.
**Extend:** add `{ name: 'mobile', use: { ...devices['iPhone 13'] } }` to `projects`.

---

## 2. Page Object Model (`pages/`)

**What:** One class per page, holding locators (how to find elements) and actions (what a user can do).
**Why:** If a locator changes, you fix it in one place. Tests read like plain English.
**How:**
```ts
// pages/LoginPage.ts
async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}
```
```ts
// tests/auth/login.spec.ts
await loginPage.login(users.standard.username, users.standard.password);
```
- `BasePage` holds what every logged-in page shares (menu, cart badge). `InventoryPage`, `CartPage`, `CheckoutPage` **extend** it, so there is no duplicated code.
- Page objects contain *page-state* assertions (`expectLoaded`, `expectError`). Tests decide *what* to verify; page objects know *how*.

**Common mistakes:** putting `expect` logic for business rules in page objects; creating one giant page class; using hard-coded waits inside page methods.
**Extend:** new page → new class in `pages/` extending `BasePage`, then register it in `fixtures/test-fixtures.ts`.

---

## 3. Locators: finding elements reliably

Order of preference used in this project:
1. `getByRole('button', { name: 'Login' })`: how users and screen readers see the page.
2. `getByPlaceholder('Username')`, `getByText(...)`: visible text.
3. `getByTestId('error')`: dedicated test attributes (`data-test`), the most stable.

Avoided: long CSS/XPath chains such as `div > div:nth-child(3) > button`, which break whenever the layout changes.

**Practical example:** to click "Add to cart" on one product, we first narrow to that product's card:
```ts
this.items.filter({ hasText: productName }).getByRole('button', { name: 'Add to cart' })
```
**Common mistake:** a locator that matches several elements causes a "strict mode violation". Make it more specific or use `.filter()`.

---

## 4. Auto-waiting and assertions (no hard waits)

**What:** Playwright automatically waits for an element to be visible and enabled before clicking or typing. `expect(locator)` assertions retry until they pass or time out.
**Why:** Fixed pauses (`waitForTimeout(3000)`) make tests slow *and* flaky. This project contains **none**.
**Example of waiting for a result correctly:**
```ts
await inventory.sortBy('Price (low to high)');
await expect(inventory.productPrices).toHaveText(expectedPrices); // retries until the list re-orders
```
**Common mistake:** reading values immediately after an action (`allTextContents()`) and asserting on them: that read does *not* retry. Prefer `await expect(locator).toHaveText([...])`. (We read values only *before* the action to compute expected data.)

---

## 5. Fixtures (`fixtures/test-fixtures.ts`)

**What:** Reusable setup that Playwright injects into a test by name.
**Why:** Avoids repeating `new LoginPage(page)` and the login steps in every test.
**How:**
```ts
test('TC-FUNC-001: ...', async ({ loggedInInventoryPage }) => {
  await loggedInInventoryPage.addToCart(products.backpack);
```
`loggedInInventoryPage` opens the site, logs in and verifies the Products page *before* the test body runs. Each test gets a fresh browser context, so tests do not affect each other.
**Common mistake:** importing `test` from `@playwright/test` instead of from `fixtures/test-fixtures`: custom fixtures would then be undefined.
**Extend:** add a fixture such as `cartWithBackpack` that logs in and adds an item.

---

## 6. Test data (`test-data/`)

**What:** Users, product names, expected messages and customers in typed constants.
**Why:** One place to edit when data or wording changes; tests stay readable; no secrets inside tests.
**Security note:** the demo password comes from `process.env.SAUCE_PASSWORD` with the public demo value as fallback. For a real application, never commit real credentials: use environment variables locally and GitHub **Secrets** in CI.

---

## 7. Data-driven tests (boundary tests)

```ts
for (const { id, name, username, password } of rejectedInputs) {
  test(`${id}: ${name} is rejected`, async ({ loginPage }) => { ... });
}
```
**What:** One test body, many data rows; each row becomes its own reported test.
**Why:** Seven boundary scenarios with no copy-pasted code.
**Extend:** add a row to the array: a new test appears automatically.
**Common mistake:** duplicate titles inside one file: Playwright fails with a "duplicate test title" error, which is why every row has a unique ID.

---

## 8. Test design: positive, negative, boundary

- **Positive:** the happy path works (valid login, complete checkout).
- **Negative:** the app rejects wrong behaviour with a clear message (wrong password, empty fields, direct URL access without login).
- **Boundary:** limits and unusual input (1 char, 255 chars, 1000 chars, special characters, spaces, upper-case).
Boundary tests for checkout record what the app *currently* does. In real projects the expected result comes from the requirements; if limits are unclear, raise a question with the BA/developer: that is a valuable QA skill.

---

## 9. Reports and debugging

| Artifact | Where | When to use |
|---|---|---|
| HTML report | `npm run report` | Overview: filter by status, open a failed test |
| Screenshot | in the report / `test-results/` | See the screen at failure time |
| Video | `test-results/<test>/video.webm` | See what happened before failure |
| Trace | `npx playwright show-trace test-results/<test>/trace.zip` | Best tool: timeline, DOM snapshots, network, console |
| Markdown summary | `npm run report:summary` → `docs/TEST_EXECUTION_REPORT.md` | Share ID / Status / Actual Result |

**How to debug a failing test:** read the error message → open the trace → find the failing step → compare *expected vs received* → check whether it is a test problem (wrong locator/expectation) or an application bug. Re-run one test with `npx playwright test -g "TC-AUTH-003" --headed`, or `--debug`.

---

## 10. CI with GitHub Actions

`.github/workflows/playwright.yml` runs on each push/PR: `npm ci` (exact versions from `package-lock.json`) → typecheck → install browsers → tests → upload report. Artifacts are uploaded `if: always()` so you can inspect failures.
**Common mistakes:** forgetting to commit `package-lock.json` (`npm ci` fails); forgetting `playwright install --with-deps` (browsers missing).

---

## 11. Common beginner mistakes checklist

1. Using `waitForTimeout`: use auto-waiting and `expect`.
2. Fragile locators (`nth-child`, long XPath).
3. Tests that depend on each other's order or state.
4. Asserting nothing (a test that only clicks proves nothing).
5. Hard-coding data and URLs inside tests.
6. Ignoring flaky tests instead of finding the cause.
7. Committing secrets or `node_modules`.
