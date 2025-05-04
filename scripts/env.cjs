const fs = require('fs');

const defaultEnvContent = `DATABASE_URL="postgresql://root:root@localhost:5442/api"
JWT_SECRET="your-secret-key-here"
COOKIE_SECRET="your-cookie-secret-here"
SERVER_AUTHENTICATION_SECRET="your-secret-key-here"
NODE_ENV="development"
PORT=3000
VITE_API_URL="http://localhost:3000"`;

try {
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', defaultEnvContent);
    console.log('.env file created with default values.');
  } else {
    console.log('.env file already exists.');
  }
} catch (error) {
  console.error(`Could not ensure .env: ${error.message}`);
}
