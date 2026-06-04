const { chromium } = require('playwright');

async function main() {
  const code = '424604';
  console.log('🚀 Using fresh 2FA code:', code);
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    // Navigate to login
    console.log('📍 Opening Brevo...');
    await page.goto('https://app.brevo.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Accept cookies
    const acceptBtn = await page.$('button:has-text("Accept")');
    if (acceptBtn) {
      await acceptBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Fill login
    console.log('📝 Filling credentials...');
    await page.fill('input[name="email"]', 'conceptbd.net@gmail.com');
    await page.fill('input[type="password"]', '@@taj921988@@');
    
    // Click login
    console.log('🖱️ Clicking Log In...');
    await page.click('button:has-text("Log In")');
    await page.waitForTimeout(5000);
    
    console.log('📍 URL:', page.url());
    
    // Enter 2FA code
    console.log('🔐 Entering code:', code);
    await page.fill('input[name="verification_code"]', code);
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-code-entered.png' });
    
    // Click verify
    const verifyBtn = await page.$('button:has-text("Verify")');
    if (verifyBtn) {
      console.log('🖱️ Clicking Verify...');
      await verifyBtn.click();
    } else {
      console.log('🖱️ Pressing Enter...');
      await page.keyboard.press('Enter');
    }
    
    await page.waitForTimeout(8000);
    
    console.log('📍 After verify URL:', page.url());
    await page.screenshot({ path: '/home/z/my-project/brevo-after-verify.png' });
    
    // Check result
    const pageText = await page.textContent('body');
    if (pageText.includes('invalid')) {
      console.log('❌ Invalid code message detected');
    } else if (!page.url().includes('2fa')) {
      console.log('✅ Login successful!');
    }
    
    // Navigate to IP settings
    console.log('📍 Going to IP settings...');
    await page.goto('https://app.brevo.com/settings/security/authorised-ips', { timeout: 30000 });
    await page.waitForTimeout(5000);
    
    console.log('📍 IP URL:', page.url());
    await page.screenshot({ path: '/home/z/my-project/brevo-ip-settings-final.png' });
    
    // Get page title
    console.log('📄 Title:', await page.title());
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: '/home/z/my-project/brevo-error-new.png' });
  }
  
  await browser.close();
}

main();
