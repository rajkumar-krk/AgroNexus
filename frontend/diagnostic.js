const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log('Navigating to http://localhost:3000/dashboard ...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' }).catch(e => console.log(e));
  
  // Wait a bit to capture any async React errors
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
