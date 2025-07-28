import { test ,expect} from '@playwright/test';
import { NavigationPage } from '../../pageObjects/navigationPage';

//()=> arrow function
test.beforeEach(async ({ page }) => {
    //before each test, this will run
    await page.goto('http://localhost:4200/')
    //await page.getByText('Forms').click()
})

test('email',async({page})=>{

    await page.getByText('Form Layout').click()
    //CSS Selector
    //by Tag name
     page.locator('input').first()  //will find all elements with input tag then fetch the first one

    //by ID
     page.locator('#inputEmail1')   //will find element with id inputEmail1 for id use # before the id name

    //by Class
     page.locator('.shape-rectangle') // will find all elements that contain class shape-rectangle for class use . before the class name

    //by Attribute
     page.locator('[placeholder="Email"]') // will find all elements that contain placeholder attribute with value Email for attribute use [] before the attribute name

    //combine multipe selectors
    await page.locator('input#inputEmail1[placeholder="Email"].shape-rectangle').fill('test@gmail.com'); // will find input tag with id inputEmail1

    //By Xpath [Not recommended]
    page.locator('//input[@id="inputEmail1"]') // will find input tag with id inputEmail1
 
    //by partial text
    page.locator(':text("Email")') // will find all elements that contain text Email
    
    // by exact text
    page.locator(':text-is("Email")') // will find all elements that contain exact text Email



})

test('user facing locators', async ({ page }) => {
    //await page.getByText('Form Layout').click()
    //await page.getByRole('button', { name: 'Sign in' }).first().click() // will find button with text Sign in
    const navigationPage = new NavigationPage(page); // instantiate the NavigationPage class
    await navigationPage.formsLayoutPage(); // using the NavigationPage class to navigate
    await page.getByTestId('SignInGrid').click() // will find button with data-testid attribute set to SignInGrid
    await page.getByPlaceholder('Jane Doe').fill('Jhnny Doe')
 //   await page.getByTitle('IoT Dashboard').click() // will find element with title attribute
})

test('locating child elements',async({ page })=>{
await page.getByText('Form Layout').click()
await page.locator('nb-card nb-radio-group :text-is("Option 1")').click() // will find nb-radio-group element that contains text Hobbies
await page.locator('nb-card').locator('nb-radio-group').locator(':text-is("Option 2")').click()

//cal also user facing with locators
await page.locator(':text-is("Using the Grid")').locator('..').getByRole('button', { name: 'Sign in' }).click() // will find radio button with text Option 3 inside nb-card

//indexing 
await page.locator('nb-card').nth(1).locator('nb-radio-group').locator(':text-is("Option 1")').click() // will find second nb-card and then find radio button with text Option 2 inside it
})

test('parent element',async({page})=>{
await page.getByText('Form Layout').click()

await page.locator('nb-card').filter({ hasText: 'Using the Grid' }).locator('nb-radio-group').locator(':text-is("Option 1")').click() // will find  all nb-card, than filter that contains text Using the Grid and then find radio button with text Option 1 inside it
await page.locator('nb-card',{hasText: 'Using the Grid'}).locator('nb-radio-group').locator(':text-is("Option 2")').click() // will find nb-card that contains text Using the Grid first istelf and then find radio button with text Option 2 inside it
//use multiple filters
await page.locator('nb-card').filter({ hasText: 'Using the Grid' }).locator('nb-radio-group').filter({ hasText: 'Option 1' }).locator('span.text',{hasText:'Option 1'}).click() // will find nb-card that contains text Using the Grid and then find radio button with text Option 2 inside it

//usiing locator inside locator
await page.locator('nb-card',{has:page.locator('#inputEmail1')}).getByRole('textbox',{name:"Email"}) // will find nb-card that contains input with id inputEmail1 and then find radio button with text Option 2 inside it

// .. to go to parent element
await page.locator(':text-is("Using the Grid")').locator('..').getByRole('button', { name: 'Sign in' }).click() // will find radio button with text Option 3 inside nb-card


})

