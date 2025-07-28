import {Locator, Page,expect} from '@playwright/test';

export class NavigationPage{

//create a readonly property for the page
readonly page: Page
readonly formsLayoutMenuItem :Locator
readonly DatePickerMenuItem :Locator
readonly toasterMenuItem :Locator
readonly tooltipMenuItem :Locator


//instantiate page in the constructor
constructor(page: Page) {
    this.page = page // assign the page to the readonly property
    this.formsLayoutMenuItem = this.page.getByText('Form Layout'); // locator for Form Layout menu item
    this.DatePickerMenuItem = this.page.getByText('Datepicker'); // locator for Datepicker menu item
    this.toasterMenuItem = this.page.getByText('Toastr'); // locator for Toastr menu item
    this.tooltipMenuItem = this.page.getByText('Tooltip'); // locator for Tooltip menu item
}

async formsLayoutPage(){
    await this.selectNavMenuPageItem('Forms') // navigate to Forms menu item
    await this.formsLayoutMenuItem.click();
}

async datePickerPage(){
    await this.selectNavMenuPageItem('Forms')
    await this.DatePickerMenuItem.click();
}

async toasterPage(){
    await this.selectNavMenuPageItem('Modal & Overlays')
    await this.toasterMenuItem.click();
}

async tooltipPage(){
   await this.selectNavMenuPageItem('Modal & Overlays')
    await this.tooltipMenuItem.click();
}

async dialogPage(){
   await this.selectNavMenuPageItem('Modal & Overlays')
    await this.page.getByText('Dialog').click();
}

private async selectNavMenuPageItem(name :string){
const navMenuItemPage= this.page.getByTitle(name);
const isVisible = await navMenuItemPage.isVisible();
const isRawExpanded = await navMenuItemPage.getAttribute('aria-expanded');
const isExpanded = this.isBoolean(isRawExpanded)
//convert string to boolean
if(isVisible && !isExpanded){
    await navMenuItemPage.click();  
}
}


isBoolean(str : string|null):boolean{
return str?.toLowerCase() ==='true'
} 
}