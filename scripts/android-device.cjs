const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const appRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(appRoot, '..');

const readEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((values, line) => {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);

      if (match && !line.trim().startsWith('#')) {
        values[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
      }

      return values;
    }, {});
};

const appEnv = readEnvFile(path.join(appRoot, '.env'));
const backendEnv = readEnvFile(path.join(workspaceRoot, 'baseball-backend', '.env'));

const getPortFromApiUrl = (value) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.port || (url.protocol === 'https:' ? '443' : '80');
  } catch {
    return null;
  }
};

const port =
  process.env.API_PORT ||
  getPortFromApiUrl(appEnv.EXPO_PUBLIC_API_BASE_URL) ||
  backendEnv.PORT ||
  '5000';

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: appRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

console.log(`Reversing Android device localhost:${port} to PC localhost:${port}`);
run('adb', ['reverse', `tcp:${port}`, `tcp:${port}`]);
run('npx', ['expo', 'run:android']);
