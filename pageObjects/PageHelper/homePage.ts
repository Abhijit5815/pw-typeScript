import { Page } from '@playwright/test';
import { HomePageLocators } from '../Locators/homePage.locators';
import { error } from 'console';    
import { HelperBase } from './helperBase'; // Importing HelperBase to extend its functionality

export class HomePage extends HelperBase{

    //private readonly page: Page; // readonly property for the page and private to restrict access to this class only
        //removed this is already defined in HelperBase
    constructor(page: Page) {
        super(page); // assign the page to the readonly property   
    }


    async click(key: HomePageLocators): Promise<void> {
        switch (key) {
            case HomePageLocators.Forms:
            case HomePageLocators.ModalAndOverlays:
            case HomePageLocators.TablesAndData:    
                await this.selectNavMenuPageItem(key);
                break;
            case HomePageLocators.FormLayout:
            case HomePageLocators.Datepicker:
            case HomePageLocators.Toastr:
            case HomePageLocators.Tooltip:
            case HomePageLocators.SmartTable:    
                await this.page.getByText(key).click();
                break;
            default:
                throw new Error(`Unhandled locator key in HomePage class Click: ${key}`);
        }
    }

 
    async setThemeDropdown(key: HomePageLocators): Promise<void> {

        let themeDropdown = this.page.locator('nb-select[ng-reflect-selected="default"]');

        await themeDropdown.click(); // Click on the theme dropdown to open it
        let classList = await themeDropdown.getAttribute('class');
        let isOpen = classList?.includes('open');

        // Select the theme based on the provided key
        // This assumes that the themes are listed as options in the dropdown
        if (isOpen) {
            await this.page.locator('ul.option-list > nb-option').getByText(key).click();
        }
        else {
            const screenshotPath = `screenshots/theme-dropdown-not-open-${Date.now()}.png`;
            await this.page.screenshot({ path: screenshotPath });

            console.error(`Theme dropdown is not open. Cannot select theme: ${key}`);
            console.error(`Screenshot saved at ${screenshotPath}`);
            throw new Error(`Dropdown failed to open for theme: ${key}`);
            /*- console.error() just reports the issue — helpful during development, but it won’t fail your test.
            - throw new Error() is a formal failure signal, stopping execution and allowing your test runner (e.g. Jest, Playwright Test, Mocha) to catch and report it as a failed step.
            */

        }
    }

    /**
     * 
     * @param name - The name of the menu item to select.
     * This function checks if the menu item is visible and not expanded before clicking it.
     */
    private async selectNavMenuPageItem(name: string): Promise<void> { // :Promise<void> specifies that this function returns a Promise that resolves to void not mandatory
        const navMenuItem = this.page.getByTitle(name);
        const isVisible = await navMenuItem.isVisible();
        const isRawExpanded = await navMenuItem.getAttribute('aria-expanded');
        const isExpanded = isRawExpanded === 'true';

        if (isVisible && !isExpanded) {
            await navMenuItem.click();
        }
    }

}