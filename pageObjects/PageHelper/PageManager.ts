import { Page } from "@playwright/test";
import { HomePage } from "./homePage";  //samefolder as PageManager.ts
import { FormsLayoutPage } from "./formsLayoutPage"; //samefolder as PageManager.ts
import { ToastrPage } from "./toastrPage"; 
import { FormsLayoutPageLocators } from "../Locators/formsLayoutPage.locators";    

export class PageManager{

    private readonly page: Page;
    private readonly homePage: HomePage;
    private readonly formsLayoutPage: FormsLayoutPage;
    private readonly toastrPage: ToastrPage;

    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(this.page);
        this.formsLayoutPage = new FormsLayoutPage(this.page);
        this.toastrPage = new ToastrPage(this.page);
        /* 
        Takes a Playwright Page as input (the browser tab/session you are testing).
        Instantiates HomePage, FormsLayoutPage, and ToastrPage with the same Playwright page instance.
        Stores these as private properties.
        */
    }

    /*
    Getter methods for your page objects.
    */ 
    homepage() {
        this.page.bringToFront(); // ← Add this line
        return this.homePage;   
    }

    formslayoutpage() {
        this.page.bringToFront(); // ← Add this line
        return this.formsLayoutPage;
    }

    toastrpage() {
        this.page.bringToFront(); // ← Add this line
        return this.toastrPage;
    }
}
