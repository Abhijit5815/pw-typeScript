import { Page } from '@playwright/test';
import { FormsLayoutPageLocators } from '../Locators/formsLayoutPage.locators';
import { HelperBase} from './helperBase'; // Importing HelperBase to extend its functionality

export class FormsLayoutPage extends HelperBase {

    //private readonly page: Page; // readonly property for the page and private to restrict access to this class only
    //removed this is already defined in HelperBase
    constructor(page: Page) {
        super(page) // assign the page to the readonly property
    }

    async setText(key: FormsLayoutPageLocators, value: string): Promise<void> {
        switch (key) {
            case FormsLayoutPageLocators.Email: case FormsLayoutPageLocators.Password:
                await this.page.getByText('Using the Grid').locator('..').locator(`input#${key}`).fill(value);
                break;

            default:
                throw new Error(`Unhandled locator key: ${key}`);
        }
    }

    async click(key: FormsLayoutPageLocators): Promise<void> {
        switch (key) {
            case FormsLayoutPageLocators.Radios:
                await this.page.locator('nb-card', { hasText: 'Using the Grid' }).getByLabel('Option 1').check({ force: true });
                await this.waitforNumberoFSeconds(3); // Wait for 3 seconds to ensure the radio button is checked
                break;
            case FormsLayoutPageLocators.SignInGridButton:
                //await this.page.pause();
                await this.page.locator('button..nb-transition',{hasText:'Sign in'}).click();
                 await this.waitforNumberoFSeconds(3); // Wait for 3 seconds to ensure the button is clicked
                break;
            default:
                throw new Error(`Unhandled locator key: ${key}`);
        }



    }
}
