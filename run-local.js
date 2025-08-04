#!/usr/bin/env node
const { createServer } = require('vite');
const path = require('path');

async function startDevServer() {
  const server = await createServer({
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    root: __dirname,
    server: {
      port: 3000,
      open: true
    }
  });
  
  await server.listen();
  
  console.log('\n✨ Infinite Resume is running!\n');
  server.printUrls();
  console.log('\nPress Ctrl+C to stop the server');
}

startDevServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});