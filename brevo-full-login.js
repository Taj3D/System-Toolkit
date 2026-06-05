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
    
    await page.screenshot({ path: '/home/z/my-project/brevo-step1.png' });
    console.log('📸 Screenshot: brevo-step1.png');
    
    // Step 2: Fill email
    console.log('📝 Filling email...');
    const emailInput = await page.waitForSelector('input[type="email"], input[name="email"], #email', { timeout: 10000 });
    await emailInput.fill('conceptbd.net@gmail.com');
    
    // Step 3: Fill password
    console.log('📝 Filling password...');
    const passwordInput = await page.waitForSelector('input[type="password"], input[name="password"], #password', { timeout: 10000 });
    await passwordInput.fill('@@taj921988@@');
    
    await page.screenshot({ path: '/home/z/my-project/brevo-step2.png' });
    console.log('📸 Screenshot: brevo-step2.png');
    
    // Step 4: Click login
    console.log('🖱️ Clicking login button...');
    const loginButton = await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    await loginButton.click();
    
    // Wait for navigation
    console.log('⏳ Waiting for login to complete...');
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-step3.png' });
    console.log('📸 Screenshot: brevo-step3.png');
    console.log('📍 Current URL:', page.url());
    
    // Check if 2FA page
    const pageContent = await page.content();
    const currentUrl = page.url();
    
    if (currentUrl.includes('2fa') || pageContent.includes('verification code') || pageContent.includes('Enter the code')) {
      console.log('🔐 2FA page detected!');
      
      // Find and fill 2FA input
      const otpInput = await page.waitForSelector('input[type="text"], input[type="number"], input[inputmode="numeric"], input[id*="otp"], input[id*="code"]', { timeout: 10000 });
      
      // Fill OTP code
      const otpCode = '891489';
      console.log('📝 Entering OTP code:', otpCode);
      await otpInput.fill(otpCode);
      
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '/home/z/my-project/brevo-step4-2fa.png' });
      console.log('📸 Screenshot: brevo-step4-2fa.png');
      
      // Look for verify button
      const verifyButton = await page.$('button[type="submit"], button:has-text("Verify"), button:has-text("Continue")');
      if (verifyButton) {
        console.log('🖱️ Clicking verify button...');
        await verifyButton.click();
        await page.waitForTimeout(5000);
      }
      
      await page.screenshot({ path: '/home/z/my-project/brevo-step5-after-2fa.png' });
      console.log('📸 Screenshot: brevo-step5-after-2fa.png');
    }
    
    // Navigate to IP authorization page
    console.log('📍 Navigating to IP authorization page...');
    await page.goto('https://app.brevo.com/security/authorised_ips', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-step6-ip-page.png' });
    console.log('📸 Screenshot: brevo-step6-ip-page.png');
    
    // Get the page content
    const finalContent = await page.content();
    console.log('📄 Page title:', await page.title());
    console.log('📍 Final URL:', page.url());
    
    // Look for IP restriction toggle or button
    const toggleElements = await page.$$('button, [role="switch"], input[type="checkbox"], .toggle');
    console.log('🔍 Found', toggleElements.length, 'interactive elements');
    
    // Try to find disable IP restriction
    const disableButton = await page.$('button:has-text("Disable"), button:has-text("Turn off"), button:has-text("Deactivate")');
    if (disableButton) {
      console.log('🖱️ Found disable button, clicking...');
      await disableButton.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/home/z/my-project/brevo-step7-after-disable.png' });
      console.log('📸 Screenshot: brevo-step7-after-disable.png');
    }
    
    // Look for "Add IP" or "Authorize IP" option
    const addIpButton = await page.$('button:has-text("Add"), button:has-text("Authorize"), a:has-text("Add")');
    if (addIpButton) {
      console.log('🖱️ Found Add IP button');
    }
    
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: '/home/z/my-project/brevo-error.png' });
  }
  
  await browser.close();
}

main().catch(console.error);
