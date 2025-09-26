import {Page, expect, Locator} from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export class WeatherPage {
    private readonly page: Page;
    private readonly email: string;
    private readonly password: string;

    // --- Locators ---
    private readonly signInButton: Locator;
    private readonly signInHeader: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly submitButton: Locator;
    private readonly searchInput: Locator;
    private readonly searchResults: Locator;
    private readonly temperature: Locator;

    constructor(page: Page) {
        this.page = page;
        this.email = process.env.EMAIL || '';
        this.password = process.env.PASSWORD || '';

        this.signInButton = page.locator('[class="Button--default--osTe5 AccountLinks--desktopLoginButtonWrapper--QnRzr"]');
        this.signInHeader = page.locator('h2.MemberLoginForm--welcomeText--CfQp0');
        this.emailInput = page.locator('#loginEmail');
        this.passwordInput = page.locator('#loginPassword');
        this.submitButton = page.locator('.MemberLoginForm--submitWrapper--mZewb > [data-testid="ctaButton"]');
        this.searchInput = page.locator('#headerSearch_LocationSearch_input');
        this.searchResults = page.locator('[data-testid="ctaButton"][role="option"]');
        this.temperature = page.locator('[data-testid="TemperatureValue"]');
    }

    async goToMainPage() {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) throw new Error('BASE_URL is not set in .env');
        await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 120_000 }); // Main page is taking too long to load for me.
        await expect(this.page).toHaveURL('https://weather.com/?Goto=Redirected', {timeout: 2000});
    }


    async signIn() {
        await this.signInButton.waitFor({ timeout: 60000 });
        await expect(this.signInButton).toBeVisible({ timeout: 15_000 });
        await this.signInButton.click();

        await expect(this.page).toHaveURL('https://weather.com/login', {timeout: 20_000});
        await expect(this.signInHeader).toHaveText('Sign in to your account.');

        // Credentials
        await expect(this.emailInput).toBeVisible({timeout: 10_000});
        await this.emailInput.click();
        await this.emailInput.fill('');
        await this.emailInput.type(this.email, { delay: 100 });

        await expect(this.passwordInput).toBeVisible({timeout: 10_000});
        await this.passwordInput.click();
        await this.passwordInput.fill('');
        await this.passwordInput.type(this.password, { delay: 100 });

        // Submit
        await expect(this.submitButton).toBeVisible({timeout: 10_000});
        await expect(this.submitButton).toBeEnabled({timeout: 10_000});
        await this.submitButton.click();

        // Verify redirect
        await expect(this.page).toHaveURL('https://weather.com/?Goto=Redirected', {timeout: 15_000});
    }

    async searchCity(city: string) {
        await expect(this.searchInput).toBeVisible({timeout: 15_000 });
        await this.searchInput.click();
        await this.searchInput.fill('');
        await this.searchInput.type(city, { delay: 100 });

        const firstButtonList = await this.searchResults.first()
        await expect(firstButtonList).toBeVisible({timeout: 10_000});
        await firstButtonList.click();
    }

    async validateTemperatureVisible() {
        await expect(this.page).toHaveURL(/https:\/\/weather\.com\/weather\/today/, {timeout: 5_000});
        const firstTemp = this.temperature.first(); // There are 31 elements on the site.
        await expect(firstTemp).toBeVisible({timeout: 5_000});
    }


}