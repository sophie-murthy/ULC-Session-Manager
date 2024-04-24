import puppeteer from 'puppeteer';

describe('Completed Sessions Page', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false, // Uncomment this line if you want to see the browser
      // slowMo: 50, // Slows down Puppeteer operations to make it more observable
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/login');

    // Replace the '#username' and '#password' with the actual selectors for your login form inputs
    await page.type('.login-username', 'admin');
    await page.type('.login-password', 'Password4');

    // Replace 'button[type="submit"]' with the actual selector for your login form submit button
    await page.click('.login-button');
    
    // Wait for navigation after login, which means waiting for a specific element on the page that appears only after login
    // Replace '.some-element-post-login' with a selector unique to the page you're redirected to after login
    await page.waitForSelector('.settings-container2'); 
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Should open modal on button click', async () => {
    await page.goto('http://localhost:3000/completed');
    await page.waitForSelector('.eval-button');
    await page.click('.eval-button'); 
    const modal = await page.waitForSelector('.modal', { visible: true });
    expect(modal).toBeTruthy();
  }, 10000);

});

