import puppeteer from "puppeteer";

describe("Tutor Page", () => {

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
        await page.type(".login-username", "tutor");
        await page.type(".login-password", "Password4");
        await page.click(".login-button");
        await page.waitForSelector(".settings-container2");
    }, 100000);
    
    afterAll(async () => {
        await browser.close();
    });

    test('Tutor page loads and session-list exists', async () => {

        await page.goto('http://localhost:3000/');
        await page.waitForSelector('.end-div2', {timeout: 10000});

        const sessionsAppear = await page.evaluate(() => {
            const sessionEl = document.querySelector('.session-list');
            return Boolean(sessionEl);
        });

        expect(sessionsAppear).toBe(true);

    });

    test('Tutor can start as session', async () => {

        await page.goto('http://localhost:3000/');
        await page.waitForSelector('.end-div2', {timeout: 10000});

        const sessionstoStart = await page.evaluate(() => {
            const sessions = Array.from(document.querySelectorAll('.session'));
            const needStart = sessions.filter(session => {
                const start = session.querySelector('.start-button');
                return Boolean(start);
            }).map(session => session.id);
            return needStart;
        });

        if (sessionstoStart.length == 0) {
            console.log('No sessions to start');
            return;
        }

        const sessionID = sessionstoStart[0];

        await page.click(`#${sessionID} .start-button`);

        await page.waitForSelector(`#${sessionID} .edit-button`, {timeout: 10000});

        const sessionStarted = await page.evaluate((sessionID) => {
            const session = document.querySelector(`#${sessionID}`);
            const editButton = session.querySelector('.edit-button');
            return Boolean(editButton);
        }, sessionID);

        expect(sessionStarted).toBe(true);


    });


});