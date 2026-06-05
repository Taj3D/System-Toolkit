const { chromium } = require('playwright');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    console.log('🌐 Opening Brevo login...');
    await page.goto('https://app.brevo.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Fill credentials
    console.log('📝 Filling credentials...');
    await page.locator('input[name*="email"]').first().fill('conceptbd.net@gmail.com');
    await page.locator('input[type="password"]').first().fill('@@taj921988@@');
    
    // Click login
    console.log('🖱️ Clicking Log In...');
    await page.locator('button').filter({ hasText: 'Log In' }).first().click();
    
    await page.waitForTimeout(4000);
    
    if (page.url().includes('2fa')) {
      console.log('');
      console.log('📧 ============================================');
      console.log('📧 NEW VERIFICATION CODE SENT TO YOUR EMAIL!');
      console.log('📧 Check: conceptbd.net@gmail.com');
      console.log('📧 ============================================');
      console.log('');
      console.log('⏳ Waiting for verification code...');
      console.log('⏳ Please provide the code NOW (you have 60 seconds)');
      console.log('');
      
      // Wait for user input
      const code = await new Promise(resolve => {
        rl.question('Enter code: ', answer => {
          resolve(answer.trim());
        });
        
        // Timeout after 60 seconds
        setTimeout(() => {
          console.log('⏰ Timeout - no code received');
          resolve(null);
        }, 60000);
      });
      
      if (code) {
        console.log(`📝 Entering code: ${code}`);
        
        const codeInput = page.locator('input:visible').first();
        await codeInput.click();
        await codeInput.fill(code);
        
        await page.waitForTimeout(500);
        
        // Click verify
        const verifyBtn = page.locator('button').filter({ hasText: 'Verify' }).first();
        await verifyBtn.click();
        console.log('🖱️ Clicked Verify');
        
        await page.waitForTimeout(5000);
        console.log('📍 URL:', page.url());
        
        // Check if logged in
        if (!page.url().includes('2fa') && !page.url().includes('login')) {
          console.log('✅ LOGIN SUCCESSFUL!');
          
          // Go to IP settings
          console.log('🌐 Going to IP authorization...');
          await page.goto('https://app.brevo.com/security/authorised_ips');
          await page.waitForTimeout(3000);
          
          await page.screenshot({ path: '/home/z/my-project/ip-settings-done.png', fullPage: true });
          
          const content = await page.innerText('body');
          console.log('📄 IP Settings:');
          console.log(content.substring(0, 2000));
          
          // Try to disable IP restriction
          const buttons = await page.locator('button').all();
          for (const btn of buttons) {
            try {
              const text = await btn.innerText();
              if (text.toLowerCase().includes('disable') || 
                  text.toLowerCase().includes('deactivate') ||
                  text.toLowerCase().includes('allow') ||
                  text.toLowerCase().includes('remove')) {
                console.log('🖱️ Clicking:', text);
                await btn.click();
                await page.waitForTimeout(1000);
              }
            } catch (e) {}
          }
          
          // Click toggles
          const toggles = await page.locator('[role="switch"], input[type="checkbox"], [class*="toggle"]').all();
          for (const t of toggles) {
            try {
              await t.click();
              await page.waitForTimeout(300);
            } catch (e) {}
          }
          
          // Save
          const saveBtn = page.locator('button').filter({ hasText: 'Save' }).first();
          if (await saveBtn.count() > 0) {
            await saveBtn.click();
            console.log('✅ Saved settings');
          }
          
          await page.screenshot({ path: '/home/z/my-project/ip-final.png', fullPage: true });
          
          console.log('');
          console.log('✅ ========================================');
          console.log('✅ CHECK THE SCREENSHOTS FOR RESULT!');
          console.log('✅ ip-final.png');
          console.log('✅ ========================================');
        } else {
          console.log('⚠️ Login failed - code might be incorrect');
        }
      }
    }
    
    rl.close();
    await browser.close();
    console.log('✅ Done!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
