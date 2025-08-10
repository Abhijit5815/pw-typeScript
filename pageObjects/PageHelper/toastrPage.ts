import { Page } from '@playwright/test';
import { ToastrPageLocators } from '../Locators/toastrPage.locator';
import { HelperBase } from './helperBase'; // Importing HelperBase to extend its functionality



export class ToastrPage extends HelperBase {

    //private readonly page: Page; // readonly property for the page and private to restrict access to this class only
    //removed this is already defined in HelperBase
    constructor(page: Page) {
        super(page) // assign the page to the readonly property
    }

    async setDropdown(key: ToastrPageLocators): Promise<void> {

        switch (key) {
            case ToastrPageLocators.PRIMARY: case ToastrPageLocators.SUCCESS:case ToastrPageLocators.INFO: case ToastrPageLocators.WARNING: case ToastrPageLocators.DANGER:
                const toastDropdown = this.page.locator(`div.form-group:has(>label.label:has-text("${ToastrPageLocators.TOAST_TYPE}"))`).locator('nb-select:has(button.select-button)');
                await HelperBase.waitForVisible(toastDropdown);
                await toastDropdown.click();
                const isOpen = (await toastDropdown.getAttribute('class'))?.includes('open') === true;  //? handles null null or false give false
                if (isOpen) {
                    await this.page.locator('ul.option-list > nb-option').getByText(key).click();
                }
                else {
                    const screenshotPath = `screenshots/toastType-dropdown-not-open-${Date.now()}.png`;
                    await this.page.screenshot({ path: screenshotPath });
                    console.error(`Theme dropdown is not open. Cannot select theme: ${key}`);
                    console.error(`Screenshot saved at ${screenshotPath}`);
                    throw new Error(`Dropdown failed to open for theme: ${key}`);
                
                }
                break;

            default:
                throw new Error(`Unhandled locator key: ${key}`);
        }


    }


}
