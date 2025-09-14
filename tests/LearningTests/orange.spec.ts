import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { test } from '@playwright/test';

let page:Page;

test.beforeEach(async ({  }) => {
 const browser = await chromium.launch({ headless: false });
 const context=await browser.newContext();
 page=await context.newPage();
 await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
})


test('orange test', async ({}) => {

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('button', { name: ' Add ' }).click();
  await page.getByPlaceholder('First Name').fill('TestFname');
  await page.getByPlaceholder('Middle Name').fill('TestMname');
  await page.getByPlaceholder('Last Name').fill('TestLname');
  await page.getByRole('button', { name: ' Save ' }).click();
  await page.getByRole('link', { name: 'My Info' }).click();
  await page.getByText('Personal Details').click();
  await page.getByRole('button', { name: ' Edit ' }).click();
});
