import { test, expect } from '@playwright/test';


//test.describe.configure({ mode: 'serial' }) // run tests in serial mode, one after another in whole spec file
//test.describe.configure({ mode: 'parallel' }) // run tests in parallel, all tests in this spec file will run in parallel
//test.describe.configure({ mode: 'parallel', retries: 2 }) // run tests in parallel, all tests in this spec file will run in parallel and retry failed tests 2 times

test.beforeEach(async ({ page}) => {
    //before each test, this will run
    await page.goto('/') //navigate to the base URL defined in playwright.config.ts

})

//test.describe.parallel('Form Layout Tests', () => {              // run tests in parallel in this suite
test.describe('Form Layout Tests', { tag: ['@smoke', '@auth'] }, () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layout').click();
    })

    test('email input field', async ({ page }) => {
        test.setTimeout(60000) //set timeout to 60 seconds for this test
        const usingGridemailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' })

        await usingGridemailInput.fill('test@test.com')
        await usingGridemailInput.clear()
        //simulate keystrokes
        //await usingGridemailInput.pressSequentially('t', 'e','s', 't', '@', 't', 'e', 's', 't', '.', 'c', 'o', 'm')
        await usingGridemailInput.pressSequentially('test@test.com', { delay: 50 })  // adds 50ms between key presses

        //Generic assertion
        const emailValue = await usingGridemailInput.inputValue();
        expect(emailValue).toBe('test@test.com')

        //locator assertion
        await expect(usingGridemailInput).toHaveValue('test@test.com')
    });


    test('Radio button', async ({ page }) => {
        const usingGridRadioButton1 = page.locator('nb-card', { hasText: 'Using the Grid' })

        //find radio button by label
        // await usingGridRadioButton1..getByLabel('Option 1').check()   //does not work if the radio button is already checked or visually hidden
        await usingGridRadioButton1.getByLabel('Option 1').check({ force: true }) //force check even if it is already checked or hidden
        await expect(usingGridRadioButton1.getByLabel('Option 1')).toBeChecked()
        await usingGridRadioButton1.getByLabel('Option 1').check({ force: false }) //does nothing if the radio button is already checked or hidden


        //find radio button by role
        await usingGridRadioButton1.getByRole('radio', { name: 'Option 2' }).check({ force: true })

        //locator assertion
        await expect(usingGridRadioButton1.getByRole('radio', { name: 'Option 1' })).toBeChecked({ checked: false }) //force check even if it is already checked or hidden

        //generic assertion
        const isOption2Checked = await usingGridRadioButton1.getByRole('radio', { name: 'Option 2' }).isChecked()
        expect(isOption2Checked).toBeTruthy() //assert that Option 2 is checked
        expect(isOption2Checked).toBe(true) //assert that Option 2 is checked

        expect(await usingGridRadioButton1.getByRole('radio', { name: 'Option 1' }).isChecked()).toBeFalsy() //assert that Option 1 is not checked
    })

});

test.describe('Modals and overlays', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Toastr').click();
    })


    test('Checkboxes', async ({ page }) => {

        const checkboxHideOnClick = page.getByRole('checkbox', { name: 'Hide on click' })
        const checkboxAutoHide = page.getByRole('checkbox', { name: 'Prevent arising on duplicate toast' })

        await checkboxHideOnClick.check({ force: true })
        await expect(checkboxHideOnClick).toBeChecked() //assert that the checkbox is checked

        await checkboxHideOnClick.uncheck({ force: true })
        await expect(checkboxHideOnClick).toBeChecked({ checked: false }) //assert that the checkbox is unchecked

        //uncheck all checkboxe
        const allCheckboxes = page.getByRole('checkbox')
        for (const checkbox of await allCheckboxes.all()) {
            await checkbox.check({ force: true })
            //await expect(checkbox).toBeChecked() //assert that the checkbox is checked
            expect(await checkbox.isChecked()).toBeTruthy() //assert that the checkbox is checked
        }

        //now trying evaulateAll to uncheck all checkboxes  - Not recommended works in browser context
        await allCheckboxes.evaluateAll((checkboxes) => {
            checkboxes.forEach(checkbox => {
                (checkbox as HTMLInputElement).checked = false;
            });
        });

        // Why this works but the above one doesnt - if manually setting .checked = false inside evaluateAll() didn’t work, it’s likely because your app relies on event listeners (like change, input, or click) to update internal state, and setting the property alone doesn’t trigger those.
        // So, you can dispatch an event after changing the property to ensure that the application reacts to the change. Javascript frameworks often listen for these events to update their state or UI.
        await allCheckboxes.evaluateAll((checkboxes) => {
            checkboxes.forEach(checkbox => {
                (checkbox as HTMLInputElement).checked = false;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });


    })


    test('LIst itms Dropdown', async ({ page }) => {

        const dropdownmenu = page.locator('ngx-header nb-select')
        await dropdownmenu.click()

        page.getByRole('list') //when the list has UL tag
        page.getByRole('listbox') //when the list has LI tag with role listbox

        //const options = page.getByRole('list').locator('nb-option')

        const optionsList = page.locator('nb-option-list nb-option')  //gets the list of options in the dropdown
        //verify all items in the dropdown
        const optionsCount=optionsList.count();
        console.log(`Total options in the dropdown: ${optionsCount}`);
        expect(optionsList).toHaveCount(4) //assert that there are 4 options in the dropdown
        await expect(optionsList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']) //assert that the options are as expected array of strings
        await optionsList.filter({ hasText: 'Cosmic' }).click()
        await  optionsList.last().click() //click the last option in the list
        await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', 'rgb(50, 50, 89)') //assert that the background color of the header is cosmic theme color

        //say verify all colors in the dropdown

        // colors  object having key as theme name and value as color
        const colors = {
            "Light": 'rgb(255, 255, 255)',
            "Dark": 'rgb(34, 43, 69)',
            "Cosmic": 'rgb(50, 50, 89)',
            "Corporate": 'rgb(255, 255, 255)'
        }

        for (const col in colors) {
            const key = col as keyof typeof colors;
            await dropdownmenu.click()
            await optionsList.filter({ hasText: col }).click()
            await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', colors[key])
        }


        //Below code is more readable and maintainable and precise
        /*
        for (const [option, color] of Object.entries(colors)) {
            await dropdownmenu.click()
            await optionsList.filter({hasText: option}).click()
            await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', color)
        }
         */

    })

})

test.describe('Tooltips', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Tooltip').click();
    })

    test('Tooltip on button', async ({ page }) => {
        const tooltipButton = page.locator('nb-card', { hasText: "Tooltip Placements" }).getByRole('button', { name: 'Top' }) //screenshot of the button;
        await tooltipButton.hover(); //hover over the button to show the tooltip
        tooltipButton.screenshot({ path: 'screenshots/tooltip.png' })  //take screenshot of the locator itself
        //assert that the tooltip is visible
        const tooltip = page.locator('nb-tooltip');
        await expect(tooltip).toBeVisible();
        const ss = await page.screenshot({ path: 'screenshots/tooltipPage.png' }); //take screenshot of the page where tooltip is 

        //convert screenshot to base64 inorder to save it in the database or send it somewhere like email teams slack
        const buffer = ss.toString('base64'); //convert buffer to base64 string
        //console.log(buffer); //log the base64 string to console

        const tooltiptext = await tooltip.textContent();
        expect(tooltiptext).toBe('This is a tooltip'); //assert that the tooltip
        //assert that the tooltip has the correct text
        await expect(tooltip).toHaveText('This is a tooltip');

        /*
        //assert that the tooltip is positioned correctly
        const tooltipBox = await tooltip.boundingBox();
        const buttonBox = await tooltipButton.boundingBox();
        
        expect(tooltipBox.x).toBeCloseTo(buttonBox.x, -1); //x position should be close to button x position
        expect(tooltipBox.y).toBeLessThan(buttonBox.y); //y position should be less than button y position
        */
    })

})



