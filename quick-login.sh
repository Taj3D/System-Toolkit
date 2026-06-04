#!/bin/bash
CODE="$1"

if [ -z "$CODE" ]; then
  echo "Usage: $0 <6-digit-code>"
  exit 1
fi

echo "🚀 Quick login with code: $CODE"

node -e "
const { chromium } = require('playwright');

(async () => {
  const code = '$CODE';
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  
  // Fast login
  await page.goto('https://app.brevo.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Accept cookies quick
  try { await page.click('button:has-text(\"Accept\")'); await page.waitForTimeout(500); } catch(e) {}
  
  // Fill and submit
  await page.fill('input[name=\"email\"]', 'conceptbd.net@gmail.com');
  await page.fill('input[type=\"password\"]', '@@taj921988@@');
  await page.click('button:has-text(\"Log In\")');
  await page.waitForTimeout(4000);
  
  // Enter code immediately
  await page.fill('input[name=\"verification_code\"]', code);
  await page.waitForTimeout(500);
  await page.click('button:has-text(\"Verify\")');
  await page.waitForTimeout(6000);
  
  console.log('URL after verify:', page.url());
  await page.screenshot({ path: '/home/z/my-project/brevo-quick-result.png' });
  
  // Go to IP settings
  await page.goto('https://app.brevo.com/settings/security/authorised-ips');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: '/home/z/my-project/brevo-quick-ip.png' });
  
  console.log('IP page URL:', page.url());
  
  await browser.close();
})();
"
