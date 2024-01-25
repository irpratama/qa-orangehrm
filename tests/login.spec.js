const { test, expect } = require('playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com')
});

const USERS_PASS = [
    ['Admin', 'admin123'], // correct
    ['Admin', 'admin234'], // wrong password
    ['Users', 'admin123'], // wrong username
    ['admin', 'admin123'], // lower case
    ['ADMIN', 'ADMIN123'], // upper case
    ['Admin', 'Admin123'], // upper case
];

test.describe('Login', () => {
    test('should pass with correct username and password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[0][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[0][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('banner').getByText('Paul Collings')).toBeVisible();
    })

    test('should failed with wrong username and correct password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[1][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[1][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('alert')).toContainText('Invalid credentials');
    })
});