test.describe('Smart table', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Tables & Data').click();
        await page.getByText('Smart Table').click();
    })

    test('browser dialog box @dialog', async ({ page }) => {

        /*One time approach using promise create a promise that will resolve when  the next dialog appear
          One time listener only- handles the very next dialogue only
        
        const dialogPromise = page.waitForEvent('dialog');
        await page.getByRole('table').locator('tr', {hasText:'@fat'}).locator('i.nb-trash').click();
        const dialog = await dialogPromise;
        expect(dialog.message()).toEqual('Are you sure you want to delete');
        await dialog.accept();
        */

        // ✅ Correct - start listening and trigger simultaneously
        const [dialog] = await Promise.all([
            page.waitForEvent('dialog'),
            page.getByRole('table').locator('tr', { hasText: '@twitter' }).locator('i.nb-trash').click()
        ]);

        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        await dialog.accept();


        /*
         Event listener setup: page.on('dialog') registers a persistent event listener that will fire automatically whenever any dialog appears on this page
         Listener stays active: This listener remains active for the entire lifecycle of the page - it will handle all future dialogs, not just the next one
         Automatic triggering: When the click happens and a dialog appears, the listener fires immediately and synchronously
         Handler must act: The listener must call either dialog.accept() or dialog.dismiss() - otherwise the page will freeze
         */
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?');
            dialog.accept();
        })
        await page.getByRole('table').locator('tr', { hasText: '@snow' }).locator('i.nb-trash').click();



    })
})
    test('Smart Table @Text', async ({ page }) => {

   
       const row= page.getByRole('table').locator('tr.table-row-0');
       //const firstName=await row.locator('td').nth(2).locator('div.ng-star-inserted').innerText();
       const firstName=await row.locator('td').nth(2).innerText();
       console.log(firstName);

       //page.locator('tr.table-row-0 td:nth-child(2)') 
    

    })

    test.describe('Date Picker', () => {

        test.beforeEach(async({page})=>{
            await page.getByText('Forms').click();
            await page.getByText('Datepicker').click();
        })

        test('Common Datepicker',async({page})=>{
            const datepickerInput=page.getByPlaceholder('Form Picker',{exact:true});
            await datepickerInput.click();

            //month and year selector
            //select year first
            const dropdownYear=page.locator('nb-calendar-view-mode[ng-reflect-view-mode="date"]');
            await dropdownYear.click();

            const yearToSelect='2025';
            await page.locator('nb-calendar-year-cell').filter({hasText:yearToSelect}).click();
            //select month
            const monthToSelect='Oct';
            await page.locator('nb-calendar-month-cell').filter({hasText:monthToSelect}).click();

            //select date
            const dateToSelect='15';
            await page.locator('nb-calendar-day-cell:not(.bounding-month)').filter({hasText:dateToSelect}).click();

            expect(await datepickerInput.inputValue()).toBe(`${monthToSelect} ${dateToSelect}, ${yearToSelect}`) //assert that the date is selected correctly;
        })






















    })

