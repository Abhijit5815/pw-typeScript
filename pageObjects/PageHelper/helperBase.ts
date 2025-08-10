import { Page } from "@playwright/test";
import { Locator } from "@playwright/test";

export class HelperBase{

readonly page: Page;

constructor(page: Page) {
    this.page = page; // assign the page to the readonly property   
    
}

async waitforNumberoFSeconds(timeInseconds: number): Promise<void> {
    await this.page.waitForTimeout(timeInseconds * 1000); // wait for the specified number of seconds
}

isBoolean(str : string|null):boolean{
return str?.toLowerCase() ==='true'
} 

static async waitForVisible(locator: Locator, timeoutInSeconds: number = 5): Promise<void> {
  await locator.waitFor({
    state: 'visible',
    timeout: timeoutInSeconds * 1000
  });
}

}