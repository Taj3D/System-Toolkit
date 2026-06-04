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
  await page.waitForLoadState('networkidle');
  
  // Fill login form
  console.log('📝 Filling credentials...');
  await page.fill('input[type="email"]', 'conceptbd.net@gmail.com');
  await page.fill('input[type="password"]', '@@taj921988@@');
  
  await page.screenshot({ path: '/home/z/my-project/step1-filled.png' });
  
  // Click login
  console.log('🖱️ Clicking login...');
  await page.click('button[type="submit"]');
  
  // Wait for page transition
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  console.log('📍 URL:', page.url());
  await page.screenshot({ path: '/home/z/my-project/step2-after-login.png' });
  
  // Check if on 2FA page
  const bodyText = await page.innerText('body');
  
  if (bodyText.includes('verification code') || bodyText.includes('Verify')) {
    console.log('🔐 On verification page...');
    
    // Find input fields for code - Brevo may have individual inputs
    const inputs = await page.locator('input[type="text"], input[type="number"], input:not([type])').all();
    console.log('Found inputs:', inputs.length);
    
    // Try single input first
    const singleInput = await page.locator('input[inputmode="numeric"], input[maxlength="6"], input[placeholder*="code"]').first();
    
    if (await singleInput.count() > 0) {
      console.log('📝 Entering code in single input...');
      await singleInput.click();
      await singleInput.fill('955109');
    } else if (inputs.length >= 6) {
      // Individual digit inputs
      console.log('📝 Entering code digit by digit...');
      const code = '955109';
      for (let i = 0; i < 6 && i < inputs.length; i++) {
        await inputs[i].click();
        await inputs[i].fill(code[i]);
        await page.waitForTimeout(100);
      }
    } else {
      // Try any visible input
      console.log('📝 Trying first available input...');
      const firstInput = await page.locator('input:visible').first();
      await firstInput.click();
      await firstInput.fill('955109');
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/z/my-project/step3-code-entered.png' });
    
    // Try to submit - sometimes auto-submits
    console.log('⏳ Waiting for auto-submit or clicking verify...');
    await page.waitForTimeout(3000);
    
    // Check if we need to click a button
    const verifyBtn = await page.locator('button:has-text("Verify"), button:has-text("Confirm"), button[type="submit"]').first();
    if (await verifyBtn.count() > 0 && await verifyBtn.isVisible()) {
      await verifyBtn.click();
      console.log('🖱️ Clicked verify button');
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log('📍 URL after verify:', page.url());
    await page.screenshot({ path: '/home/z/my-project/step4-after-verify.png' });
  }
  
  // Check current state
  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);
  
  const pageContent = await page.innerText('body');
  console.log('📄 Page content preview:', pageContent.substring(0, 800));
  
  // If still on 2FA page, code might be expired
  if (currentUrl.includes('2fa') && pageContent.includes('incorrect') || pageContent.includes('expired') || pageContent.includes('invalid')) {
    console.log('');
    console.log('⚠️ Code may have expired or is incorrect');
    console.log('📧 Please check your email for a new code');
  }
  
  // If logged in successfully
  if (!currentUrl.includes('2fa') && !currentUrl.includes('login')) {
    console.log('✅ Login successful!');
    
    // Go to IP settings
    console.log('🌐 Navigating to IP settings...');
    await page.goto('https://app.brevo.com/security/authorised_ips');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: '/home/z/my-project/step5-ip-settings.png', fullPage: true });
    
    const ipContent = await page.innerText('body');
    console.log('📄 IP Settings page:');
    console.log(ipContent.substring(0, 2000));
    
    // Look for toggle or disable option
    console.log('🔍 Looking for disable options...');
    
    // Get all buttons and their text
    const buttons = await page.locator('button').all();
    console.log('Found buttons:', buttons.length);
    
    for (const btn of buttons) {
      try {
        const text = await btn.innerText();
        console.log('Button text:', text);
        
        if (text.toLowerCase().includes('disable') || 
            text.toLowerCase().includes('deactivate') ||
            text.toLowerCase().includes('allow all')) {
          console.log('🖱️ Clicking button:', text);
          await btn.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {}
    }
    
    // Look for toggles/switches
    const toggles = await page.locator('[role="switch"], [role="checkbox"], .toggle, .switch, input[type="checkbox"]').all();
    console.log('Found toggles:', toggles.length);
    
    for (const toggle of toggles) {
      try {
        const isChecked = await toggle.getAttribute('aria-checked');
        const isChecked2 = await toggle.isChecked?.().catch(() => null);
        console.log('Toggle state:', isChecked, isChecked2);
        
        if (isChecked === 'true' || isChecked2 === true) {
          console.log('🖱️ Clicking toggle to disable...');
          await toggle.click();
          await page.waitForTimeout(500);
        }
      } catch (e) {}
    }
    
    await page.screenshot({ path: '/home/z/my-project/step6-final.png', fullPage: true });
    console.log('📸 Final screenshot saved');
  }
  
  await browser.close();
  console.log('✅ Done!');
})();
