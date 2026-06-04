const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    console.log('🌐 Opening Brevo login page...');
    await page.goto('https://app.brevo.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    // Fill email - using the selector that worked
    console.log('📝 Filling email...');
    const emailInput = page.locator('input[name*="email"]').first();
    await emailInput.fill('conceptbd.net@gmail.com');
    
    // Fill password
    console.log('📝 Filling password...');
    const pwdInput = page.locator('input[type="password"]').first();
    await pwdInput.fill('@@taj921988@@');
    
    await page.screenshot({ path: '/home/z/my-project/filled.png' });
    
    // Find login button by text
    console.log('🔍 Finding login button...');
    const buttons = await page.locator('button').all();
    console.log('Found buttons:', buttons.length);
    
    for (let i = 0; i < buttons.length; i++) {
      try {
        const text = await buttons[i].innerText();
        console.log(`Button ${i}: "${text}"`);
      } catch (e) {}
    }
    
    // Try clicking by text
    const loginBtn = page.locator('button').filter({ hasText: 'Log in' }).first();
    if (await loginBtn.count() > 0) {
      console.log('Clicking "Log in" button...');
      await loginBtn.click();
    } else {
      // Try alternative
      const altBtn = page.locator('button:has-text("Log"), button:has-text("Sign")').first();
      if (await altBtn.count() > 0) {
        await altBtn.click();
        console.log('Clicked alternative login button');
      }
    }
    
    // Wait for navigation
    await page.waitForTimeout(5000);
    
    console.log('📍 URL after login:', page.url());
    await page.screenshot({ path: '/home/z/my-project/after-login.png' });
    
    // Check for 2FA
    const bodyText = await page.innerText('body');
    
    if (bodyText.includes('verification') || bodyText.includes('Verify') || bodyText.includes('code') || page.url().includes('2fa')) {
      console.log('🔐 On 2FA page, entering code...');
      
      await page.waitForTimeout(2000);
      
      // Find all visible inputs
      const inputs = await page.locator('input:visible').all();
      console.log('Visible inputs:', inputs.length);
      
      // Enter code in the first visible input
      if (inputs.length > 0) {
        await inputs[0].click();
        await inputs[0].fill('955109');
        console.log('Entered code: 955109');
      }
      
      await page.screenshot({ path: '/home/z/my-project/code-entered.png' });
      
      // Wait and check for auto-submit
      await page.waitForTimeout(3000);
      
      // Or click verify
      const verifyBtn = page.locator('button').filter({ hasText: 'Verify' }).first();
      if (await verifyBtn.count() > 0) {
        await verifyBtn.click();
        console.log('Clicked Verify');
      }
      
      await page.waitForTimeout(5000);
    }
    
    console.log('📍 Final URL:', page.url());
    await page.screenshot({ path: '/home/z/my-project/final.png' });
    
    const finalContent = await page.innerText('body');
    console.log('📄 Page preview:', finalContent.substring(0, 1500));
    
    // If logged in, go to IP settings
    if (!page.url().includes('login') && !page.url().includes('2fa')) {
      console.log('✅ Login successful! Going to IP settings...');
      await page.goto('https://app.brevo.com/security/authorised_ips');
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: '/home/z/my-project/ip-settings.png', fullPage: true });
      
      const ipContent = await page.innerText('body');
      console.log('📄 IP Settings:', ipContent.substring(0, 2000));
    }
    
    await browser.close();
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
