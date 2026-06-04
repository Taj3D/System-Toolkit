const { chromium } = require('playwright');

async function main() {
  console.log('🚀 Starting Brevo login process...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to login page
    console.log('📍 Navigating to Brevo login...');
    await page.goto('https://app.brevo.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    // Accept cookies first
    try {
      const acceptCookies = await page.$('button:has-text("Accept")');
      if (acceptCookies) {
        console.log('🍪 Accepting cookies...');
        await acceptCookies.click();
        await page.waitForTimeout(2000);
      }
    } catch (e) {}
    
    await page.screenshot({ path: '/home/z/my-project/brevo-v3-1-initial.png' });
    console.log('📸 Screenshot: brevo-v3-1-initial.png');
    
    // Find email input using various selectors
    console.log('📝 Looking for email input...');
    let emailInput = null;
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[id*="email"]',
      'input[placeholder*="email" i]',
      '#email'
    ];
    
    for (const selector of emailSelectors) {
      try {
        emailInput = await page.$(selector);
        if (emailInput) {
          console.log('✅ Found email input with selector:', selector);
          break;
        }
      } catch (e) {}
    }
    
    if (!emailInput) {
      // Try to find by label
      console.log('🔍 Trying to find email by label...');
      emailInput = await page.$('text=Email address >> .. >> input');
    }
    
    if (emailInput) {
      console.log('📝 Filling email...');
      await emailInput.fill('conceptbd.net@gmail.com');
    } else {
      console.log('❌ Could not find email input');
    }
    
    // Find password input
    console.log('📝 Looking for password input...');
    let passwordInput = null;
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[id*="password"]',
      '#password'
    ];
    
    for (const selector of passwordSelectors) {
      try {
        passwordInput = await page.$(selector);
        if (passwordInput) {
          console.log('✅ Found password input with selector:', selector);
          break;
        }
      } catch (e) {}
    }
    
    if (passwordInput) {
      console.log('📝 Filling password...');
      await passwordInput.fill('@@taj921988@@');
    } else {
      console.log('❌ Could not find password input');
    }
    
    await page.screenshot({ path: '/home/z/my-project/brevo-v3-2-filled.png' });
    console.log('📸 Screenshot: brevo-v3-2-filled.png');
    
    // Find and click Log In button
    console.log('🖱️ Looking for Log In button...');
    const loginButton = await page.$('button:has-text("Log In"):not(:has-text("Sign"))');
    if (loginButton) {
      console.log('🖱️ Clicking Log In button...');
      await loginButton.click();
    } else {
      console.log('❌ Could not find Log In button');
    }
    
    // Wait for navigation
    console.log('⏳ Waiting for response...');
    await page.waitForTimeout(8000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-v3-3-after-click.png' });
    console.log('📸 Screenshot: brevo-v3-3-after-click.png');
    console.log('📍 Current URL:', page.url());
    
    // Check page state
    const currentUrl = page.url();
    const pageText = await page.textContent('body');
    
    if (currentUrl.includes('2fa') || pageText.includes('verification') || pageText.includes('code')) {
      console.log('🔐 2FA page detected!');
      
      await page.waitForTimeout(2000);
      
      // Try to find and fill OTP
      const allInputs = await page.$$('input');
      console.log('🔍 Found', allInputs.length, 'input elements');
      
      // Check input types
      for (let i = 0; i < allInputs.length; i++) {
        const input = allInputs[i];
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        console.log(`  Input ${i}: type=${type}, name=${name}, id=${id}`);
      }
      
      // Fill OTP
      const otpCode = '891489';
      const otpInput = await page.$('input[type="text"]:not([name])') || 
                       await page.$('input[inputmode="numeric"]') ||
                       await page.$('input[maxlength="6"]');
      
      if (otpInput) {
        console.log('📝 Filling OTP code...');
        await otpInput.fill(otpCode);
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: '/home/z/my-project/brevo-v3-4-otp.png' });
        console.log('📸 Screenshot: brevo-v3-4-otp.png');
        
        // Submit
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);
      }
      
      await page.screenshot({ path: '/home/z/my-project/brevo-v3-5-after-otp.png' });
      console.log('📸 Screenshot: brevo-v3-5-after-otp.png');
    }
    
    // Try to navigate to security settings
    console.log('📍 Navigating to security settings...');
    await page.goto('https://app.brevo.com/settings/security/authorised-ips', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-v3-6-security.png' });
    console.log('📸 Screenshot: brevo-v3-6-security.png');
    console.log('📍 Security Page URL:', page.url());
    
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: '/home/z/my-project/brevo-v3-error.png' });
  }
  
  await browser.close();
}

main().catch(console.error);
