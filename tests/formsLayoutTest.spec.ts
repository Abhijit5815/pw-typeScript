import { test, expect } from '@playwright/test';
import { HomePageLocators } from '../pageObjects/Locators/homePage.locators';
import { PageManager } from '../pageObjects/PageHelper/PageManager';
import { FormsLayoutPageLocators } from '../pageObjects/Locators/formsLayoutPage.locators';
import {faker} from '@faker-js/faker';

test.describe('Forms Layout Page Tests', () => {

    //generic retry in config but if you want to retry a specific test you can use this
    //test.retry(2); // This will retry the test 2 times if it fails
// but for suite level retry you can use 
    test.describe.configure({ retries: 2 }); // This will retry all tests in this suite 2 times if they fail

    test.beforeEach(async ({ page }) => {
        // Navigate to the home page before each test
        await page.goto('http://localhost:4200/');
        const pm = new PageManager(page);
        await pm.homepage().click(HomePageLocators.Forms); // Click on the Forms menu item
        await pm.homepage().click(HomePageLocators.FormLayout); // Click on the Form Layout menu item

    });


    test('set theme', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.homepage().setThemeDropdown(HomePageLocators.DarkTheme);
         // Set the theme to Light
    })

    test('Fill using the rid form', async ({ page },testInfo) => {
       
       if(testInfo.retry){
        //do something if the test is retried
        console.log(`Test is being retried: ${testInfo.retry}`);  
       }
        const pm = new PageManager(page);
        const fullname = faker.person.fullName();
        const email = `${fullname.replace(' ','')}${faker.number.int(100)}@emailcom`
        
        await pm.formslayoutpage().setText(FormsLayoutPageLocators.Email, email);
        await pm.formslayoutpage().setText(FormsLayoutPageLocators.Password, 'TestPassword');
        await pm.formslayoutpage().click(FormsLayoutPageLocators.SignInGridButton); // Click on the radio button
    })

})
