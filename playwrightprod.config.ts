import { defineConfig, devices } from '@playwright/test';
import { test, TestOptions } from './test-options'; // Import the custom test with options

require('dotenv').config(); 

export default defineConfig<TestOptions>({
  
  // to run tests using this config file use the commmand npx playwright test --config=playwrightprod.config.ts
  //Global runtime settings
  use: {
    baseURL: process.env.DEV==='1' ? 'http://localhost:4200'   //For CLI DEV=1 npx playwright test autoWait.spec.ts --project=chromium
          : process.env.STAGING === '1' ? 'http://staging.example.com' 
          : 'http://localhost:4200', 
    autowaiturl: 'http://uitestingplayground.com/ajax', 
    },
    

  //local section for test options
  projects: [
    {
      name: 'chromium',
    },

    {
      name:'autoWaitScreen',
      testMatch: /.*autoWait\.spec\.ts/, // Run only the autoWait.spec.ts test file 
      use:{
      viewport: { width: 1920, height: 1080 }, // set viewport for this project
     }
    }

  ],

});