test('re use the locators',async({page})=>{
   
const formLayout=page.getByText('Form Layout')
const basicForm=page.locator('nb-card').filter({ hasText: 'Basic Form' })
const emailInput=basicForm.locator('input[placeholder="Email"]')
const passwordInput=basicForm.locator('input[placeholder="Password"]')
const signInButton=basicForm.getByRole('button', { name: 'Submit' })   

await formLayout.click()
await emailInput.fill('test@test.com')
await passwordInput.fill('test1234')
await signInButton.click()

await expect(emailInput).toHaveValue('test@test.com')
})


test('extracting value',async({page})=>{
const formLayout=page.getByText('Form Layout')
const basicForm=page.locator('nb-card').filter({ hasText: 'Basic Form' })
formLayout.click()
const buttonText= await basicForm.locator('button').textContent() // will extract text from button
const buttonText2= await basicForm.locator('button').innerText() // will extract text from button
const buttonText3= await basicForm.locator('button').getAttribute('innerText') // will extract text from button only when innerText attribute is present

 expect(buttonText).toBe('Submit') // will check if button text is Submit
 expect(buttonText2).toBe('SUBMIT') // will check if button text is Submit 
 expect(buttonText3).toBe('SubmitBasicForm') // will check if button text is Submit

//get all texts
const allRadioLabels=await page.locator('nb-card').filter({ hasText: 'Using the Grid' }).locator('nb-radio').allTextContents() // will get all texts from radio buttons inside nb-card that contains text Using the Grid
 expect(allRadioLabels).toContain('Option 1') // will check if Option 1 is present in all texts
 expect(allRadioLabels).toEqual(['Option 1', 'Option 2', 'Disabled Option']) // will check if all texts are equal to Option 1, Option 2, Option 3 


//for value type into input field
const emailInput=basicForm.locator('input[placeholder="Email"]')
await emailInput.fill('test@gmail.com')
const inputValue=await emailInput.inputValue()

 expect(inputValue).toEqual('test@gmail.com')


//get attribute value
await emailInput.getAttribute('placeholder').then((value) => {
    console.log(value) // will log placeholder attribute value
})

})


test('assertions',async({page})=>{
const formLayout=page.getByText('Form Layout')
await formLayout.click()
const basicForm=page.locator('nb-card').filter({ hasText: 'Basic Form' })
const basicFormButton=basicForm.locator('button')

//General assertions
const value=10
expect(value).toBeGreaterThan(5) // will check if value is greater than 5
expect(value).toEqual(10) // will check if value is equal to 10
const buttonText=await basicFormButton.textContent()
expect(buttonText).toEqual('Submit')  // will check if basic form

//locator assertions -lot more options available
await expect(basicForm).toBeVisible() // will check if basic form is visible
await expect(basicForm).not.toBeHidden() // will check if basic form is hidden
await expect(basicForm).toHaveText('Basic formEmail addressPasswordCheck me outSubmit') // will check if basic form
await expect(basicFormButton).toBeEnabled() // will check if basic form button is enabled
await expect(basicFormButton).not.toBeDisabled() // will check if basic form button is  disabled
await expect(basicFormButton).toHaveAttribute('type', 'submit') // will check if basic form button has attribute type with value submit
await expect(basicFormButton).toHaveClass(/status/) // will check if basic form button has class that contains btn
await expect(basicFormButton).toHaveCSS('background-color', 'rgb(255, 61, 113)') // will check if basic form button has background color white
await expect(basicFormButton).toHaveText('Submit') // will check if basic form button has text Submit

//soft assertions test continues even if assertion fails
//await expect.soft(basicFormButton).toHaveText('Submit2') // will check if basic
await basicFormButton.click() // will click on basic form button

})

test('Using page objects',async({page})=>{
const navigationPage = new NavigationPage(page); // instantiate the NavigationPage class
await navigationPage.formsLayoutPage(); // using the NavigationPage class to navigate
await navigationPage.datePickerPage(); // navigate to Datepicker page
await navigationPage.toasterPage(); // navigate to Toastr page
await navigationPage.tooltipPage(); // navigate to Tooltip page

})
/*//test suites
test.describe('Forms test suite', () => {

test.beforeEach(async({page})=>{
    await page.getByText('Forms').click()
})

test('first test',async({page})=>{

    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test.only('navDatepicker',async({page})=>{
    await page.getByText('Datepicker').click()
})

})
*/
