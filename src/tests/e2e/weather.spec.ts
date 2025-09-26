import { test } from '@playwright/test';
import { WeatherPage } from '../../pages/e2e/WeatherPage';

test('E2E: User can sign in and view temperature for Seattle', async ({ page }) => {
  const weatherPage = new WeatherPage(page);

  await weatherPage.goToMainPage();
  await weatherPage.signIn();
  await weatherPage.searchCity('Seattle');
  await weatherPage.validateTemperatureVisible();
});