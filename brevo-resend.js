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
    await page.waitForTimeout(3000);
    
    // Fill credentials
    console.log('📝 Filling credentials...');
    await page.locator('input[name*="email"]').first().fill('conceptbd.net@gmail.com');
    await page.locator('input[type="password"]').first().fill('@@taj921988@@');
    
    // Click login
    console.log('🖱️ Clicking Log In...');
    await page.locator('button').filter({ hasText: 'Log In' }).first().click();
    
    await page.waitForTimeout(5000);
    
    console.log('📍 URL:', page.url());
    
    // Check if on 2FA page
    if (page.url().includes('2fa')) {
      console.log('🔐 On 2FA page');
      console.log('');
      console.log('⏳ Waiting for "Resend" option to become available...');
      
      // Wait for resend button (usually 60 seconds countdown)
      await page.waitForTimeout(60000); // Wait 60 seconds
      
      await page.screenshot({ path: '/home/z/my-project/2fa-wait.png' });
      
      // Look for resend button
      const resendBtn = page.locator('button').filter({ hasText: 'Resend' }).first();
      
      if (await resendBtn.count() > 0) {
        console.log('🖱️ Clicking Resend verification email...');
        await resendBtn.click();
        await page.waitForTimeout(5000);
        
        console.log('');
        console.log('📧 =========================================');
        console.log('📧 NEW CODE SENT! Check your email!');
        console.log('📧 Email: conceptbd.net@gmail.com');
        console.log('📧 =========================================');
        console.log('');
        console.log('👉 Please provide the NEW 6-digit code');
      } else {
        // Try clicking resend link
        const resendLink = page.locator('a').filter({ hasText: 'Resend' }).first();
        if (await resendLink.count() > 0) {
          await resendLink.click();
          console.log('📧 Clicked resend link');
        } else {
          console.log('⚠️ Could not find resend button');
        }
      }
      
      await page.screenshot({ path: '/home/z/my-project/after-resend.png' });
    }
    
    // Keep browser open and wait for new code
    console.log('');
    console.log('⏳ Waiting for you to check email and provide new code...');
    console.log('⏳ Browser will stay open for 2 minutes...');
    
    await page.waitForTimeout(120000); // Wait 2 minutes
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
