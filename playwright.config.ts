import { defineConfig, devices } from '@playwright/test';
import { test, TestOptions } from './test-options'; // Import the custom test with options

require('dotenv').config(); // Load environment variables from .env file
//Global configuration for Playwright tests
export default defineConfig<TestOptions>({
  retries:1,
  reporter: 'html',

  //Global runtime settings
  use: {
    baseURL: process.env.DEV==='1' ? 'http://localhost:4200'   //For CLI DEV=1 npx playwright test autoWait.spec.ts --project=chromium
          : process.env.STAGING === '1' ? 'http://staging.example.com' 
          : 'http://localhost:4200', // Default base URL if neither DEV nor STAGING is set
    autowaiturl: 'http://uitestingplayground.com/ajax', // Default value for autowaiturl, can be overridden in tests
    trace: 'on-first-retry',
    actionTimeout: 20000, // Set default action timeout to 30 seconds
    navigationTimeout: 20000, // Set default navigation timeout to 30 seconds
    video:{
      mode: 'off', 
      size: { width: 1920, height: 1080 }, // set video size
    },
    screenshot: 'only-on-failure', // take screenshot only on failure
    //headless: false, // run tests in headful mode
    viewport: { width: 1280, height: 720 }, // set viewport
  },


  //local section for test options
  projects: [

    {
      name: 'Dev',
      use: {// ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200', // Override base URL for this project
        //video: { mode: 'retain-on-failure' }, // record video only for failed tests
        //screenshot: { mode: 'only-on-failure' }, // take screenshot only on failure
        //headless: false, // run tests in headful mode
        //viewport: { width: 1280, height: 720 }, // set viewport
        //ignoreHTTPSErrors: true, // ignore HTTPS errors
        //locale: 'en-US', // set locale
        //timezoneId: 'America/New_York', // set timezone
       },
    },
    {
      name: 'chromium',
     // use: { ...devices['Desktop Chrome'] },  //as chromium is the default browser, this can be omitted
      //fullyParallel: true, // run tests in parallel in this project only
    },

    {
      name: 'firefox',
      use: {
         browserName:'firefox' 
        },
    },
    {
      name:'autoWaitScreen',
      testMatch: /.*autoWait\.spec\.ts/, // Run only the autoWait.spec.ts test file 
      use:{
      viewport: { width: 1920, height: 1080 }, // set viewport for this project
     }
    }

  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
