import {test as Base} from '@playwright/test';
import { HomePageLocators } from '../pw-typeScript/pageObjects/Locators/homePage.locators';
import { PageManager } from '../pw-typeScript/pageObjects/PageHelper/PageManager';
import { PopupManager } from '../pw-typeScript/utilities/PopupManager';

export type TestOptions = {
    managerPageFixture: PageManager; 
    startNav?: HomePageLocators[];
}

export const test = Base.extend<TestOptions>({
    startNav: [[], { option: true }],
    
    managerPageFixture: [
        async ({ page, startNav }, use) => {
            // Automatic popup killer with built-in smart defaults
             const popupManager = new PopupManager(page);

            // Navigate to the home page
            await page.goto('/');
            const pm = new PageManager(page);
            
            // Click through the provided navigation path
            for (const navStep of startNav) {
                await pm.homepage().click(navStep);
            }
            
            // Pass the PageManager instance to the test
            await use(pm);
            
            // Teardown
            await popupManager.cleanup();
            console.log('Test completed Teardown, cleaning up...');
        },
        { auto: true }
    ]
});

/*
{ page, startNav } — Playwright automatically injects the default page fixture and your custom startNav from Step 1.

await use(pm) — The use call hands the constructed PageManager to your test function before the test runs.

{ auto: true } — This means the fixture runs automatically for every test without explicitly including it as a parameter.

PopupManager runs silently in background - unwanted popups get closed automatically, important ones stay open.
*/
