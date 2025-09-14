import { Page, expect, Locator } from '@playwright/test';
import { HelperBase } from './helperBase'; // Importing HelperBase to extend its functionality
import { smartTablePageLocators } from '../Locators/smartTablePage.locator';
import { Logger } from '../../utilities/Logger';


export class SmartTablePage extends HelperBase {

    //private readonly page: Page; // readonly property for the page and private to restrict access to this class only
    //removed this is already defined in HelperBase
    constructor(page: Page) {
        super(page) // assign the page to the readonly property
    }

    
        async click(key: smartTablePageLocators,options?:string): Promise<void> {
            switch (key) { 
                case smartTablePageLocators.DELETE:
                    await this.page.getByRole('table').locator('tr', { hasText: `${options}` }).locator(`i.${key}`).click();                     
                    break;
                default:
                    throw new Error(`Unhandled locator key: ${key}`);
            }   
        }


        getRow(n:number):Locator{
            return this.page.getByRole('table').locator(`tr.table-row-${n}`);
        }

        /**
         * 
         * @param colNo 
         * @param rowNo 
         * @param placeHolder placeHolder value excat like colName
         * @param value value to be set
         */
         async setText(colNo:number,rowNo:number,placeHolder:string,value: string): Promise<void> {
         const row=this.getRow(rowNo);
         const edit= row.locator('td').nth(colNo).locator(`i.${smartTablePageLocators.EDIT}`);
         await edit.click();
         expect(row.locator('td').nth(colNo).locator('a.edit-save')).toBeVisible();
           
         const cell=row.locator('td').nth(colNo).getByPlaceholder(placeHolder);
         await cell.isVisible(); 
         await cell.fill(value);
         const editSave=row.locator('td').nth(colNo).locator('a.edit-save');
         await editSave.click();
         const fetchText=this.getText(colNo,rowNo);
         expect(fetchText).toEqual(value);
         
         }

         async getText(colNo:number,rowNo:number): Promise<string> {
         const row=this.getRow(rowNo);
        
         return await row.locator('td').nth(colNo).locator('div.ng-star-inserted').innerText();
         
         }


}


