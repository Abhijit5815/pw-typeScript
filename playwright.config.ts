import { defineConfig, devices } from '@playwright/test';
import { test, TestOptions } from './test-options'; // Import the custom test with options
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only Now set to 1*/
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
     baseURL: 'http://localhost:4200',
     autowaiturl: 'http://uitestingplayground.com/ajax', // Default value for autowaiturl, can be overridden in tests

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //video:'on', // record video for each test
    video:{
      mode: 'retain-on-failure', // record video only for failed tests
      size: { width: 1920, height: 1080 }, // set video size
    },
    screenshot: 'only-on-failure', // take screenshot only on failure
    //headless: false, // run tests in headful mode
    viewport: { width: 1280, height: 720 }, // set viewport
    //ignoreHTTPSErrors: true, // ignore HTTPS errors
    //locale: 'en-US', // set locale
    //timezoneId: 'America/New_York', // set timezone
  },

  /* Configure projects for major browsers */
  projects: [


    {
      name: 'Dev',
      use: { ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200', // Override base URL for this project
        //video: { mode: 'retain-on-failure' }, // record video only for failed tests
        //screenshot: { mode: 'only-on-failure' }, // take screenshot only on failure
        //headless: false, // run tests in headful mode
        //viewport: { width: 1280, height: 720 }, // set viewport
        //ignoreHTTPSErrors: true, // ignore HTTPS errors
        //locale: 'en-US', // set locale
        //timezoneId: 'America/New_York', // set timezone
       },
      //fullyParallel: true, // run tests in parallel in this project only
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      //fullyParallel: true, // run tests in parallel in this project only
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
