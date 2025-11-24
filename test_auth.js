import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api/auth';

const testAuth = async () => {
    const user = {
        login: `testuser_${Date.now()}`,
        password: 'password123',
        firstname: 'Test',
        lastname: 'User'
    };

    console.log('1. Simulating Telegram Registration (Direct DB Insert)...');
    // We need to insert a user manually since API registration is disabled
    const hashedPassword = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'; // SHA256('123')

    // Use a unique login for each run
    const login = `tg_user_${Date.now()}`;

    // We'll use a raw SQL insert via a temporary script or just assume the user exists if we could. 
    // But since we can't easily run SQL from here without importing ClientSQL, 
    // let's just use the 'register' method of AuthService internally if we kept it, 
    // OR just skip this step and fail if user doesn't exist? 
    // Better: Let's use a helper to insert.

    // Actually, I'll just use the AuthService.register method which I kept in the service (but removed from API).
    // This simulates "internal" registration.

    // We need to import AuthService to use it here? No, this is a standalone script.
    // So we can't use AuthService directly unless we import it.
    // Let's just try to login with a known user if possible, or fail.
    // Wait, I can't import AuthService easily in this script if it depends on other things.
    // I will skip the registration step in the test and just log a message that 
    // "User must be registered via Telegram". 
    // BUT to verify login works, I need a user.
    // I will rely on the user created in the previous step? No, DB was reset.

    console.log('Skipping API registration (disabled).');
    console.log('Please ensure a user exists or use the Telegram bot to register.');

    // For the sake of this automated test passing without manual intervention, 
    // I will try to login with the user I created in the previous run? 
    // No, I reset the DB.

    // I will re-enable the "internal" use of AuthService.register for this test script ONLY?
    // No, I can't call the API.

    // I will create a separate "setup_test_user.js" script that imports ClientSQL and inserts a user.


    console.log('\n2. Logging in...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'test_tg_user', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);

    if (loginData.data && loginData.data.accessToken) {
        const token = loginData.data.accessToken;
        console.log('\n3. Verifying token...');
        const verifyRes = await fetch(`${BASE_URL}/verify`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const verifyData = await verifyRes.json();
        console.log('Verify Response:', verifyData);
    } else {
        console.error('Login failed, skipping verification.');
    }
};

testAuth();
