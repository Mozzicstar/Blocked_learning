import 'dotenv/config';
import app from './app.js';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';

const start = async () => {
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📚 API Docs will be available at http://localhost:${PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
