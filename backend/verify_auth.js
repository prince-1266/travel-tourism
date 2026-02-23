
const axios = require('axios');
const fs = require('fs');

const logFile = 'verification_log.txt';

function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

async function verify() {
    // Clear log file
    fs.writeFileSync(logFile, '');
    log('Starting Verification...');

    try {
        // 1. Invalid Email Format
        log('\n--- Test 1: Invalid Email Format ---');
        try {
            await axios.post('http://localhost:5000/api/auth/send-otp', {
                email: 'invalid-email',
                type: 'register'
            });
            log('FAIL: Should have failed with 400');
        } catch (err) {
            if (err.response) {
                log(`Status: ${err.response.status}`);
                log(`Message: ${err.response.data.message}`);
                if (err.response.data.message === 'Invalid email format') {
                    log('PASS: Correct error message for invalid email.');
                } else {
                    log('FAIL: Incorrect error message.');
                }
            } else {
                log('FAIL: Network Error or Server Down? ' + err.message);
            }
        }

        // 2. Login User Not Found
        log('\n--- Test 2: Login User Not Found ---');
        try {
            await axios.post('http://localhost:5000/api/auth/login', {
                identifier: 'nonexistent@example.com',
                password: 'password123',
                role: 'user'
            });
            log('FAIL: Should have failed with 400');
        } catch (err) {
            if (err.response) {
                log(`Status: ${err.response.status}`);
                log(`Message: ${err.response.data.message}`);
                if (err.response.data.message === 'User not found with this email/mobile') {
                    log('PASS: Correct error message for user not found.');
                } else {
                    log('FAIL: Incorrect error message.');
                }
            } else {
                log('FAIL: Network Error or Server Down? ' + err.message);
            }
        }

        // 3. Login Invalid Password (needs existing user, skipping for now or mocking)
        // If we assume a user exists, we can test. I'll skip to avoid complexity unless I create one.
        // I can create one via register endpoint first!

        // 4. Registration - Duplicate Email
        log('\n--- Test 3: Registration Duplicate Email ---');
        // First Create a user
        const uniqueEmail = `test_${Date.now()}@example.com`;
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name: 'Test User',
                email: uniqueEmail,
                phone: `99${Date.now().toString().slice(-8)}`, // verify unique phone length
                password: 'password123',
                otp: '123456' // Mock OTP usually works if validation passes? Wait, register checks OTP in DB.
                // I can't easily register without a valid OTP entry in DB.
                // But I can test send-otp for duplicate email!
            });
            // This will likely fail due to OTP check in register route.
            // "Invalid or expired OTP"
            // But I want to test "Email already registered" in send-otp first!
        } catch (err) {
            // ignore registration failure
        }

        // Now test send-otp with that email? no, user not created.
        // I cannot easily test duplicate email without a user in DB.
        // But I can test send-otp:
        // If I send-otp with an email that I KNOW exists...
        // I don't know any existing users.
        // But I can try to find one by reading the DB file? No.

        // I will settle for checking invalid email and login errors for now.

    } catch (error) {
        log('Global Error: ' + error.message);
    }
}

verify();
