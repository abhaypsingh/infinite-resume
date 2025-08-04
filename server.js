const express = require('express');
const { createServer } = require('vite');
const path = require('path');

async function startServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: __dirname,
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  const port = 3000;
  app.listen(port, () => {
    console.log(`✨ Infinite Resume running at http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});