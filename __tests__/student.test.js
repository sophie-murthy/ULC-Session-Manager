import puppeteer from "puppeteer";

describe("Student Page", () => {

    let browser;
    let page;
    
    beforeAll(async () => {
        browser = await puppeteer.launch({
        //headless: false,
        //slowMo: 50,
        });
        page = await browser.newPage();
        await page.setDefaultTimeout(30000);
        await page.setViewport({ width: 1280, height: 720 }); // Example dimensions
        await page.goto("http://localhost:3000/login");
        await page.type(".login-username", "student");
        await page.type(".login-password", "Password4");
        await page.click(".login-button");
        await page.waitForSelector(".settings-container");
    }, 100000);
    
    afterAll(async () => {
        await browser.close();
    });

    test('Student page loads and session-list exists', async () => {
        await page.goto('http://localhost:3000/');
        await page.waitForSelector('.end-div2', {timeout: 10000});

        const sessionsAppear = await page.evaluate(() => {
            const sessionEl = document.querySelector('.session-list');
            return Boolean(sessionEl);
        });

        expect(sessionsAppear).toBe(true);

    });

    test('Student can request a session', async () => {
        await page.goto('http://localhost:3000/');
        await page.waitForSelector('.end-div2', {timeout: 10000});

        const sessionsLength = await page.evaluate(() => {
            const sessions = document.querySelectorAll('.session');
            return sessions.length;
        });

        const requestButtonExists = await page.evaluate(() => {
            const reqButton = document.querySelector('.request-button');
            return Boolean(reqButton);
        });

        expect(requestButtonExists).toBe(true);

        await page.click('.request-button');

        const modalExists = await page.evaluate(() => {
            const modal = document.querySelector('#coursePopup');
            const style = window.getComputedStyle(modal);
            return style.display !== 'none';
        })

        expect(modalExists).toBe(true);

        await page.click('.close');

        await page.waitForSelector('.end-div2', {timeout: 10000});

        const modalGone = await page.evaluate(() => {
            const modal = document.querySelector('dialog');
            const style = window.getComputedStyle(modal);
            return style.display === 'none';
        })

        expect(modalGone).toBe(true);


        await page.click('.request-button');
        await page.select('#courseSelect', '66219114550a222c9e905ebe');
        await page.click('.submit-button');

        await page.waitForSelector('.end-div2', {timeout: 10000});

        const sessionsLegnthAfter = await page.evaluate(() => {
            const sessions = document.querySelectorAll('.session');
            return sessions.length;
        });

        const sessionAdded = sessionsLegnthAfter == sessionsLength + 1;

        expect(sessionAdded).toBe(true);

    }, 10000);

    test('Student can cancel a session', async () => {
        await page.goto('http://localhost:3000/');
        await page.waitForSelector('.end-div2', {timeout: 10000});

        const pendingSessions = await page.evaluate(() => {
            const sessions = Array.from(document.querySelectorAll('.session'));
            const pending = sessions.filter(session => {
                //const title = session.querySelector('.pending-header');
                //return title.textContent === "Pending Session";
                const cancelBtn = session.querySelector('.cancel-button');
                return Boolean(cancelBtn);
            }).map(session => session.id);
            return pending;
        });

        if (pendingSessions.length == 0) {
            console.log('No pending sessions');
            return;
        }

        const sessionID = pendingSessions[0];

        await page.click(`#${sessionID} .cancel-button`);
        await page.reload();
        await page.waitForSelector('.end-div2', {timeout: 10000});

        const sessionGone = await page.evaluate((sessionID) => {
            const session = document.querySelector(`#${sessionID}`);
            return !session;
        }, sessionID);

        expect(sessionGone).toBe(true);


    }, 10000);

});