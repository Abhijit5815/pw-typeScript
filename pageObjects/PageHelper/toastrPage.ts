import { Page, expect, Locator } from '@playwright/test';
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
            case ToastrPageLocators.PRIMARY: case ToastrPageLocators.SUCCESS: case ToastrPageLocators.INFO: case ToastrPageLocators.WARNING: case ToastrPageLocators.DANGER:
                const toastDropdown = this.page.locator(`div.form-group:has(>label.label:has-text("${ToastrPageLocators.TOAST_TYPE}"))`).locator('nb-select:has(button.select-button)');
                await HelperBase.waitForVisible(toastDropdown);
                await toastDropdown.click();
                const isOpen = (await toastDropdown.getAttribute('class'))?.includes('open') === true;  //? handles null null or false give false
                if (isOpen) {
                    await this.page.locator('ul.option-list > nb-option').getByText(key).click();
                    await expect(toastDropdown).toHaveAttribute('ng-reflect-selected', key);
                    HelperBase.log(`Correct selection ${key} is set`);
                }
                else {
                    const screenshotPath = `screenshots/toastType-dropdown-not-open-${Date.now()}.png`;
                    const message = `Dropdown failed to open for theme: ${key}`;
                    await this.page.screenshot({ path: screenshotPath });
                    console.error(`${message}. Screenshot saved at ${screenshotPath}`);
                    throw new Error(message);
                }
                break;

            default:
                throw new Error(`Unhandled locator key: ${key}`);
        }


    }

    async checkUncheckCheckbox(key: ToastrPageLocators, check: boolean): Promise<void> {

        switch (key) {
            case ToastrPageLocators.PREVENT_DUPLICATE_TOAST:case ToastrPageLocators.HIDE_ON_CLICK:case ToastrPageLocators.SHOW_TOAST_WITH_ICON:
                const checkbox = this.page.locator(`label:has(> span:has-text("${key}")) > span.custom-checkbox`);
                await HelperBase.waitForVisible(checkbox,10);
                const isChecked2=await checkbox.isChecked();
                const isChecked = (await checkbox.getAttribute('class'))?.includes('checked') === true; 
                console.log(isChecked +""+ isChecked2);
                // Click only if needed
                if (check && !isChecked) {
                    await checkbox.check();
                } else if (!check && isChecked) {
                    await checkbox.uncheck();
                }

                // Verify final state
                const finalState = (await checkbox.getAttribute('class'))?.includes('checked') === true;

                if (finalState === true) {
                    HelperBase.log(`✅ Checkbox "${key}" is now ${check ? 'checked' : 'unchecked'}`);
                } else {
                    const screenshotPath = `screenshots/${key}-checkbox-fail-${Date.now()}.png`;
                    const message = `❌ Checkbox "${key}" could not be set to ${check ? 'checked' : 'unchecked'}`;
                    await this.page.screenshot({ path: screenshotPath });
                    console.error(`${message}. Screenshot saved at ${screenshotPath}`);
                    throw new Error(message);
                }
        }

    }



}


