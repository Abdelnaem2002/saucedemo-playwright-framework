# Git commands to publish the project

```bash
# 1. In the project folder
git init
git branch -M main
git add .
git status                      # check: node_modules/, test-results/, playwright-report/ must NOT be listed
git commit -m "Add Playwright TypeScript automation framework for SauceDemo"

# 2. Create an EMPTY repository on GitHub (no README), then:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/saucedemo-playwright-framework.git
git push -u origin main
```

Later changes:
```bash
git add .
git commit -m "Describe your change"
git push
```

After the first push, open the repository's **Actions** tab to see the pipeline run.
