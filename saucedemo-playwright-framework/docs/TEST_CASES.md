# Test Case Documentation

Format per case: **ID**, **Scenario**, **Preconditions**, **Steps**, **Expected Result**.
**Actual Result** and **Pass/Fail** are produced by each execution: run `npm test && npm run report:summary` and open `docs/TEST_EXECUTION_REPORT.md` (or `npm run report`).

Common precondition **PC-1**: browser open on `https://www.saucedemo.com`, user logged out.
Common precondition **PC-2**: logged in as `standard_user` (done by the `loggedInInventoryPage` fixture).

## Authentication

| ID | Scenario | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-AUTH-001 | Valid login | PC-1 | 1. Enter standard_user / secret_sauce 2. Click Login | Products page opens with 6 products |
| TC-AUTH-002 | Logout | PC-2 | 1. Open menu 2. Click Logout | Login page is shown |
| TC-AUTH-003 | Wrong password | PC-1 | 1. Enter valid username, wrong password 2. Click Login | Error "Username and password do not match any user in this service"; stays on login page |
| TC-AUTH-004 | Unknown username | PC-1 | 1. Enter invalid_user + valid password 2. Click Login | Same "do not match" error |
| TC-AUTH-005 | Both fields empty | PC-1 | 1. Click Login with empty fields | Error "Username is required" |
| TC-AUTH-006 | Empty password | PC-1 | 1. Enter valid username only 2. Click Login | Error "Password is required" |
| TC-AUTH-007 | Locked-out user | PC-1 | 1. Enter locked_out_user + valid password 2. Click Login | Error "Sorry, this user has been locked out."; stays on login page |
| TC-AUTH-008 | Dismiss error | PC-1 | 1. Trigger an error 2. Click the X on the error | Error message disappears |
| TC-AUTH-009 | Direct access to /inventory.html | PC-1 | 1. Open `/inventory.html` directly | Redirected to login with "You can only access '/inventory.html' when you are logged in." |
| TC-AUTH-010 | Direct access to /cart.html | PC-1 | 1. Open `/cart.html` directly | Same, for `/cart.html` |
| TC-AUTH-011 | Direct access to /checkout-step-one.html | PC-1 | 1. Open the URL directly | Same, for `/checkout-step-one.html` |
| TC-AUTH-012 | Access after logout | PC-2 | 1. Log out 2. Open `/inventory.html` | Login page with the unauthorized-access error |

## Navigation

| ID | Scenario | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-NAV-001 | Side menu links | PC-2 | 1. Open menu | All Items, About, Logout, Reset App State visible |
| TC-NAV-002 | Open cart | PC-2 | 1. Click cart icon | "Your Cart" page opens |
| TC-NAV-003 | Product details and back | PC-2 | 1. Click product name 2. Click Back to products | Details page shows the product; back returns to Products |
| TC-NAV-004 | All Items from cart | PC-2, on cart page | 1. Open menu 2. Click All Items | Products page opens |
| TC-NAV-005 | Continue Shopping | PC-2, on cart page | 1. Click Continue Shopping | Products page opens |
| TC-NAV-006 | About link target | PC-2 | 1. Open menu | About link href contains `saucelabs.com` |

## Forms (Checkout)

Common precondition **PC-3**: PC-2 plus Sauce Labs Backpack in cart, on "Checkout: Your Information".

| ID | Scenario | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-FORM-001 | Valid checkout | PC-3 | 1. Fill Jane / Tester / 12345 2. Continue 3. Finish | "Thank you for your order!" |
| TC-FORM-002 | All fields empty | PC-3 | 1. Click Continue | Error "First Name is required"; stays on step one |
| TC-FORM-003 | Missing last name | PC-3 | 1. Fill first name and postal code 2. Continue | Error "Last Name is required" |
| TC-FORM-004 | Missing postal code | PC-3 | 1. Fill first and last name 2. Continue | Error "Postal Code is required" |
| TC-FORM-005 | Cancel checkout | PC-3 | 1. Click Cancel | Cart page opens |

## Functional

| ID | Scenario | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-FUNC-001 | Add one product | PC-2 | 1. Click Add to cart on Backpack | Badge shows 1; button changes to Remove |
| TC-FUNC-002 | Add three products | PC-2 | 1. Add Backpack, Bike Light, Bolt T-Shirt | Badge shows 3 |
| TC-FUNC-003 | Remove from product list | PC-2, 1 item in cart | 1. Click Remove | Badge disappears; button back to Add to cart |
| TC-FUNC-004 | Items appear in cart | PC-2 | 1. Add Backpack and Onesie 2. Open cart | Cart lists exactly those two items |
| TC-FUNC-005 | Remove in cart | PC-2, 2 items in cart | 1. Open cart 2. Remove Backpack | Only Onesie remains; badge shows 1 |
| TC-FUNC-006 | Cart persists across navigation | PC-2 | 1. Add Backpack 2. Open another product 3. Go back | Badge still 1; Backpack shows Remove |
| TC-FUNC-007 | Item total correctness | PC-2 | 1. Add 2 products 2. Checkout, fill valid data, Continue | "Item total" equals the sum of listed prices |
| TC-FUNC-008 | Sort A to Z | PC-2 | 1. Select Z to A 2. Select A to Z | Products in alphabetical order |
| TC-FUNC-009 | Sort Z to A | PC-2 | 1. Select Z to A | Reverse alphabetical order |
| TC-FUNC-010 | Sort price low to high | PC-2 | 1. Select Price (low to high) | Ascending prices |
| TC-FUNC-011 | Sort price high to low | PC-2 | 1. Select Price (high to low) | Descending prices |

## Boundary

| ID | Scenario | Preconditions | Steps | Expected Result |
|---|---|---|---|---|
| TC-BND-001 | 1000-char username | PC-1 | 1. Enter 1000 × "a" + valid password 2. Login | "do not match" error |
| TC-BND-002 | 1000-char password | PC-1 | 1. Valid username + 1000 × "p" 2. Login | "do not match" error |
| TC-BND-003 | HTML tags in username | PC-1 | 1. Enter `<script>alert(1)</script>` + `!@#$%^&*()` 2. Login | "do not match" error; no script executes |
| TC-BND-004 | SQL-injection style input | PC-1 | 1. Enter `' OR '1'='1` in both fields 2. Login | "do not match" error |
| TC-BND-005 | Username padded with spaces | PC-1 | 1. Enter " standard_user " + valid password 2. Login | "do not match" error |
| TC-BND-006 | Upper-case username | PC-1 | 1. Enter STANDARD_USER + valid password 2. Login | "do not match" error (case-sensitive) |
| TC-BND-007 | 1-char credentials | PC-1 | 1. Enter "a" / "b" 2. Login | "do not match" error |
| TC-BND-008 | 1-char checkout fields | PC-3 | 1. Fill A / B / 1 2. Continue | Overview page opens |
| TC-BND-009 | Special characters in checkout | PC-3 | 1. Fill O'Brien-Smith / Ñandú & Co. / #12-A/B 2. Continue | Overview page opens |
| TC-BND-010 | 255-char checkout values | PC-3 | 1. Fill each field with 255 characters 2. Continue | Overview page opens |

> Note: TC-BND-008..010 record the application's observed behaviour (no documented limits). If SauceDemo adds validation, update these expectations.
