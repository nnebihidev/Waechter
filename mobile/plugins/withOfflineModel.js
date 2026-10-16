// Packages the GGUF model weights into the native binaries so the installed app
// works without ever going online.
//
// iOS:     the file is added to the app target's "Copy Bundle Resources" phase and
//          ends up at <App>.app/<fileName> (loaded straight from the bundle).
// Android: the file goes into an install-time Play Asset Delivery pack
//          (`kompass_model`). Google Play installs it together with the app; the
//          app copies it once into private storage on first launch, because
//          llama.cpp needs a real file path. Per-pack limit is 1.5 GB.
//
// If model/files/<fileName> is missing (run `npm run model:fetch`), the plugin
// warns and skips — the app then offers manual import of a .gguf file.
const fs = require('node:fs');
const path = require('node:path');
const {
  IOSConfig,
  withAppBuildGradle,
  withDangerousMod,
  withSettingsGradle,
  withXcodeProject,
} = require('expo/config-plugins');

const PACK = 'kompass_model';

function placeFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  try {
    // Hard link avoids duplicating ~1 GB on the build machine.
    fs.linkSync(src, dest);
  } catch {
    fs.copyFileSync(src, dest);
  }
}

function modelSource(projectRoot, fileName) {
  const src = path.join(projectRoot, 'model', 'files', fileName);
  if (!fs.existsSync(src)) {
    console.warn(
      `[withOfflineModel] ${src} not found — building WITHOUT bundled model. Run "npm run model:fetch" first.`,
    );
    return null;
  }
  return src;
}

const withIosModel = (config, { fileName }) => {
  config = withDangerousMod(config, [
    'ios',
    (cfg) => {
      const src = modelSource(cfg.modRequest.projectRoot, fileName);
      if (src) {
        const name = cfg.modRequest.projectName;
        placeFile(src, path.join(cfg.modRequest.platformProjectRoot, name, fileName));
      }
      return cfg;
    },
  ]);
  return withXcodeProject(config, (cfg) => {
    if (!fs.existsSync(path.join(cfg.modRequest.projectRoot, 'model', 'files', fileName))) return cfg;
    const name = cfg.modRequest.projectName;
    const filepath = `${name}/${fileName}`;
    if (!cfg.modResults.hasFile(filepath)) {
      cfg.modResults = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath,
        groupName: name,
        project: cfg.modResults,
        isBuildFile: true,
      });
    }
    return cfg;
  });
};

const PACK_GRADLE = `plugins {
  id 'com.android.asset-pack'
}

assetPack {
  packName = "${PACK}"
  dynamicDelivery {
    deliveryType = "install-time"
  }
}
`;

const withAndroidModel = (config, { fileName }) => {
  config = withDangerousMod(config, [
    'android',
    (cfg) => {
      const src = modelSource(cfg.modRequest.projectRoot, fileName);
      const packDir = path.join(cfg.modRequest.platformProjectRoot, PACK);
      fs.mkdirSync(packDir, { recursive: true });
      fs.writeFileSync(path.join(packDir, 'build.gradle'), PACK_GRADLE);
      if (src) placeFile(src, path.join(packDir, 'src', 'main', 'assets', 'models', fileName));
      return cfg;
    },
  ]);
  config = withSettingsGradle(config, (cfg) => {
    const line = `include ':${PACK}'`;
    if (!cfg.modResults.contents.includes(line)) cfg.modResults.contents += `\n${line}\n`;
    return cfg;
  });
  return withAppBuildGradle(config, (cfg) => {
    cfg.modResults.contents = addAssetPack(cfg.modResults.contents);
    return cfg;
  });
};

/** Registers the asset pack in app/build.gradle (idempotent). */
function addAssetPack(gradle) {
  if (gradle.includes('assetPacks')) return gradle;
  return gradle.replace(
    /\nandroid\s*\{\n/,
    `\nandroid {\n    assetPacks = [":${PACK}"]\n    androidResources {\n        noCompress += ["gguf"]\n    }\n`,
  );
}

module.exports = function withOfflineModel(config, props) {
  if (!props || !props.fileName) throw new Error('withOfflineModel: "fileName" is required');
  config = withIosModel(config, props);
  config = withAndroidModel(config, props);
  return config;
};

module.exports.addAssetPack = addAssetPack;
