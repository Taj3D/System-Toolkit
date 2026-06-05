const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  console.log('🌐 Opening Brevo...');
  await page.goto('https://app.brevo.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Check if already logged in or need to login
  const url = page.url();
  console.log('Current URL:', url);
  
  if (url.includes('login') || !url.includes('dashboard')) {
    console.log('📝 Need to login...');
    
    // Wait for page
    await page.waitForTimeout(2000);
    
    // Find and fill email
    const emailInput = await page.locator('input[type="email"], input[name*="email"]').first();
    await emailInput.fill('conceptbd.net@gmail.com');
    console.log('✅ Email filled');
    
    // Find and fill password
    const pwdInput = await page.locator('input[type="password"]').first();
    await pwdInput.fill('@@taj921988@@');
    console.log('✅ Password filled');
    
    await page.screenshot({ path: '/home/z/my-project/brevo-filled.png' });
    
    // Click login
    const loginBtn = await page.locator('button').filter({ hasText: 'Log' }).first();
    await loginBtn.click();
    console.log('🖱️ Clicked login');
    
    await page.waitForTimeout(4000);
  }
  
  const newUrl = page.url();
  console.log('URL after login:', newUrl);
  await page.screenshot({ path: '/home/z/my-project/brevo-after-login.png' });
  
  // Check page content
  const body = await page.innerText('body');
  
  if (body.includes('verification') || body.includes('Verify') || newUrl.includes('2fa')) {
    console.log('');
    console.log('========================================');
    console.log('🔐 2FA PAGE - NEED CODE FROM EMAIL!');
    console.log('📧 Check: conceptbd.net@gmail.com');
    console.log('========================================');
    console.log('');
    
    // Get page details
    console.log('Page preview:', body.substring(0, 300));
    
    // Wait for code - the code must be provided RIGHT NOW
    // Check if there's already a code input visible
    const codeInput = await page.locator('input:visible').first();
    console.log('Code input found:', await codeInput.count());
    
    // Keep browser open for 30 seconds waiting for code
    console.log('⏳ Waiting 30 seconds for code...');
    await page.waitForTimeout(30000);
    
  } else if (!newUrl.includes('login')) {
    console.log('✅ Already logged in!');
    
    // Go to IP settings
    await page.goto('https://app.brevo.com/security/authorised_ips');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '/home/z/my-project/brevo-ip-page.png', fullPage: true });
    
    const ipContent = await page.innerText('body');
    console.log('📄 IP Page:');
    console.log(ipContent.substring(0, 2000));
  }
  
  await browser.close();
})();
