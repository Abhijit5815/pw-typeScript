import { test } from '../fixtures/page-options';
import { HomePageLocators } from '../pageObjects/Locators/homePage.locators';
import { PageManager } from '../pageObjects/PageHelper/PageManager';
import { FormsLayoutPageLocators } from '../pageObjects/Locators/formsLayoutPage.locators';
import {faker} from '@faker-js/faker';

test.use({
  startNav: [HomePageLocators.Forms, HomePageLocators.FormLayout]
});

//can add tags to specific tests as well and add multiple no of tags
test.describe('Forms Layout Page Tests @smoke', () => {

    //generic retry in config but if you want to retry a specific test you can use this
    //test.retry(2); // This will retry the test 2 times if it fails
    // but for suite level retry you can use 
    test.describe.configure({ retries: 0 }); // This will retry all tests in this suite 2 times if they fail

    test('set theme', async ({ managerPageFixture }) => {
        await managerPageFixture.homepage().setThemeDropdown(HomePageLocators.DarkTheme);
         
    })
//no need to use managerPageFixture here as we are setting it to auto true in page-options.ts
    test('Fill using the rid form', async ({ managerPageFixture,logger},testInfo) => {
       
       if(testInfo.retry){
        console.log(`Test is being retried: ${testInfo.retry}`);  
       }
        const fullname = faker.person.fullName();
        const email = `${fullname.replace(/ /g,'')}${faker.number.int(100)}@emailcom`
        logger.info(`First name in row 0 = ${fullname}`);
        await managerPageFixture.formslayoutpage().setText(FormsLayoutPageLocators.Email, email);
        await managerPageFixture.formslayoutpage().setText(FormsLayoutPageLocators.Password, 'TestPassword');
        await managerPageFixture.formslayoutpage().click(FormsLayoutPageLocators.SignInGridButton); // Click on the radio button
    })

})
