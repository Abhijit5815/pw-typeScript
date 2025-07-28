import {Page,expect} from '@playwright/test';

class FormLayout {
    
    readonly page: Page;

    constructor(page: Page) {
        this.page = page; // assign the page to the readonly property
    }

    async fillEmail(email: string) {
        const emailInput = this.page.locator('input#inputEmail1[placeholder="Email"].shape-rectangle');
        await emailInput.fill(email);
    }

    async clickSignIn() {
        await this.page.getByTestId('SignInGrid').click();
    }

    async fillName(name: string) {
        await this.page.getByPlaceholder('Jane Doe').fill(name);
    }
}