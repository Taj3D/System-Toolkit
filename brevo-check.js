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
  
  // Check if we're on 2FA page
  const url = page.url();
  console.log('📍 URL:', url);
  
  if (url.includes('2fa') || url.includes('verification')) {
    console.log('');
    console.log('⚠️ ========================================');
    console.log('⚠️ 2FA VERIFICATION REQUIRED!');
    console.log('⚠️ ========================================');
    console.log('');
    
    // Get the 2FA page content
    await page.waitForTimeout(2000);
    const pageText = await page.innerText('body');
    console.log('📄 Page says:', pageText.substring(0, 1000));
    
    // Look for verification code input
    const codeInput = await page.locator('input[type="text"], input[type="number"], input[maxlength]').first();
    const isCodeInputVisible = await codeInput.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isCodeInputVisible) {
      console.log('');
      console.log('📧 Brevo sent a verification code to your email!');
      console.log('📧 Check: conceptbd.net@gmail.com');
      console.log('');
      console.log('👉 Please provide the verification code and I will complete the login.');
    }
    
    await page.screenshot({ path: '/home/z/my-project/brevo-2fa-page.png', fullPage: true });
    console.log('📸 Screenshot saved: brevo-2fa-page.png');
    
    // Save state for later
    await page.context().storageState({ path: '/home/z/my-project/brevo-state.json' });
    
  } else {
    // Already logged in, go to IP settings
    console.log('✅ Logged in! Going to IP settings...');
    await page.goto('https://app.brevo.com/security/authorised_ips');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-ip-settings.png', fullPage: true });
    console.log('📸 Screenshot saved: brevo-ip-settings.png');
    
    // Get page content
    const content = await page.innerText('body');
    console.log('📄 IP Settings page:', content.substring(0, 1500));
  }
  
  await browser.close();
})();
