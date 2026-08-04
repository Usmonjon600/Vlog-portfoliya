const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

    await page.goto('https://vlog-portfoliya-wv41.vercel.app/admin', { waitUntil: 'networkidle2' });
    
    // Check if window.handleInput is defined
    const isDefined = await page.evaluate(() => typeof window.handleInput !== 'undefined');
    console.log('Is window.handleInput defined?', isDefined);
    
    await browser.close();
})();
