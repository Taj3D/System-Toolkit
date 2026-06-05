const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to Brevo login...');
  await page.goto('https://app.brevo.com/', { waitUntil: 'networkidle' });
  
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
  
  // Take screenshot
  await page.screenshot({ path: '/home/z/my-project/brevo-1.png', fullPage: true });
  console.log('Screenshot saved to brevo-1.png');
  
  await browser.close();
}

main().catch(console.error);
