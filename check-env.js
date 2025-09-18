require('dotenv').config();

console.log('🔍 Current environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Check if .env file exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
console.log('\n📁 .env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('\n📄 .env file content:');
    const lines = envContent.split('\n');
    lines.forEach((line, index) => {
        if (line.trim() && !line.startsWith('#')) {
            // Hide password in output
            if (line.includes('DATABASE_URL')) {
                const hiddenUrl = line.replace(/:[^:@]*@/, ':****@');
                console.log(`${index + 1}: ${hiddenUrl}`);
            } else {
                console.log(`${index + 1}: ${line}`);
            }
        }
    });
}