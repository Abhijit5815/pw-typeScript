// fixtures.ts  ─ central place for all shared fixtures
import { test as Base } from '@playwright/test';
import { Logger } from '../utilities/Logger';
import { HomePageLocators } from '../pageObjects/Locators/homePage.locators';
import { PageManager } from '../pageObjects/PageHelper/PageManager';
import { PopupManager } from '../utilities/PopupManager';

export type TestOptions = {
  logger: Logger;                // ← new fixture
  managerPageFixture: PageManager;
  startNav?: HomePageLocators[];
};

export const test = Base.extend<TestOptions>({
  // ------------- logger (auto for every test) -------------
  logger: [async ({}, use, testInfo) => {
    // show suite name & test title in the logger header
    const log = new Logger(testInfo.title, process.env.LOG_LEVEL as any || 'info');
    log.debug('Logger initialised');
    await use(log);
    log.debug('Logger disposed');
  }, { auto: true }],

  // ------------- page-helper fixture -----------------------
  startNav: [[], { option: true }],

  managerPageFixture: [async ({ page, startNav, logger }, use) => {
    const popupManager = new PopupManager(page);

    logger.info('Navigating to /');
    await page.goto('/');

    const pm = new PageManager(page);

    for (const step of startNav) {
      logger.debug(`Clicking nav step: ${step}`);
      await pm.homepage().click(step);
    }

    await use(pm);

    await popupManager.cleanup();
    logger.info('Teardown complete');
  }, { auto: true }],
});

//// In a test file, you can import everything from one place:
//import { test, expect } from '../fixtures/page-options';  // ← Both from same module

export { expect } from '@playwright/test';

