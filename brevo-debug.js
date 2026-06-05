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
    
    // Wait for page to be ready
    await page.waitForTimeout(5000);
    
    // Take screenshot
    await page.screenshot({ path: '/home/z/my-project/debug-1.png' });
    console.log('📸 Screenshot 1 saved');
    
    // Find all inputs
    const allInputs = await page.locator('input').all();
    console.log('Found inputs:', allInputs.length);
    
    // Get page content
    const html = await page.content();
    console.log('Page HTML length:', html.length);
    
    // Find email input by various methods
    let emailFound = false;
    const emailSelectors = [
      'input[type="email"]',
      'input[name*="email"]',
      'input[id*="email"]',
      'input[placeholder*="email"]',
      'input[autocomplete="email"]'
    ];
    
    for (const sel of emailSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.count() > 0) {
          console.log('Found email input:', sel);
          await el.fill('conceptbd.net@gmail.com');
          emailFound = true;
          break;
        }
      } catch (e) {}
    }
    
    if (!emailFound) {
      // Try by position - usually email is first
      const firstInput = page.locator('input').first();
      await firstInput.fill('conceptbd.net@gmail.com');
      console.log('Used first input for email');
    }
    
    // Find password input
    const pwdInput = page.locator('input[type="password"]').first();
    await pwdInput.fill('@@taj921988@@');
    console.log('Filled password');
    
    await page.screenshot({ path: '/home/z/my-project/debug-2.png' });
    
    // Find and click submit button
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    console.log('Clicked submit');
    
    // Wait for response
    await page.waitForTimeout(5000);
    
    console.log('URL:', page.url());
    await page.screenshot({ path: '/home/z/my-project/debug-3.png' });
    
    // Check for 2FA
    const body = await page.innerText('body');
    
    if (body.includes('verification') || body.includes('Verify') || body.includes('code')) {
      console.log('🔐 2FA page detected');
      
      // Wait for 2FA input
      await page.waitForTimeout(2000);
      
      // Find code input
      const codeInputs = await page.locator('input').all();
      console.log('Inputs on 2FA page:', codeInputs.length);
      
      // Enter code
      const codeInput = page.locator('input').first();
      await codeInput.click();
      await codeInput.fill('955109');
      console.log('Entered code: 955109');
      
      await page.screenshot({ path: '/home/z/my-project/debug-4.png' });
      
      // Wait for auto-submit or click submit
      await page.waitForTimeout(3000);
      
      // Check for submit button on 2FA
      const verifyBtn = page.locator('button').filter({ hasText: 'Verify' }).first();
      if (await verifyBtn.count() > 0) {
        await verifyBtn.click();
        console.log('Clicked Verify');
      }
      
      await page.waitForTimeout(5000);
      console.log('URL after verify:', page.url());
    }
    
    await page.screenshot({ path: '/home/z/my-project/debug-5.png' });
    console.log('Final URL:', page.url());
    
    const finalContent = await page.innerText('body');
    console.log('Final page preview:', finalContent.substring(0, 1000));
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
