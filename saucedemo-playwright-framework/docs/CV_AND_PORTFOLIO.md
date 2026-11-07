# Presenting this project on your CV and GitHub

## GitHub repository
- **Name:** `saucedemo-playwright-framework`
- **Description (one line):** "UI test automation framework for an e-commerce demo using Playwright, TypeScript, Page Object Model and GitHub Actions."
- **Topics:** `playwright`, `typescript`, `test-automation`, `qa`, `page-object-model`, `github-actions`, `e2e-testing`
- Replace every `YOUR_...` placeholder in `README.md`, push, and make sure the **Actions** badge is green.
- Pin the repository on your GitHub profile.
- Optional: publish the HTML report to GitHub Pages and link it in the README.

## CV: project entry (example)
**Web UI Test Automation Framework | Playwright, TypeScript, GitHub Actions**
- Designed and built an end-to-end automation framework using the Page Object Model and custom fixtures.
- Implemented 44 positive, negative and boundary test cases (login, form validation, cart, sorting, access control) across Chromium, Firefox and WebKit.
- Configured HTML reporting with screenshots, video and traces on failure, and a CI pipeline in GitHub Actions that runs on every push and pull request.
- Documented test cases with IDs, preconditions, steps and expected results.

*Only write numbers (tests count, pass rate) that you have verified from your own run.*

## Skills line
Playwright, TypeScript, Page Object Model, Test Design (positive / negative / boundary), CI/CD (GitHub Actions), HTML reporting and trace debugging, Git/GitHub.

## Interview talking points
- Why POM and fixtures? (maintainability, no duplication)
- How do you avoid flaky tests? (auto-waiting, web-first assertions, independent tests, stable locators)
- How did you choose locators? (role > text > test id; no brittle XPath)
- How do you debug a CI failure? (download the trace artifact, open it with `show-trace`)
- What would you improve next? (storageState login, accessibility checks, visual tests)
