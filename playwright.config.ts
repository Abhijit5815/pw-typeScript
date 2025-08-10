import { defineConfig, devices } from '@playwright/test';
import { test, TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions>({
  retries: 1,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/json-Report.json' }],
    ['junit', { outputFile: 'test-results/junit-Report.xml' }],
    ['allure-playwright']
  ],

  // Global runtime settings
  use: {
    // Docker-aware baseURL with fallback logic
    baseURL: process.env.BASE_URL || 
             (process.env.DEV === '1' ? 'http://localhost:4200' 
             : process.env.STAGING === '1' ? 'http://staging.example.com' 
             : 'http://localhost:4200'),
    
    autowaiturl: 'http://uitestingplayground.com/ajax',
    trace: 'on-first-retry',
    actionTimeout: 20000,
    navigationTimeout: 20000,
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 },
    },
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'Dev',
      use: {
        baseURL: 'http://localhost:4200',
      },
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Will inherit the global baseURL (Docker-aware)
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        // Will inherit the global baseURL (Docker-aware)
      },
    },
    // New Docker-specific project
    {
      name: 'docker-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL || 'http://localhost:4200',
        // Optimized for Docker container execution
        actionTimeout: 60000,      // Increased from 30s to 60s
        navigationTimeout: 60000,  // Increased from 30s to 60s
      },
    },
    {
      name: 'autoWaitScreen',
      testMatch: /.*autoWait\.spec\.ts/,
      use: {
        viewport: { width: 1920, height: 1080 },
      }
    },
    {
      name: 'mobile',
      testMatch: /.*testMobile\.spec\.ts/,
      use: {
        ...devices['iPhone 11'],
        headless: false,
        navigationTimeout: 90000,
        actionTimeout: 60000,
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



