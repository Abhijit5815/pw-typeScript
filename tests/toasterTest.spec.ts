import { test } from '../page-options';
import { HomePageLocators } from '../pageObjects/Locators/homePage.locators';
import { PageManager } from '../pageObjects/PageHelper/PageManager';
import { FormsLayoutPageLocators } from '../pageObjects/Locators/formsLayoutPage.locators';
import {faker} from '@faker-js/faker';
import { ToastrPageLocators } from '../pageObjects/Locators/toastrPage.locator';

test.use({
  startNav: [HomePageLocators.ModalAndOverlays, HomePageLocators.Toastr]
});

test.describe('Toaster Page Tests ', () => {

    test.describe.configure({ retries: 0 }); // This will retry all tests in this suite 2 times if they fail

    test('set toast type', async ({ managerPageFixture }) => {
        await managerPageFixture.toastrpage().setDropdown(ToastrPageLocators.DANGER);
         
    })
    //no need to use managerPageFixture here as we are setting it to auto true in page-options.ts
    test('Fill using the rid form', async ({ managerPageFixture},testInfo) => {
       
       if(testInfo.retry){
        console.log(`Test is being retried: ${testInfo.retry}`);  
       }
        const fullname = faker.person.fullName();
        const email = `${fullname.replace(/ /g,'')}${faker.number.int(100)}@emailcom`
        
        await managerPageFixture.formslayoutpage().setText(FormsLayoutPageLocators.Email, email);
        await managerPageFixture.formslayoutpage().setText(FormsLayoutPageLocators.Password, 'TestPassword');
        await managerPageFixture.formslayoutpage().click(FormsLayoutPageLocators.SignInGridButton); // Click on the radio button
    })

})
