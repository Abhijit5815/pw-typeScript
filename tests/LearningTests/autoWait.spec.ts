import { expect} from '@playwright/test';
import { test } from '../../test-options.ts'// Import the custom test with options

//()=> arrow function
test.beforeEach(async ({ page,autowaiturl },testInfo) => {
    //before each test, this will run
    await page.goto(autowaiturl) //navigate to the autowaiturl defined in playwright.config.ts
    testInfo.setTimeout(testInfo.timeout + 10000) // increase the timeout for this test by 10 seconds
    
})


test('auto wait',async({page})=>{
test.setTimeout(60000)    // set timeout for the test to 50 seconds instead of default 30 seconds
const triggerBtn = page.getByText('Button Triggering AJAX Request')
const ajaxText = page.getByText('Data loaded with AJAX get request')
const successText=page.locator('.bg-success')
await triggerBtn.click()
//await expect(ajaxText).toBeVisible({timeout:20000}) // will wait for the text to be visible before proceeding
//await page.reload({waitUntil:'domcontentloaded'})
//await triggerBtn.click()
//await ajaxText.click({timeout:40000}) // will click on the text after it is visible by default waits for 30 seconds
await ajaxText.waitFor({state:'attached',timeout:20000}) // will wait for the text to be visible before proceeding
})


test('alternative waits',async ({page})=>{

    const triggerBtn = page.getByText('Button Triggering AJAX Request')
    const ajaxText = page.getByText('Data loaded with AJAX get request')
    const successText=page.locator('.bg-success')
    
    await triggerBtn.click()
    //wait for selector 
    //await page.waitForSelector('.bg-success', {state:'visible', timeout:20000}) // will wait for the element to be visible before proceeding
    //expect(successText).toHaveText('Data loaded with AJAX get request.')
    
    // wait for response
    const response = await page.waitForResponse('http://uitestingplayground.com/ajaxdata')
    //const response = await page.waitForResponse(response => response.url() === 'http://uitestingplayground.com/ajaxdata' && response.status() === 200, {timeout:20000})
    expect(response.ok()).toBeTruthy() // will check if the response is ok
    expect(response.status()).toBe(200) // will check if the response status is 200
    expect(response.url()).toContain('ajax') // will check if the response url contains ajax            

    //wait for network calls to be completed (NOT RECOMMENDED)
    //await page.waitForLoadState('networkidle') // will wait for the network calls to be completed before proceeding
    const ajaxTextContent = await ajaxText.textContent()
    expect(ajaxTextContent).toContain('Data loaded with AJAX get request') // will check if the text contains Data loaded with AJAX get reques

    //hard code wait (NOT RECOMMENDED)
    //await page.waitForTimeout(5000) // will wait for 5 seconds before proceeding

    //test.setTimeout(30000) // set timeout for the test to 30 seconds override default or value set in playwright.config.ts for test level
    //test.slow() // marks the test as slow, useful for debugging 3 times the timout
    //test.fixme() // marks the test as a work in progress, useful for debugging        
})

