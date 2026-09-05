const { withAndroidManifest } = require('@expo/config-plugins');

const REPLACE_ATTRS = ['android:fullBackupContent', 'android:dataExtractionRules'];

function mergeToolsReplace(existingValue) {
  const values = new Set(
    String(existingValue || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );

  for (const attr of REPLACE_ATTRS) {
    values.add(attr);
  }

  return Array.from(values).join(',');
}

module.exports = function withSecureStoreBackupRules(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    const application = manifest.application?.[0];

    if (!manifest.$ || !application?.$) {
      return cfg;
    }

    manifest.$['xmlns:tools'] = manifest.$['xmlns:tools'] || 'http://schemas.android.com/tools';
    application.$['tools:replace'] = mergeToolsReplace(application.$['tools:replace']);

    return cfg;
  });
};
