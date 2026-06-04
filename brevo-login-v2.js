const { chromium } = require('playwright');

async function main() {
  console.log('🚀 Starting Brevo login process...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to login page
    console.log('📍 Navigating to Brevo login...');
    await page.goto('https://app.brevo.com/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Accept cookies if present
    try {
      const acceptCookies = await page.$('button:has-text("Accept All Cookies")');
      if (acceptCookies) {
        console.log('🍪 Accepting cookies...');
        await acceptCookies.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}
    
    // Step 2: Fill email
    console.log('📝 Filling email...');
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });
    await page.fill('input[type="email"]', 'conceptbd.net@gmail.com');
    
    // Step 3: Fill password
    console.log('📝 Filling password...');
    await page.fill('input[type="password"]', '@@taj921988@@');
    
    await page.screenshot({ path: '/home/z/my-project/brevo-v2-filled.png' });
    console.log('📸 Screenshot: brevo-v2-filled.png');
    
    // Step 4: Click Log In button by text
    console.log('🖱️ Clicking Log In button...');
    await page.click('button:has-text("Log In")');
    
    // Wait for navigation
    console.log('⏳ Waiting for login to complete...');
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-v2-after-login.png' });
    console.log('📸 Screenshot: brevo-v2-after-login.png');
    console.log('📍 Current URL:', page.url());
    
    // Check if 2FA page
    const currentUrl = page.url();
    
    if (currentUrl.includes('2fa') || currentUrl.includes('verification')) {
      console.log('🔐 2FA page detected!');
      
      await page.waitForTimeout(2000);
      
      // Find OTP input - could be single or multiple inputs
      const singleInput = await page.$('input[type="text"]:not([type="password"]), input[inputmode="numeric"]');
      
      if (singleInput) {
        console.log('📝 Found single OTP input, filling code...');
        await singleInput.fill('891489');
      } else {
        // Check for multiple inputs (one per digit)
        const otpInputs = await page.$$('input[type="text"]');
        if (otpInputs.length > 1) {
          console.log('📝 Found multiple OTP inputs:', otpInputs.length);
          const otpCode = '891489';
          for (let i = 0; i < otpInputs.length && i < otpCode.length; i++) {
            await otpInputs[i].fill(otpCode[i]);
          }
        }
      }
      
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '/home/z/my-project/brevo-v2-otp-filled.png' });
      console.log('📸 Screenshot: brevo-v2-otp-filled.png');
      
      // Click verify/continue button
      try {
        const verifyBtn = await page.$('button:has-text("Verify"), button:has-text("Continue"), button:has-text("Confirm")');
        if (verifyBtn) {
          console.log('🖱️ Clicking verify button...');
          await verifyBtn.click();
          await page.waitForTimeout(5000);
        }
      } catch (e) {
        console.log('⚠️ No verify button found, trying to submit form...');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);
      }
      
      await page.screenshot({ path: '/home/z/my-project/brevo-v2-after-verify.png' });
      console.log('📸 Screenshot: brevo-v2-after-verify.png');
      console.log('📍 URL after verify:', page.url());
    }
    
    // Navigate to IP authorization page
    console.log('📍 Navigating to IP authorization page...');
    await page.goto('https://app.brevo.com/settings/security/authorised-ips', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-v2-ip-page.png' });
    console.log('📸 Screenshot: brevo-v2-ip-page.png');
    console.log('📍 IP Page URL:', page.url());
    console.log('📄 Page title:', await page.title());
    
    // Get page HTML for analysis
    const htmlContent = await page.content();
    console.log('📄 Page loaded, checking content...');
    
    // Look for IP restriction toggle
    const toggles = await page.$$('button[role="switch"], input[type="checkbox"], .toggle-switch');
    console.log('🔍 Found', toggles.length, 'toggle elements');
    
    // Look for disable/deactivate button
    const disableBtn = await page.$('button:has-text("Disable"), button:has-text("Deactivate"), button:has-text("Turn off")');
    if (disableBtn) {
      console.log('🖱️ Found disable button, clicking...');
      await disableBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/home/z/my-project/brevo-v2-disabled.png' });
      console.log('📸 Screenshot: brevo-v2-disabled.png');
    }
    
    // Check for current IP
    const pageText = await page.textContent('body');
    if (pageText.includes('47.57.242.119')) {
      console.log('✅ Current IP found on page');
    }
    
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: '/home/z/my-project/brevo-v2-error.png' });
    console.log('📸 Error screenshot saved');
  }
  
  await browser.close();
}

main().catch(console.error);
