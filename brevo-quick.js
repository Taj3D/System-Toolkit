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
    await page.waitForTimeout(2000);
    
    // Fill credentials FAST
    console.log('📝 Filling credentials...');
    await page.locator('input[name*="email"]').first().fill('conceptbd.net@gmail.com');
    await page.locator('input[type="password"]').first().fill('@@taj921988@@');
    
    // Click login FAST
    console.log('🖱️ Clicking Log In...');
    await page.locator('button').filter({ hasText: 'Log In' }).first().click();
    
    await page.waitForTimeout(3000);
    console.log('📍 URL:', page.url());
    
    // ENTER CODE IMMEDIATELY
    const code = '769237';
    console.log('🔐 Entering code:', code);
    
    const codeInput = page.locator('input:visible').first();
    await codeInput.click();
    await codeInput.fill(code);
    
    await page.waitForTimeout(300);
    
    // Click verify FAST
    const verifyBtn = page.locator('button').filter({ hasText: 'Verify' }).first();
    await verifyBtn.click();
    console.log('🖱️ Clicked Verify');
    
    await page.waitForTimeout(5000);
    console.log('📍 After verify URL:', page.url());
    
    await page.screenshot({ path: '/home/z/my-project/result-1.png' });
    
    // Check if logged in
    const currentUrl = page.url();
    if (!currentUrl.includes('2fa') && !currentUrl.includes('login')) {
      console.log('✅ LOGIN SUCCESSFUL!');
      
      // Go to IP settings immediately
      console.log('🌐 Going to IP authorization...');
      await page.goto('https://app.brevo.com/security/authorised_ips');
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: '/home/z/my-project/result-2-ip-page.png', fullPage: true });
      
      // Get page content
      const content = await page.innerText('body');
      console.log('📄 IP Page:');
      console.log(content.substring(0, 2000));
      
      // Find and click disable/allow options
      console.log('🔍 Processing IP settings...');
      
      // Get all interactive elements
      const allButtons = await page.locator('button').all();
      console.log('Buttons found:', allButtons.length);
      
      for (const btn of allButtons) {
        try {
          const text = await btn.innerText();
          const lowerText = text.toLowerCase();
          
          if (lowerText.includes('disable') || lowerText.includes('deactivate') || 
              lowerText.includes('allow') || lowerText.includes('remove') ||
              lowerText.includes('turn off')) {
            console.log('🖱️ Clicking button:', text);
            await btn.click();
            await page.waitForTimeout(800);
          }
        } catch (e) {}
      }
      
      // Check for toggles/switches
      const switches = await page.locator('[role="switch"], [class*="toggle"], [class*="switch"], input[type="checkbox"]').all();
      console.log('Switches found:', switches.length);
      
      for (const sw of switches) {
        try {
          const isChecked = await sw.getAttribute('aria-checked');
          if (isChecked === 'true') {
            console.log('🖱️ Clicking checked switch to disable');
            await sw.click();
            await page.waitForTimeout(500);
          }
        } catch (e) {
          try {
            await sw.click();
            await page.waitForTimeout(300);
          } catch (e2) {}
        }
      }
      
      // Look for confirm/save button
      const saveBtn = page.locator('button').filter({ hasText: 'Save' }).first();
      if (await saveBtn.count() > 0) {
        await saveBtn.click();
        console.log('✅ Clicked Save');
        await page.waitForTimeout(2000);
      }
      
      const confirmBtn = page.locator('button').filter({ hasText: 'Confirm' }).first();
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
        console.log('✅ Clicked Confirm');
        await page.waitForTimeout(2000);
      }
      
      await page.screenshot({ path: '/home/z/my-project/result-3-final.png', fullPage: true });
      
      // Get final state
      const finalContent = await page.innerText('body');
      console.log('');
      console.log('📄 FINAL STATE:');
      console.log(finalContent.substring(0, 1500));
      
      console.log('');
      console.log('✅ ========================================');
      console.log('✅ IP SETTINGS UPDATED!');
      console.log('✅ Check screenshots: result-*.png');
      console.log('✅ ========================================');
      
    } else {
      console.log('⚠️ Login may have failed');
      const bodyText = await page.innerText('body');
      console.log('Page says:', bodyText.substring(0, 500));
    }
    
    await browser.close();
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
