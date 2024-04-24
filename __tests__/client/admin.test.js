import puppeteer from "puppeteer";

describe("Admin Page", () => {

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
        await page.type(".login-username", "admin");
        await page.type(".login-password", "Password4");
        await page.click(".login-button");
        await page.waitForSelector(".settings-container2");
    }, 100000);
    
    afterAll(async () => {
        await browser.close();
    });
    
    test('Admin page loads and can handle zero or more sessions', async () => {
        await page.goto('http://localhost:3000/'); 
    
        const noSessionsMessage = await page.evaluate(() => {
          const noSessionsEl = document.querySelector('.no-sessions');
          return noSessionsEl ? noSessionsEl.innerText : null;
        });
    
        const sessionListExists = await page.evaluate(() => {
          const sessionListEl = document.querySelector('.session-list');
          return Boolean(sessionListEl);
        });
    
        if (noSessionsMessage) {
          expect(noSessionsMessage).toContain('No Current Sessions');
        } else {

        }

        expect(sessionListExists).toBe(true);
      }, 100000);

    test('Admin can assign a tutor to the first session needing one', async () => {
        await page.goto('http://localhost:3000/');
        await page.waitForSelector('.end-div2', { timeout: 10000 });
        await page.waitForFunction(() => document.querySelectorAll('.session').length > 0, {timeout: 10000});

        const sessionID = await page.evaluate(() => {
            const sessions = Array.from(document.querySelectorAll('.session'));
            for (const session of sessions) {
                const tutorHeader = session.querySelector('.pending-tutor');
                const text = tutorHeader.textContent;
                if (!text.includes('Tutor:')) {
                    return session.id;
                }
            }
            return null;
        });

        if (!sessionID) {
            console.log('No sessions need a tutor');
            return; 
        }

        const [tutorOptionsCount, select] = await page.evaluate(sessionID => {
            const session = document.querySelector(`#${sessionID}`);
            const select = session.querySelector('.select');
            return [select ? select.options.length : 0, select];
        }, sessionID);

        expect(tutorOptionsCount).toBeGreaterThan(0);
    
        if (tutorOptionsCount > 0) {
            const tutorName = await page.evaluate((sessionID) => {
                const session = document.querySelector(`#${sessionID}`);
                const select = session.querySelector('.select');
                const selectedIndex = select.selectedIndex;
                return select.options[selectedIndex].text;
            }, sessionID);
    
            await page.select(`#${sessionID} .select`, '6621918e550a222c9e905efe');
            await page.click(`#${sessionID} .assign-button`);

            await page.waitForSelector(`#${sessionID} .edit-button`, { timeout: 10000 });

            const [tutorNamePresent, present] = await page.evaluate((sessionID) => {
                const session = document.querySelector(`#${sessionID}`);
                const tutorElement = session.querySelector('.pending-tutor');
                return [Boolean(tutorElement), tutorElement.textContent.includes('Tutor:')];
            }, sessionID);

            expect(tutorNamePresent).toBe(true);

            expect(present).toBe(true);
        }
    }, 100000);
    
});




