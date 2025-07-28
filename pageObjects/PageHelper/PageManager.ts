import { Page } from "@playwright/test";
import { HomePage } from "./homePage";  //samefolder as PageManager.ts
import { FormsLayoutPage } from "./formsLayoutPage"; //samefolder as PageManager.ts
import { HomePageLocators } from "../Locators/homePage.locators";
import { FormsLayoutPageLocators } from "../Locators/formsLayoutPage.locators";    



export class PageManager{

private readonly page: Page;
private readonly homePage: HomePage;
private readonly formsLayoutPage: FormsLayoutPage;


constructor(page: Page) {

    this.page = page;
    this.homePage = new HomePage(this.page);
    this.formsLayoutPage = new FormsLayoutPage(this.page);

}

homepage() {
    return this.homePage;   
}

formslayoutpage() {
    return this.formsLayoutPage;
}


}