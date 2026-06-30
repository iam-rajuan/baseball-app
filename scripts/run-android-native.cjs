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

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: appRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const clearReadOnly = (targetPath) => {
  if (!fs.existsSync(targetPath) || process.platform !== 'win32') {
    return;
  }

  spawnSync('attrib', ['-R', `${targetPath}\\*`, '/S', '/D'], {
    cwd: appRoot,
    stdio: 'ignore',
    shell: true,
  });
};

const removeDirectory = (relativePath) => {
  const targetPath = path.join(appRoot, relativePath);

  if (!fs.existsSync(targetPath)) {
    return;
  }

  clearReadOnly(targetPath);
  fs.rmSync(targetPath, { recursive: true, force: true });
  console.log(`Removed stale native build cache: ${relativePath}`);
};

const removeAndroidBuildDirectoriesInNodeModules = () => {
  const nodeModulesPath = path.join(appRoot, 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    return;
  }

  const visit = (currentPath, relativePath = 'node_modules') => {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const entryPath = path.join(currentPath, entry.name);
      const entryRelativePath = path.join(relativePath, entry.name);

      if (entry.name === 'android') {
        const buildPath = path.join(entryPath, 'build');

        if (fs.existsSync(buildPath)) {
          removeDirectory(path.join(entryRelativePath, 'build'));
        }

        continue;
      }

      if (entry.name === '.bin') {
        continue;
      }

      visit(entryPath, entryRelativePath);
    }
  };

  visit(nodeModulesPath);
};

const stopGradle = () => {
  const gradleWrapper = path.join(appRoot, 'android', 'gradlew.bat');

  if (fs.existsSync(gradleWrapper)) {
    spawnSync(gradleWrapper, ['--stop'], {
      cwd: path.join(appRoot, 'android'),
      stdio: 'ignore',
      shell: true,
    });
  }
};

const shouldReverseLocalhost = () => {
  const baseUrl = appEnv.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (!baseUrl) {
    return false;
  }

  try {
    const url = new URL(baseUrl);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
};

const port =
  process.env.API_PORT ||
  getPortFromApiUrl(appEnv.EXPO_PUBLIC_API_BASE_URL) ||
  backendEnv.PORT ||
  '5000';

stopGradle();

[
  'android/.gradle',
  'android/app/build',
].forEach(removeDirectory);

removeAndroidBuildDirectoriesInNodeModules();

if (shouldReverseLocalhost()) {
  console.log(`Reversing Android device localhost:${port} to PC localhost:${port}`);
  run('adb', ['reverse', `tcp:${port}`, `tcp:${port}`]);
}

run('npx', ['expo', 'run:android']);
