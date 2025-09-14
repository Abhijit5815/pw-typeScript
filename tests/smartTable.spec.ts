import { expect, test } from '../fixtures/page-options';
import { HomePageLocators } from '../pageObjects/Locators/homePage.locators';
import { PageManager } from '../pageObjects/PageHelper/PageManager';
import { FormsLayoutPageLocators } from '../pageObjects/Locators/formsLayoutPage.locators';
import {faker} from '@faker-js/faker';
import { Logger } from '../utilities/Logger';   

test.use({
  startNav: [HomePageLocators.TablesAndData, HomePageLocators.SmartTable]
});

//can add tags to specific tests as well and add multiple no of tags
test.describe('Smart Table Tests @smoke', () => {

    test('Fetch Table data', async ({ managerPageFixture,logger }) => {
       const fname= await managerPageFixture.smartTablepage().getText(2,0);
       logger.info(`Value fetched is = ${fname}`);
       expect.soft(fname).toEqual('Mark');
       const lname= await managerPageFixture.smartTablepage().getText(3,0);
       logger.info(`Value fetched is = ${lname}`);
      
       expect.soft(lname).toContain('Otto');
       expect.soft(lname).toStrictEqual('Otto');

    })
//no need to use managerPageFixture here as we are setting it to auto true in page-options.ts
    test('Set data in Table', async ({ managerPageFixture,logger},testInfo) => {
       await managerPageFixture.smartTablepage().setText(6,0,'Age','40');
     
    })

})
