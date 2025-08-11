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

     test('set toast type checkboxes', async ({ managerPageFixture }) => {
        await managerPageFixture.toastrpage().checkUncheckCheckbox(ToastrPageLocators.HIDE_ON_CLICK,true);
        await managerPageFixture.toastrpage().checkUncheckCheckbox(ToastrPageLocators.PREVENT_DUPLICATE_TOAST,true);
        await managerPageFixture.toastrpage().checkUncheckCheckbox(ToastrPageLocators.SHOW_TOAST_WITH_ICON,true);
         
    })

})
