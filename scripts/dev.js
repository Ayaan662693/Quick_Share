const { spawn } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const services = [
  {
    name: 'backend',
    cwd: path.join(rootDir, 'backend'),
    entry: path.join(rootDir, 'backend', 'node_modules', 'nodemon', 'bin', 'nodemon.js'),
    args: ['server.js'],
    env: { ...process.env, PORT: '5001' },
  },
  {
    name: 'frontend',
    cwd: path.join(rootDir, 'frontend'),
    entry: path.join(rootDir, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js'),
    args: [],
    env: process.env,
  },
];

const children = [];
let stopping = false;

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exitCode = exitCode;
}

for (const service of services) {
  const child = spawn(process.execPath, [service.entry, ...service.args], {
    cwd: service.cwd,
    env: service.env,
    stdio: 'inherit',
  });
  children.push(child);

  child.on('error', (error) => {
    console.error(`[${service.name}] Could not start: ${error.message}`);
    stopAll(1);
  });

  child.on('exit', (code, signal) => {
    if (stopping) return;
    if (signal) {
      stopAll(0);
    } else {
      console.error(`[${service.name}] Stopped${code ? ` with exit code ${code}` : ''}.`);
      stopAll(code || 0);
    }
  });
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
