const { chromium } = require('playwright');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    await page.waitForTimeout(3000);
    
    // Accept cookies
    try {
      const acceptCookies = await page.$('button:has-text("Accept")');
      if (acceptCookies) {
        await acceptCookies.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}
    
    // Fill login form
    console.log('📝 Filling login credentials...');
    await page.fill('input[name="email"]', 'conceptbd.net@gmail.com');
    await page.fill('input[type="password"]', '@@taj921988@@');
    
    // Click Log In
    await page.click('button:has-text("Log In"):not(:has-text("Sign"))');
    await page.waitForTimeout(5000);
    
    console.log('📍 Current URL:', page.url());
    
    // Check if we're on 2FA page
    const currentUrl = page.url();
    if (currentUrl.includes('2fa')) {
      console.log('🔐 On 2FA page - need verification code');
      
      // Click resend if available
      try {
        const resendBtn = await page.$('button:has-text("Resend"), a:has-text("Resend")');
        if (resendBtn) {
          console.log('📧 Clicking Resend to get new code...');
          await resendBtn.click();
          await page.waitForTimeout(3000);
        }
      } catch (e) {}
      
      await page.screenshot({ path: '/home/z/my-project/brevo-waiting-for-code.png' });
      console.log('📸 Screenshot saved: brevo-waiting-for-code.png');
      console.log('');
      console.log('⚠️  PLEASE PROVIDE A FRESH 2FA CODE FROM YOUR EMAIL');
      console.log('⏳ Waiting for code input (30 seconds)...');
      
      // Wait for user input with timeout
      const code = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.log('⏰ Timeout - no code received');
          resolve(null);
        }, 30000);
        
        rl.question('Enter 2FA code: ', (answer) => {
          clearTimeout(timeout);
          resolve(answer.trim());
        });
      });
      
      if (code && code.length === 6) {
        console.log('📝 Entering code:', code);
        await page.fill('input[name="verification_code"]', code);
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: '/home/z/my-project/brevo-code-entered-new.png' });
        
        // Submit
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);
        
        await page.screenshot({ path: '/home/z/my-project/brevo-after-verify-new.png' });
        console.log('📍 After verify URL:', page.url());
        
        // Navigate to IP settings
        console.log('📍 Navigating to IP authorization...');
        await page.goto('https://app.brevo.com/settings/security/authorised-ips', { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });
        await page.waitForTimeout(5000);
        
        await page.screenshot({ path: '/home/z/my-project/brevo-ip-settings.png' });
        console.log('📸 Screenshot: brevo-ip-settings.png');
        console.log('📍 IP Settings URL:', page.url());
      }
    }
    
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: '/home/z/my-project/brevo-wait-error.png' });
  }
  
  rl.close();
  await browser.close();
}

main().catch(console.error);
