require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.startsWith('replace_with')) {
    console.error('JWT_SECRET is missing. Set a long random value in server/.env (see .env.example).');
    process.exit(1);
  }

  try {
    await connectDB();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`DayCraft API listening on http://localhost:${PORT}`));
}

start();
