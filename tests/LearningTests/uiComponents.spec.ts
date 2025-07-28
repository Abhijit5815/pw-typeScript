import {test, expect} from '@playwright/test';  
import { timeout } from 'rxjs/operators';


test.beforeEach(async ({ page }) => {
    //before each test, this will run
    await page.goto('http://localhost:4200/')

})

test.describe('Form Layout Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layout').click();
    })

   test('email input field',async ({page})=>{
   timeout(60000) 
   const usingGridemailInput= page.locator('nb-card', {hasText:'Using the Grid'}).getByRole('textbox', {name: 'Email'})

   await usingGridemailInput.fill('test@test.com')
   await usingGridemailInput.clear()
   //simulate keystrokes
   //await usingGridemailInput.pressSequentially('t', 'e','s', 't', '@', 't', 'e', 's', 't', '.', 'c', 'o', 'm')
   await usingGridemailInput.pressSequentially('test@test.com', {delay:50 })  // adds 50ms between key presses

   //Generic assertion
   const emailValue = await usingGridemailInput.inputValue();
   expect(emailValue).toBe('test@test.com')

   //locator assertion
   await expect(usingGridemailInput).toHaveValue('test@test.com')
   })


 test('Radio button',async({page})=>{
  const usingGridRadioButton1= page.locator('nb-card', {hasText:'Using the Grid'})

  //find radio button by label
  // await usingGridRadioButton1..getByLabel('Option 1').check()   //does not work if the radio button is already checked or visually hidden
  await usingGridRadioButton1.getByLabel('Option 1').check({force:true}) //force check even if it is already checked or hidden
  await expect(usingGridRadioButton1.getByLabel('Option 1')).toBeChecked() 
  await usingGridRadioButton1.getByLabel('Option 1').check({force:false}) //does nothing if the radio button is already checked or hidden


//find radio button by role
  await usingGridRadioButton1.getByRole('radio', {name: 'Option 2'}).check({force:true})
  
  //locator assertion
  await expect(usingGridRadioButton1.getByRole('radio', {name: 'Option 1'})).toBeChecked({checked:false}) //force check even if it is already checked or hidden

  //generic assertion
  const isOption2Checked = await usingGridRadioButton1.getByRole('radio', {name: 'Option 2'}).isChecked()
  expect(isOption2Checked).toBeTruthy() //assert that Option 2 is checked
  expect(isOption2Checked).toBe(true) //assert that Option 2 is checked
    
  expect(await usingGridRadioButton1.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy() //assert that Option 1 is not checked
})  

});

test.describe('Modals and overlays',() => {
test.beforeEach(async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();
})

 
test('Checkboxes',async({page})=>{

    const checkboxHideOnClick= page.getByRole('checkbox', {name: 'Hide on click'})
    const checkboxAutoHide= page.getByRole('checkbox', {name: 'Prevent arising on duplicate toast'})
    
    await checkboxHideOnClick.check({force:true})
    await expect(checkboxHideOnClick).toBeChecked() //assert that the checkbox is checked

    await checkboxHideOnClick.uncheck({force:true})
     await expect(checkboxHideOnClick).toBeChecked({checked:false}) //assert that the checkbox is unchecked

     //uncheck all checkboxe
     const allCheckboxes = page.getByRole('checkbox')
        for (const checkbox of await allCheckboxes.all()) {
            await checkbox.check({force:true})
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


test('LIst itms Dropdown',async({page})=>{

const dropdownmenu=page.locator('ngx-header nb-select')
await dropdownmenu.click()

page.getByRole('list') //when the list has UL tag
page.getByRole('listbox') //when the list has LI tag with role listbox

//const options = page.getByRole('list').locator('nb-option')

const optionsList = page.locator('nb-option-list nb-option')  //gets the list of options in the dropdown
//verify all items in the dropdown
expect(optionsList).toHaveCount(4) //assert that there are 4 options in the dropdown
await expect(optionsList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']) //assert that the options are as expected array of strings
await optionsList.filter({hasText:'Cosmic'}).click()

await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', 'rgb(50, 50, 89)') //assert that the background color of the header is cosmic theme color

//say verify all colors in the dropdown

//array of colors having key as theme name and value as color
const colors = {
    "Light": 'rgb(255, 255, 255)',
    "Dark": 'rgb(34, 43, 69)',      
    "Cosmic": 'rgb(50, 50, 89)',
    "Corporate": 'rgb(255, 255, 255)'
}

for(const col in colors){
    await dropdownmenu.click()
    await optionsList.filter({hasText:col}).click()
    await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', colors[col])
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
    const tooltipButton = page.locator('nb-card',{hasText:"Tooltip Placements"}).getByRole('button', { name: 'Top' });
    await tooltipButton.hover(); //hover over the button to show the tooltip

    //assert that the tooltip is visible
    const tooltip = page.locator('nb-tooltip');
    await expect(tooltip).toBeVisible();
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