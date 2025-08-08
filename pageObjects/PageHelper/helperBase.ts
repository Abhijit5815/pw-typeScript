import { Page } from "@playwright/test";


export class HelperBase{

readonly page: Page;

constructor(page: Page) {
    this.page = page; // assign the page to the readonly property   
    
}


async waitforNumberoFSeconds(timeInseconds: number): Promise<void> {
    await this.page.waitForTimeout(timeInseconds * 1000); // wait for the specified number of seconds
    }

}