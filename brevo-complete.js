const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const code = '015645';
  console.log('🔐 Using code:', code);
  
  console.log('🌐 Opening Brevo...');
  await page.goto('https://app.brevo.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Login
  console.log('📝 Logging in...');
  await page.locator('input[type="email"], input[name*="email"]').first().fill('conceptbd.net@gmail.com');
  await page.locator('input[type="password"]').first().fill('@@taj921988@@');
  await page.locator('button').filter({ hasText: 'Log' }).first().click();
  
  await page.waitForTimeout(3000);
  console.log('📍 URL:', page.url());
  
  // Enter code immediately
  console.log('📝 Entering code:', code);
  const codeInput = await page.locator('input:visible').first();
  await codeInput.fill(code);
  await page.waitForTimeout(300);
  
  // Click verify
  await page.locator('button').filter({ hasText: 'Verify' }).first().click();
  console.log('🖱️ Clicked Verify');
  
  await page.waitForTimeout(5000);
  console.log('📍 After verify:', page.url());
  
  // Check if logged in
  const currentUrl = page.url();
  if (!currentUrl.includes('2fa') && !currentUrl.includes('login')) {
    console.log('✅ LOGIN SUCCESS!');
    
    // Go to IP settings
    console.log('🌐 Going to IP settings...');
    await page.goto('https://app.brevo.com/security/authorised_ips');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '/home/z/my-project/ip-settings-page.png', fullPage: true });
    
    const content = await page.innerText('body');
    console.log('📄 IP Settings Page:');
    console.log(content.substring(0, 2000));
    
    // Try to find and click disable options
    console.log('🔍 Looking for disable options...');
    
    // Get all buttons
    const buttons = await page.locator('button').all();
    for (const btn of buttons) {
      try {
        const text = await btn.innerText();
        if (text.toLowerCase().includes('disable') || 
            text.toLowerCase().includes('deactivate') ||
            text.toLowerCase().includes('allow all') ||
            text.toLowerCase().includes('remove')) {
          console.log('🖱️ Clicking:', text);
          await btn.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {}
    }
    
    // Look for toggles/switches
    const switches = await page.locator('[role="switch"], [class*="toggle"], [class*="switch"], input[type="checkbox"]').all();
    for (const sw of switches) {
      try {
        await sw.click();
        console.log('🖱️ Clicked toggle');
        await page.waitForTimeout(500);
      } catch (e) {}
    }
    
    // Try to save
    const saveBtn = await page.locator('button').filter({ hasText: 'Save' }).first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      console.log('✅ Clicked Save');
      await page.waitForTimeout(2000);
    }
    
    await page.screenshot({ path: '/home/z/my-project/ip-final-result.png', fullPage: true });
    
    const final = await page.innerText('body');
    console.log('');
    console.log('📄 FINAL STATE:');
    console.log(final.substring(0, 1500));
    
  } else {
    console.log('⚠️ Code may be expired or incorrect');
    const body = await page.innerText('body');
    console.log('Page:', body.substring(0, 400));
  }
  
  await browser.close();
  console.log('✅ Done!');
})();
