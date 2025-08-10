import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  
   // await page.goto('/') 
    await page.goto('/', { waitUntil: 'networkidle',timeout:90000 });

})

//test.describe.parallel('Form Layout Tests', () => {       
test.describe('Form Layout Tests', { tag: ['@Reg'] }, () => {

    test.beforeEach(async ({ page }, testInfo) => {
        if (testInfo.project.name === 'mobile') {
        //await page.locator('.sidebar-toggle').click();
        await page.locator('g[data-name="menu-2"]').click();
        }

        await page.getByText('Forms').click();
        await page.getByText('Form Layout').click();
        if (testInfo.project.name === 'mobile') {
        //await page.locator('.sidebar-toggle').click();
        await page.locator('g[data-name="menu-2"]').click();
        }
    })

    test('email input field @mobile', async ({ page }) => {
        test.setTimeout(60000) //set timeout to 60 seconds for this test
        const usingGridemailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' })

        await usingGridemailInput.fill('test@test.com')
      //  await usingGridemailInput.clear()
      //  await usingGridemailInput.pressSequentially('test@test.com', { delay: 50 })  // adds 50ms between key presses

    });



});
