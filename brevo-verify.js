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
  
  // Fill login form
  console.log('📝 Filling credentials...');
  const emailInput = await page.locator('input[type="email"], input[name="email"], input[id*="email"]').first();
  await emailInput.fill('conceptbd.net@gmail.com');
  
  const passwordInput = await page.locator('input[type="password"]').first();
  await passwordInput.fill('@@taj921988@@');
  
  // Click login
  console.log('🖱️ Clicking login...');
  const loginButton = await page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Login"), input[type="submit"]').first();
  await loginButton.click();
  
  await page.waitForTimeout(3000);
  
  // Check if on 2FA page
  const url = page.url();
  console.log('📍 Current URL:', url);
  
  if (url.includes('2fa') || url.includes('verification')) {
    console.log('🔐 On 2FA page, entering code...');
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Enter verification code
    const codeInput = await page.locator('input[type="text"], input[type="number"], input[maxlength="6"], input[inputmode="numeric"]').first();
    await codeInput.fill('955109');
    console.log('📝 Entered code: 955109');
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/z/my-project/brevo-code-entered.png' });
    console.log('📸 Screenshot: brevo-code-entered.png');
    
    // Click verify button
    const verifyButton = await page.locator('button:has-text("Verify"), button[type="submit"], input[type="submit"]').first();
    await verifyButton.click();
    console.log('🖱️ Clicked Verify button');
    
    // Wait for login to complete
    await page.waitForTimeout(5000);
    
    const newUrl = page.url();
    console.log('📍 New URL:', newUrl);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-after-verify.png' });
    console.log('📸 Screenshot: brevo-after-verify.png');
    
    // Check if login successful
    if (!newUrl.includes('2fa') && !newUrl.includes('login')) {
      console.log('✅ Login successful!');
      
      // Navigate to IP authorization page
      console.log('🌐 Going to IP authorization page...');
      await page.goto('https://app.brevo.com/security/authorised_ips');
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: '/home/z/my-project/brevo-ip-page.png', fullPage: true });
      console.log('📸 Screenshot: brevo-ip-page.png');
      
      // Get page content
      const content = await page.innerText('body');
      console.log('📄 IP Page content:');
      console.log(content.substring(0, 2000));
      
      // Look for and click disable IP restriction
      console.log('🔍 Looking for IP restriction settings...');
      
      // Try different selectors for disabling IP restriction
      const disableSelectors = [
        'button:has-text("Disable")',
        'button:has-text("Allow all")',
        'button:has-text("Deactivate")',
        'input[type="checkbox"]',
        '.switch',
        '[class*="toggle"]',
        'button[aria-checked="true"]',
        'span[class*="toggle"]'
      ];
      
      for (const selector of disableSelectors) {
        try {
          const elements = await page.locator(selector).all();
          for (const el of elements) {
            if (await el.isVisible({ timeout: 500 })) {
              console.log('Found:', selector);
              await el.click();
              await page.waitForTimeout(1000);
            }
          }
        } catch (e) {}
      }
      
      // Look for Save button
      try {
        const saveBtn = await page.locator('button:has-text("Save"), button:has-text("Confirm"), button:has-text("Update")').first();
        if (await saveBtn.isVisible({ timeout: 2000 })) {
          await saveBtn.click();
          console.log('✅ Clicked Save button');
          await page.waitForTimeout(2000);
        }
      } catch (e) {}
      
      await page.screenshot({ path: '/home/z/my-project/brevo-final.png', fullPage: true });
      console.log('📸 Final screenshot: brevo-final.png');
      
      // Get final state
      const finalContent = await page.innerText('body');
      console.log('📄 Final page state:');
      console.log(finalContent.substring(0, 1500));
      
    } else {
      console.log('⚠️ Login may have failed, still on login/2fa page');
      await page.screenshot({ path: '/home/z/my-project/brevo-login-failed.png' });
    }
  } else {
    console.log('✅ Already logged in or no 2FA needed');
    await page.goto('https://app.brevo.com/security/authorised_ips');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/home/z/my-project/brevo-ip-page.png', fullPage: true });
  }
  
  await browser.close();
  console.log('✅ Done!');
})();
