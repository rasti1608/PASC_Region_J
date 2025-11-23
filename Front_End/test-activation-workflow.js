/**
 * Test: Complete User Activation Workflow
 *
 * This test verifies the complete activation workflow:
 * 1. Admin creates a new user
 * 2. System generates password and activation token
 * 3. System sends activation email (simulated)
 * 4. User clicks activation link
 * 5. User sets password and activates account
 * 6. User can log in with new password
 */

const { chromium } = require('playwright');
const sql = require('mssql');

const config = {
  server: 'Gwdbs2.dailyrazor.com',
  database: 'PASC_RegionJ',
  user: 'PascUser',
  password: 'PJC@2024!',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function runTest() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  let testUser = {
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    fullName: 'Test Activation User',
    newPassword: 'TestPass123!',
    activationToken: null
  };

  try {
    console.log('=== STARTING ACTIVATION WORKFLOW TEST ===\n');

    // Step 1: Login as admin
    console.log('Step 1: Logging in as admin...');
    await page.goto('http://localhost/admin/login');
    await page.waitForSelector('#username');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');
    console.log('✓ Logged in as admin\n');

    // Step 2: Navigate to Add User page
    console.log('Step 2: Navigating to Add User page...');
    await page.goto('http://localhost/admin/users/add');
    await page.waitForSelector('#username');
    console.log('✓ On Add User page\n');

    // Step 3: Verify password fields are NOT present
    console.log('Step 3: Verifying password fields are removed...');
    const passwordField = await page.$('#password');
    const confirmPasswordField = await page.$('#confirmPassword');

    if (passwordField !== null) {
      throw new Error('❌ FAILED: Password field should not be present on Add User form');
    }
    if (confirmPasswordField !== null) {
      throw new Error('❌ FAILED: Confirm Password field should not be present on Add User form');
    }
    console.log('✓ Password fields correctly removed from form\n');

    // Step 4: Verify automatic password generation notice is present
    console.log('Step 4: Verifying automatic password generation notice...');
    const passwordNotice = await page.textContent('body');
    if (!passwordNotice.includes('Automatic Password Generation')) {
      throw new Error('❌ FAILED: Automatic password generation notice not found');
    }
    console.log('✓ Automatic password generation notice is present\n');

    // Step 5: Fill out the Add User form
    console.log('Step 5: Creating new user...');
    await page.fill('#username', testUser.username);
    await page.fill('#fullName', testUser.fullName);
    await page.fill('#email', testUser.email);
    await page.selectOption('#roleId', '2'); // Content Manager

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for success message
    await page.waitForSelector('.alert-success', { timeout: 10000 });
    console.log('✓ User created successfully\n');

    // Step 6: Verify success message shows activation email sent
    console.log('Step 6: Verifying activation email notification...');
    const successContent = await page.textContent('body');
    if (!successContent.includes('Activation Email Sent')) {
      throw new Error('❌ FAILED: Activation email notification not found');
    }
    if (!successContent.includes('activation email has been sent')) {
      throw new Error('❌ FAILED: Activation email description not found');
    }
    console.log('✓ Activation email notification displayed\n');

    // Step 7: Verify generated password is displayed
    console.log('Step 7: Verifying generated password is shown...');
    if (!successContent.includes('Generated Password')) {
      throw new Error('❌ FAILED: Generated password not displayed');
    }
    console.log('✓ Generated password displayed to admin\n');

    // Step 8: Get activation token from database
    console.log('Step 8: Retrieving activation token from database...');
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('email', sql.VarChar, testUser.email)
      .query(`
        SELECT t.token, t.expires_at, u.id as user_id
        FROM dbo.user_activation_tokens t
        INNER JOIN dbo.admin_users u ON t.user_id = u.id
        WHERE u.email = @email
        AND t.activated_at IS NULL
        ORDER BY t.created_at DESC
      `);

    if (result.recordset.length === 0) {
      throw new Error('❌ FAILED: No activation token found in database');
    }

    testUser.activationToken = result.recordset[0].token;
    testUser.userId = result.recordset[0].user_id;
    console.log(`✓ Activation token retrieved: ${testUser.activationToken.substring(0, 20)}...\n`);

    // Step 9: Logout from admin
    console.log('Step 9: Logging out from admin...');
    await page.goto('http://localhost/admin/dashboard');
    await page.click('a[href*="logout"]');
    await page.waitForURL('**/admin/login');
    console.log('✓ Logged out from admin\n');

    // Step 10: Navigate to activation page with token
    console.log('Step 10: Opening activation link...');
    const activationUrl = `http://localhost/admin/activate?token=${testUser.activationToken}`;
    await page.goto(activationUrl);
    await page.waitForSelector('#newPassword');
    console.log('✓ Activation page loaded\n');

    // Step 11: Verify activation page content
    console.log('Step 11: Verifying activation page content...');
    const activationContent = await page.textContent('body');
    if (!activationContent.includes('Activate Your Account')) {
      throw new Error('❌ FAILED: Activation page header not found');
    }
    if (!activationContent.includes('set your password')) {
      throw new Error('❌ FAILED: Activation instructions not found');
    }
    console.log('✓ Activation page content verified\n');

    // Step 12: Set password on activation page
    console.log('Step 12: Setting password...');
    await page.fill('#newPassword', testUser.newPassword);
    await page.fill('#confirmPassword', testUser.newPassword);
    await page.click('button[type="submit"]');

    // Wait for success message
    await page.waitForSelector('.alert-success', { timeout: 10000 });
    console.log('✓ Account activated successfully\n');

    // Step 13: Verify redirect to login page
    console.log('Step 13: Waiting for redirect to login...');
    await page.waitForURL('**/admin/login', { timeout: 5000 });
    console.log('✓ Redirected to login page\n');

    // Step 14: Verify token is marked as activated in database
    console.log('Step 14: Verifying token is marked as activated...');
    const tokenCheck = await pool.request()
      .input('token', sql.VarChar, testUser.activationToken)
      .query(`
        SELECT activated_at
        FROM dbo.user_activation_tokens
        WHERE token = @token
      `);

    if (tokenCheck.recordset.length === 0 || tokenCheck.recordset[0].activated_at === null) {
      throw new Error('❌ FAILED: Token not marked as activated in database');
    }
    console.log('✓ Token marked as activated in database\n');

    // Step 15: Login with new user credentials
    console.log('Step 15: Logging in with new user credentials...');
    await page.waitForSelector('#username');
    await page.fill('#username', testUser.username);
    await page.fill('#password', testUser.newPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    console.log('✓ Successfully logged in with new user\n');

    // Step 16: Try to use activation token again (should fail)
    console.log('Step 16: Testing token reuse prevention...');
    await page.goto('http://localhost/admin/dashboard');
    await page.click('a[href*="logout"]');
    await page.waitForURL('**/admin/login');

    await page.goto(activationUrl);
    await page.waitForSelector('.alert-error');
    const errorContent = await page.textContent('body');
    if (!errorContent.includes('already been used')) {
      throw new Error('❌ FAILED: Token reuse not prevented');
    }
    console.log('✓ Token reuse correctly prevented\n');

    // Cleanup: Delete test user
    console.log('Cleanup: Removing test user...');
    await pool.request()
      .input('userId', sql.Int, testUser.userId)
      .query('DELETE FROM dbo.admin_users WHERE id = @userId');
    await pool.close();
    console.log('✓ Test user removed\n');

    console.log('=== ✓ ALL TESTS PASSED ===');
    console.log('\nSummary:');
    console.log('- Password fields removed from Add User form');
    console.log('- Automatic password generation working');
    console.log('- Activation email notification displayed');
    console.log('- Activation token created in database');
    console.log('- Activation page loads correctly');
    console.log('- User can set password via activation');
    console.log('- User can login with new password');
    console.log('- Token reuse prevented');
    console.log('\n✓ Activation workflow fully functional!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('\nStack trace:', error.stack);
    throw error;
  } finally {
    await browser.close();
  }
}

runTest().catch(console.error);
