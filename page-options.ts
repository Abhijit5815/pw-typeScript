import {test as Base} from '@playwright/test';
import { HomePageLocators } from '../pw-typeScript/pageObjects/Locators/homePage.locators';
import { PageManager } from '../pw-typeScript/pageObjects/PageHelper/PageManager';


export type TestOptions={
    managerPageFixture: PageManager; 
    startNav?: HomePageLocators[];  // Define the type for the fixture
}

export const test = Base.extend<TestOptions>({
    startNav: [[], { option: true }],
    managerPageFixture: [async ({page,startNav},use)=>{
    // Navigate to the home page
    await page.goto('/');
    const pm = new PageManager(page);
       // Click through the provided navigation path
    for (const navStep of startNav) {
      await pm.homepage().click(navStep);
    }
    // Pass the PageManager instance to the test
    //statements above use are like setup in test
    await use(pm);
    //statements below use are like teardown in test
    console.log('Test completed Teardown, cleaning up...');
    },{auto:true}]   //default value is blank string
    
});