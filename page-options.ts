import {test as Base} from '@playwright/test';
import { HomePageLocators } from '../pw-typeScript/pageObjects/Locators/homePage.locators';
import { PageManager } from '../pw-typeScript/pageObjects/PageHelper/PageManager';


export type TestOptions={
    managerPageFixture: PageManager; // Define the type for the fixture
}

export const test = Base.extend<TestOptions>({

    managerPageFixture: [async ({page},use)=>{
    // Navigate to the home page
    await page.goto('http://localhost:4200/');
    const pm = new PageManager(page);
    await pm.homepage().click(HomePageLocators.Forms);
    await pm.homepage().click(HomePageLocators.FormLayout);
    // Pass the PageManager instance to the test
    //statements above use are like setup in test
    await use(pm);
    //statements below use are like teardown in test
    console.log('Test completed Teardown, cleaning up...');
    },{auto:true}]   //default value is blank string
    
});