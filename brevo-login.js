const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('🌐 Opening Brevo login page...');
  await page.goto('https://app.brevo.com/login');
  await page.waitForTimeout(2000);
  
  // Take screenshot of login page
  await page.screenshot({ path: '/home/z/my-project/brevo-1-login.png' });
  console.log('📸 Screenshot saved: brevo-1-login.png');
  
  // Fill email
  console.log('📝 Filling email...');
  const emailInput = await page.locator('input[type="email"], input[name="email"], input[id*="email"]').first();
  await emailInput.fill('conceptbd.net@gmail.com');
  
  // Fill password
  console.log('📝 Filling password...');
  const passwordInput = await page.locator('input[type="password"]').first();
  await passwordInput.fill('@@taj921988@@');
  
  await page.screenshot({ path: '/home/z/my-project/brevo-2-filled.png' });
  console.log('📸 Screenshot saved: brevo-2-filled.png');
  
  // Click login button
  console.log('🖱️ Clicking login button...');
  const loginButton = await page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Login"), input[type="submit"]').first();
  await loginButton.click();
  
  // Wait for navigation
  console.log('⏳ Waiting for login...');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: '/home/z/my-project/brevo-3-after-login.png' });
  console.log('📸 Screenshot saved: brevo-3-after-login.png');
  
  // Check current URL
  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);
  
  // Navigate to IP authorization page
  console.log('🌐 Navigating to IP authorization page...');
  await page.goto('https://app.brevo.com/security/authorised_ips');
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/home/z/my-project/brevo-4-ip-page.png' });
  console.log('📸 Screenshot saved: brevo-4-ip-page.png');
  
  // Get page content
  const content = await page.content();
  console.log('📄 Page title:', await page.title());
  
  // Look for IP restriction toggle/checkbox
  console.log('🔍 Looking for IP restriction settings...');
  
  // Try to find and click the "Allow all IPs" or disable restriction
  try {
    // Look for various possible elements
    const selectors = [
      'button:has-text("Allow all")',
      'button:has-text("Disable")',
      'input[type="checkbox"]',
      '.toggle',
      '[class*="toggle"]',
      '[class*="switch"]',
      'label:has-text("IP")',
      'button:has-text("IP")'
    ];
    
    for (const selector of selectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          console.log('✅ Found element:', selector);
          await element.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    await page.screenshot({ path: '/home/z/my-project/brevo-5-after-click.png' });
    console.log('📸 Screenshot saved: brevo-5-after-click.png');
    
  } catch (e) {
    console.log('⚠️ Error clicking:', e.message);
  }
  
  // Get final page state
  const pageText = await page.innerText('body');
  console.log('📄 Page content preview:', pageText.substring(0, 500));
  
  await browser.close();
  console.log('✅ Done!');
})();
