const { chromium } = require('playwright');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🚀 Starting CONTINUOUS session...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate and fill
    console.log('📍 Navigating to Brevo...');
    await page.goto('https://app.brevo.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Accept cookies
    try { await page.click('button:has-text("Accept")'); await page.waitForTimeout(500); } catch(e) {}
    
    // Fill credentials
    console.log('📝 Filling credentials...');
    await page.fill('input[name="email"]', 'conceptbd.net@gmail.com');
    await page.fill('input[type="password"]', '@@taj921988@@');
    await page.click('button:has-text("Log In")');
    await page.waitForTimeout(4000);
    
    console.log('📍 2FA Page URL:', page.url());
    console.log('');
    console.log('📧 CHECK YOUR EMAIL NOW! Fresh 2FA code sent!');
    console.log('⏳ I am WAITING here for your code...');
    console.log('');
    
    // Wait for user input
    const code = await new Promise((resolve) => {
      rl.question('👉 Enter the 6-digit code from email: ', (answer) => {
        resolve(answer.trim());
      });
    });
    
    if (code && code.length === 6) {
      console.log('🔐 Entering code:', code);
      await page.fill('input[name="verification_code"]', code);
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: '/home/z/my-project/brevo-code-filled.png' });
      
      console.log('🖱️ Clicking Verify...');
      await page.click('button:has-text("Verify")');
      await page.waitForTimeout(6000);
      
      const afterUrl = page.url();
      console.log('📍 After verify URL:', afterUrl);
      await page.screenshot({ path: '/home/z/my-project/brevo-verified.png' });
      
      if (!afterUrl.includes('2fa')) {
        console.log('✅ LOGIN SUCCESSFUL!');
        
        // Go to IP settings
        console.log('📍 Going to IP authorization...');
        await page.goto('https://app.brevo.com/settings/security/authorised-ips');
        await page.waitForTimeout(4000);
        
        console.log('📍 IP Page URL:', page.url());
        await page.screenshot({ path: '/home/z/my-project/brevo-ip-final.png' });
        
        // Try to find and click toggle
        const toggle = await page.$('[role="switch"]');
        if (toggle) {
          const state = await toggle.getAttribute('aria-checked');
          console.log('🔄 Toggle found, state:', state);
          
          if (state === 'true') {
            console.log('🖱️ Clicking toggle to disable IP restriction...');
            await toggle.click();
            await page.waitForTimeout(3000);
            await page.screenshot({ path: '/home/z/my-project/brevo-ip-toggled.png' });
            console.log('✅ Toggle clicked!');
          }
        }
        
        // Check for other options
        const pageText = await page.textContent('body');
        console.log('📄 Page content length:', pageText.length);
        
      } else {
        console.log('❌ Code was invalid');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: '/home/z/my-project/brevo-cont-error.png' });
  }
  
  rl.close();
  await browser.close();
  console.log('✅ Session complete');
}

main();
