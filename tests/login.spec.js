const { test, expect } = require('playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com')
});

const USERS_PASS = [
    ['Admin', 'admin123'], // correct
    ['Admin', 'admin234'], // wrong password
    ['Users', 'admin123'], // wrong username
    ['admin', 'admin123'], // username lower case
    ['ADMIN', 'admin123'], // username upper case
    ['Admin', 'ADMIN123'], // password upper case
];

test.describe('Login', () => {
    test('should pass with correct username and password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[0][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[0][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    })

    test('should failed with wrong username and correct password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[1][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[1][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('alert')).toContainText('Invalid credentials');
    })

    test('should failed with correct username and wrong password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[2][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[2][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('alert')).toContainText('Invalid credentials');
    })
    
    test('should failed with blank username and password', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Required').nth(1)).toBeVisible();
        await expect(page.getByText('Required').first()).toBeVisible();
    })
    
    test('should failed with blank username and correct password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[0][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Required').first()).toBeVisible();
    })
});

test.describe('Case Sensitive', () => {
    test('Username lowercase should pass', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[3][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[3][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('Username uppercase should pass', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[4][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[4][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('Password uppercase should failed', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(USERS_PASS[5][0]);
        await page.getByRole('textbox', { name: 'password' }).fill(USERS_PASS[5][1]);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('alert')).toContainText('Invalid credentials');
    });
});