# Playwright TypeScript E2E Testing Project

This repository contains end-to-end (E2E) tests for an Angular application using [Playwright](https://playwright.dev/) and TypeScript. It supports local and Docker-based test execution, integrates with CI/CD via GitHub Actions, and generates rich test reports.

## Project Structure

- `angular-app/` - The Angular application under test (cloned or built via setup).
- `pageObjects/` - Page Object Model classes and locators for maintainable tests.
- `tests/` - Playwright test specs, including learning examples and advanced scenarios.
- `config/` - Test parameter files.
- `.github/workflows/` - GitHub Actions CI/CD workflows.
- `Dockerfile`, `docker-compose.yml` - Docker setup for running tests in containers.
- `playwright.config.ts` - Playwright configuration (multi-project, Docker-aware).
- `package.json` - NPM scripts for running tests locally or in Docker.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (for containerized runs)

### Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd pw-typeScript
   ```

2. **Install dependencies:**
   ```sh
   npm ci
   ```

3. **Set up the Angular app:**
   ```sh
   npm run setup
   ```
   This clones or updates the Angular app in `angular-app/`.

### Running Tests Locally

- **Run all tests (Chromium):**
  ```sh
  npm run pageObjects-chrome
  ```

- **Run smoke tests:**
  ```sh
  npm run smoke-tests-local
  ```

- **Run specific test:**
  ```sh
  npx playwright test tests/formsLayoutTest.spec.ts --project=chromium
  ```

### Running Tests in Docker

1. **Build Docker images:**
   ```sh
   npm run docker:build
   ```

2. **Start Angular app container:**
   ```sh
   npm run docker:up
   ```

3. **Run Playwright tests in Docker:**
   ```sh
   npm run docker:test
   ```

4. **Run smoke tests in Docker:**
   ```sh
   npm run docker:smoke-test
   ```

5. **Full test cycle (up, test, down):**
   ```sh
   npm run docker:smoke-and-cleanup
   ```

### Test Reports

- **Playwright HTML report:**  
  After running tests, open `playwright-report/index.html` in your browser.
- **Allure report:**  
  Generated in `allure-report/` and `allure-results/`.

### Continuous Integration

- GitHub Actions workflows are defined in [`.github/workflows/`](.github/workflows/) for automated test runs on push and PRs.

## Customization

- **Test configuration:**  
  See [`playwright.config.ts`](playwright.config.ts) and [`playwrightprod.config.ts`](playwrightprod.config.ts).
- **Page Objects:**  
  Located in [`pageObjects/`](pageObjects/).
- **Environment variables:**  
  Use `.env` for custom settings (e.g., `BASE_URL`).

## Useful NPM Scripts

See [`package.json`](package.json) for all available scripts.

## License

This project is licensed under the ISC License.
