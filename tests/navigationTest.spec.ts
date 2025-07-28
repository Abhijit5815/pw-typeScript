import { test ,expect} from '@playwright/test';
import {NavigationPage} from '../pageObjects/navigationPage';   

//()=> arrow function
test.beforeEach(async ({ page }) => {
    //before each test, this will run
    await page.goto('http://localhost:4200/')

})


test('Using page objects',async({page})=>{
const navigationPage = new NavigationPage(page); // instantiate the NavigationPage class
await navigationPage.formsLayoutPage(); // using the NavigationPage class to navigate
await navigationPage.datePickerPage(); // navigate to Datepicker page
await navigationPage.toasterPage(); // navigate to Toastr page
await navigationPage.tooltipPage(); // navigate to Tooltip page

})