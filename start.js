const { spawn } = require('child_process');
const path = require('path');

// Change to the correct directory
process.chdir(__dirname);

// Run vite
const vite = spawn('npx', ['vite', '--host'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});