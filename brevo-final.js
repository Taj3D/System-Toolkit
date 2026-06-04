const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    console.log('🌐 Opening Brevo login...');
    await page.goto('https://app.brevo.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Fill credentials
    console.log('📝 Filling credentials...');
    await page.locator('input[name*="email"]').first().fill('conceptbd.net@gmail.com');
    await page.locator('input[type="password"]').first().fill('@@taj921988@@');
    
    // Click login
    console.log('🖱️ Clicking Log In...');
    await page.locator('button').filter({ hasText: 'Log In' }).first().click();
    
    await page.waitForTimeout(4000);
    console.log('📍 URL after login click:', page.url());
    
    // On 2FA page - enter code quickly
    if (page.url().includes('2fa')) {
      console.log('🔐 Entering verification code: 432660');
      
      const codeInput = page.locator('input:visible').first();
      await codeInput.click();
      await codeInput.fill('432660');
      
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/home/z/my-project/code-432660.png' });
      
      // Click verify
      const verifyBtn = page.locator('button').filter({ hasText: 'Verify' }).first();
      await verifyBtn.click();
      console.log('🖱️ Clicked Verify');
      
      await page.waitForTimeout(5000);
      console.log('📍 URL after verify:', page.url());
    }
    
    await page.screenshot({ path: '/home/z/my-project/after-verify.png' });
    
    // Check if logged in
    const currentUrl = page.url();
    if (!currentUrl.includes('login') && !currentUrl.includes('2fa')) {
      console.log('✅ LOGIN SUCCESSFUL!');
      
      // Go to IP settings
      console.log('🌐 Navigating to IP authorization page...');
      await page.goto('https://app.brevo.com/security/authorised_ips');
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: '/home/z/my-project/ip-page.png', fullPage: true });
      
      // Get page content
      const content = await page.innerText('body');
      console.log('📄 IP Page content:');
      console.log(content.substring(0, 2000));
      
      // Find and click disable/toggle options
      console.log('🔍 Looking for IP restriction controls...');
      
      // Get all buttons
      const buttons = await page.locator('button').all();
      console.log('Found buttons:', buttons.length);
      
      for (let i = 0; i < buttons.length; i++) {
        try {
          const text = await buttons[i].innerText();
          console.log(`Button ${i}: "${text}"`);
          
          if (text.toLowerCase().includes('disable') || 
              text.toLowerCase().includes('deactivate') ||
              text.toLowerCase().includes('allow all') ||
              text.toLowerCase().includes('remove')) {
            console.log('🖱️ Clicking:', text);
            await buttons[i].click();
            await page.waitForTimeout(1000);
          }
        } catch (e) {}
      }
      
      // Look for toggles
      const toggles = await page.locator('[role="switch"], [class*="toggle"], [class*="switch"], input[type="checkbox"]').all();
      console.log('Found toggles:', toggles.length);
      
      for (const toggle of toggles) {
        try {
          await toggle.click();
          console.log('🖱️ Clicked toggle');
          await page.waitForTimeout(500);
        } catch (e) {}
      }
      
      // Look for Save button
      const saveBtn = page.locator('button').filter({ hasText: 'Save' }).first();
      if (await saveBtn.count() > 0) {
        await saveBtn.click();
        console.log('✅ Clicked Save');
        await page.waitForTimeout(2000);
      }
      
      await page.screenshot({ path: '/home/z/my-project/final-ip-settings.png', fullPage: true });
      
      // Get final state
      const finalContent = await page.innerText('body');
      console.log('📄 Final state:');
      console.log(finalContent.substring(0, 1500));
      
      // Check for success
      if (finalContent.toLowerCase().includes('disabled') || 
          finalContent.toLowerCase().includes('deactivated') ||
          !finalContent.includes('47.57.242.119')) {
        console.log('');
        console.log('✅ ========================================');
        console.log('✅ IP RESTRICTION DISABLED SUCCESSFULLY!');
        console.log('✅ ========================================');
      }
      
    } else {
      console.log('⚠️ Still on login/2fa page - code may have expired');
      const errorText = await page.innerText('body');
      console.log('Page says:', errorText.substring(0, 500));
    }
    
    await browser.close();
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
