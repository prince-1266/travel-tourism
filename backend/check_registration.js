const axios = require('axios');

async function testRegistration() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test User',
            email: 'invalid-email', // user said this registers successfully
            phone: '1234567890',
            password: 'password123'
        });
        console.log('Registration SUCCESS (Unexpected):', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Registration FAILED (Expected):', error.response.status, error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testRegistration();
